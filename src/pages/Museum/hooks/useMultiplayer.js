import { useState, useEffect, useRef, useCallback } from 'react';
import { getWsUrl } from '@services/multiplayer';

const NEON_COLORS = [
  "#38bdf8", // Sky Blue
  "#ef4444", // Red
  "#22c55e", // Green
  "#8b5cf6", // Violet
  "#f97316", // Orange
  "#84cc16", // Lime
  "#06b6d4", // Cyan
  "#ec4899", // Pink
];

// Must match NORMAL_HEIGHT in Player.jsx
const EYE_HEIGHT = 3.8;

export const useMultiplayer = (roomId = "default") => {
  // Detect admin status from existing auth system
  const isAdmin = Boolean(localStorage.getItem('admin_token'));

  // 1. Initialize visitor credentials from localStorage or create new defaults
  const [visitorId] = useState(() => {
    let savedId = localStorage.getItem('museum_visitor_id');
    if (!savedId) {
      savedId = 'v-' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('museum_visitor_id', savedId);
    }
    return savedId;
  });

  const [visitorName, setVisitorName] = useState(() => {
    // Admin gets a fixed default name
    if (isAdmin) return "Abdul Mannan Saipi";
    let savedName = localStorage.getItem('museum_visitor_name');
    if (!savedName) {
      savedName = "Visitor #" + visitorId.substring(2, 6).toUpperCase();
      localStorage.setItem('museum_visitor_name', savedName);
    }
    return savedName;
  });

  const [visitorColor, setVisitorColor] = useState(() => {
    // Admin gets a gold color
    if (isAdmin) return "#f59e0b";
    let savedColor = localStorage.getItem('museum_visitor_color');
    if (!savedColor) {
      savedColor = NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];
      localStorage.setItem('museum_visitor_color', savedColor);
    }
    return savedColor;
  });

  const [isConnected, setIsConnected] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [ping, setPing] = useState(0);
  
  // React state for adding/removing player components in DOM when someone joins/leaves
  const [activePlayersList, setActivePlayersList] = useState([]);

  // High-performance Ref dictionary for real-time 60FPS coordinate interpolation without React re-renders!
  // Structure: playersRef.current[id] = { id, name, color, position: [x,y,z], targetPosition: [x,y,z], rotation: [ry], targetRotation: [ry], speechText: "", speechEndTime: 0 }
  const playersRef = useRef({});
  const wsRef = useRef(null);
  const lastMoveSendTimeRef = useRef(0);
  const reconnectTimeoutRef = useRef(null);
  const pingStartRef = useRef(null);

  // Helper to sync activePlayersList state with playersRef keys
  const syncPlayersState = useCallback(() => {
    const list = Object.values(playersRef.current).map((p) => ({
      id: p.id,
      name: p.name,
      color: p.color,
      isAdmin: p.isAdmin || false,
    }));
    setActivePlayersList(list);
  }, []);

  const connect = useCallback(() => {
    if (wsRef.current && (wsRef.current.readyState === WebSocket.CONNECTING || wsRef.current.readyState === WebSocket.OPEN)) {
      return;
    }

    const wsUrl = getWsUrl(roomId, visitorId);
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      // Announce join with current profile and coordinates
      ws.send(JSON.stringify({
        type: "join",
        name: visitorName,
        color: visitorColor,
        isAdmin,
        position: [0, EYE_HEIGHT, 0],
        rotation: [0, 0, 0]
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const type = data.type;

        if (type === "init") {
          const playersArray = data.players || [];
          const newMap = {};
          playersArray.forEach((p) => {
            newMap[p.id] = {
              id: p.id,
              name: p.name || "Visitor",
              color: p.color || "#38bdf8",
              isAdmin: p.isAdmin || false,
              position: p.position || [0, EYE_HEIGHT, 0],
              targetPosition: p.position || [0, EYE_HEIGHT, 0],
              rotation: p.rotation || [0, 0, 0],
              targetRotation: p.rotation || [0, 0, 0],
              speechText: "",
              speechEndTime: 0
            };
          });
          playersRef.current = newMap;
          syncPlayersState();
        } else if (type === "player_joined") {
          const p = data.player;
          if (p && p.id && p.id !== visitorId) {
            playersRef.current[p.id] = {
              id: p.id,
              name: p.name || "Visitor",
              color: p.color || "#38bdf8",
              isAdmin: p.isAdmin || false,
              position: p.position || [0, EYE_HEIGHT, 0],
              targetPosition: p.position || [0, EYE_HEIGHT, 0],
              rotation: p.rotation || [0, 0, 0],
              targetRotation: p.rotation || [0, 0, 0],
              speechText: "",
              speechEndTime: 0
            };
            syncPlayersState();
            setChatMessages((prev) => [...prev, {
              id: Date.now() + "-" + p.id,
              system: true,
              text: `${p.name} joined the museum.`
            }]);
          }
        } else if (type === "player_left") {
          const leftId = data.id;
          if (leftId && playersRef.current[leftId]) {
            const leftName = playersRef.current[leftId].name;
            delete playersRef.current[leftId];
            syncPlayersState();
            setChatMessages((prev) => [...prev, {
              id: Date.now() + "-" + leftId,
              system: true,
              text: `${leftName} left the museum.`
            }]);
          }
        } else if (type === "player_moved") {
          const movedId = data.id;
          const p = playersRef.current[movedId];
          if (p) {
            if (data.position) p.targetPosition = data.position;
            if (data.rotation) p.targetRotation = data.rotation;
          }
        } else if (type === "player_updated") {
          const updatedId = data.id;
          const p = playersRef.current[updatedId];
          if (p) {
            if (data.name) p.name = data.name;
            if (data.color) p.color = data.color;
            syncPlayersState();
          }
        } else if (type === "player_chat") {
          const { id: senderId, name: senderName, color: senderColor, isAdmin: senderIsAdmin, message } = data;
          
          // Add to global chat messages
          setChatMessages((prev) => [...prev.slice(-49), {
            id: Date.now() + "-" + Math.random(),
            senderId,
            senderName,
            senderColor,
            senderIsAdmin,
            text: message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);

          // If from another player, set their floating 3D speech bubble for 6 seconds!
          if (senderId !== visitorId && playersRef.current[senderId]) {
            playersRef.current[senderId].speechText = message;
            playersRef.current[senderId].speechEndTime = Date.now() + 6000;
          }
        } else if (type === "pong") {
          if (pingStartRef.current) {
            setPing(Date.now() - pingStartRef.current);
            pingStartRef.current = null;
          }
        }
      } catch (err) {
        console.error("Multiplayer JSON parse error:", err);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      // Auto reconnect after 3 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, 3000);
    };

    ws.onerror = () => {
      ws.close();
    };
  }, [roomId, visitorId, visitorName, visitorColor, syncPlayersState]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) {
        wsRef.current.onclose = null; // Prevent reconnect loop on unmount
        wsRef.current.close();
      }
    };
  }, [connect]);

  // Ping interval heartbeat when connected
  useEffect(() => {
    if (!isConnected) {
      setPing(0);
      return;
    }

    const interval = setInterval(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        pingStartRef.current = Date.now();
        wsRef.current.send(JSON.stringify({ type: "ping" }));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isConnected]);

  // Throttled movement sender called from 3D Player.jsx useFrame
  const sendMovement = useCallback((position, rotation) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    
    const now = Date.now();
    if (now - lastMoveSendTimeRef.current < 60) return; // Throttled to ~16 FPS
    lastMoveSendTimeRef.current = now;

    wsRef.current.send(JSON.stringify({
      type: "move",
      position: [position.x, position.y, position.z],
      rotation: [rotation.x, rotation.y, rotation.z]
    }));
  }, []);

  // Send a chat message to the room
  const sendChat = useCallback((messageText) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN || !messageText.trim()) return;
    
    wsRef.current.send(JSON.stringify({
      type: "chat",
      message: messageText.trim()
    }));
  }, []);

  // Update profile name or color
  const updateProfile = useCallback((newName, newColor) => {
    if (newName) {
      setVisitorName(newName);
      localStorage.setItem('museum_visitor_name', newName);
    }
    if (newColor) {
      setVisitorColor(newColor);
      localStorage.setItem('museum_visitor_color', newColor);
    }
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "update_profile",
        name: newName || visitorName,
        color: newColor || visitorColor
      }));
    }
  }, [visitorName, visitorColor]);

  return {
    visitorId,
    visitorName,
    visitorColor,
    isConnected,
    activePlayersList,
    playersRef,
    chatMessages,
    sendMovement,
    sendChat,
    updateProfile,
    ping,
    NEON_COLORS
  };
};
