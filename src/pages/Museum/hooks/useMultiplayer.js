import { useState, useEffect, useRef, useCallback } from 'react';
import { getWsUrl, getChatHistory } from '@services/multiplayer';

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

const formatLocalTime = (tsFloatOrDate) => {
  let dateObj;
  if (typeof tsFloatOrDate === 'number') {
    dateObj = new Date(tsFloatOrDate * 1000);
  } else if (tsFloatOrDate instanceof Date) {
    dateObj = tsFloatOrDate;
  } else {
    dateObj = new Date();
  }
  return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

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
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [chatSkip, setChatSkip] = useState(0);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [ping, setPing] = useState(0);
  
  // React state for adding/removing player components in DOM when someone joins/leaves
  const [activePlayersList, setActivePlayersList] = useState([]);

  // High-performance Ref dictionary for real-time 60FPS coordinate interpolation without React re-renders!
  // Structure: playersRef.current[id] = { id, name, color, position: [x,y,z], targetPosition: [x,y,z], rotation: [ry], targetRotation: [ry], speechText: "", speechEndTime: 0 }
  const playersRef = useRef({});
  const wsRef = useRef(null);
  const lastMoveSendTimeRef = useRef(0);
  const lastSentPosRef = useRef([0, 0, 0]);
  const lastSentRotRef = useRef([0, 0, 0]);
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
              currentEmote: p.current_emote || null,
              emoteEndTime: p.emote_end_time ? p.emote_end_time * 1000 : 0,
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
              currentEmote: p.current_emote || null,
              emoteEndTime: p.emote_end_time ? p.emote_end_time * 1000 : 0,
              speechText: "",
              speechEndTime: 0
            };
            syncPlayersState();
            setChatMessages((prev) => [...prev, {
              id: Date.now() + "-" + p.id,
              system: true,
              text: `${p.name} joined the museum.`,
              receivedAt: Date.now()
            }]);
          }
        } else if (type === "player_left") {
          const leftId = data.id;
          if (leftId && playersRef.current[leftId]) {
            const leftName = playersRef.current[leftId].name || data.name || "An explorer";
            delete playersRef.current[leftId];
            syncPlayersState();
            setChatMessages((prev) => [...prev, {
              id: Date.now() + "-" + leftId,
              system: true,
              text: `${leftName} left the museum.`,
              receivedAt: Date.now()
            }]);
          }
        } else if (type === "player_moved") {
          const movedId = data.id;
          const p = playersRef.current[movedId];
          if (p) {
            if (data.position) p.targetPosition = data.position;
            if (data.rotation) p.targetRotation = data.rotation;
            if (p.currentEmote) {
              p.currentEmote = null;
              p.emoteEndTime = 0;
            }
          }
        } else if (type === "player_emoted") {
          const { id: senderId, emote, duration } = data;
          if (playersRef.current[senderId]) {
            playersRef.current[senderId].currentEmote = emote || null;
            playersRef.current[senderId].emoteEndTime = emote ? Date.now() + (duration * 1000) : 0;
          }
        } else if (type === "player_updated") {
          const updatedId = data.id;
          const p = playersRef.current[updatedId];
          if (p) {
            if (data.name) p.name = data.name;
            if (data.color) p.color = data.color;
            syncPlayersState();
          }
          if (data.activity && Array.isArray(data.activity)) {
            const newLogs = data.activity.map((txt, idx) => ({
              id: Date.now() + "-act-" + idx,
              system: true,
              text: txt,
              receivedAt: Date.now()
            }));
            setChatMessages((prev) => [...prev, ...newLogs]);
          }
        } else if (type === "player_chat") {
          const { id: senderId, name: senderName, color: senderColor, isAdmin: senderIsAdmin, message, db_id, timestamp: tsFloat } = data;
          
          // Add to global chat messages
          setChatMessages((prev) => [...prev, {
            id: db_id || (Date.now() + "-" + Math.random()),
            senderId,
            senderName,
            senderColor,
            senderIsAdmin,
            text: message,
            timestamp: formatLocalTime(tsFloat || new Date()),
            receivedAt: Date.now()
          }]);

          // If from another player, set their floating 3D speech bubble for 6 seconds!
          if (senderId !== visitorId && playersRef.current[senderId]) {
            playersRef.current[senderId].speechText = message;
            playersRef.current[senderId].speechEndTime = Date.now() + 6000;
          }
        } else if (type === "chat_deleted") {
          const { msg_id } = data;
          setChatMessages((prev) => prev.filter(m => m.id !== msg_id && m.id !== String(msg_id)));
        } else if (type === "chat_edited") {
          const { msg_id, new_text } = data;
          setChatMessages((prev) => prev.map(m => (m.id === msg_id || m.id === String(msg_id)) ? { ...m, text: new_text } : m));
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

  // Fetch initial chat history
  useEffect(() => {
    getChatHistory(roomId, 0, 10)
      .then(data => {
        const formatted = (data.messages || []).map(msg => ({
          ...msg,
          timestamp: msg.timestamp_float ? formatLocalTime(msg.timestamp_float) : msg.timestamp
        }));
        setChatMessages(formatted);
        setHasMoreMessages(data.hasMore || false);
        setChatSkip(10);
      })
      .catch(err => console.error("Failed to fetch chat history", err));
  }, [roomId]);

  const loadMoreMessages = useCallback(async () => {
    if (!hasMoreMessages || isLoadingOlder) return;
    setIsLoadingOlder(true);
    try {
      const data = await getChatHistory(roomId, chatSkip, 20);
      if (data.messages && data.messages.length > 0) {
        const formatted = data.messages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp_float ? formatLocalTime(msg.timestamp_float) : msg.timestamp
        }));
        setChatMessages(prev => [...formatted, ...prev]);
        setChatSkip(prev => prev + 20);
        setHasMoreMessages(data.hasMore);
      } else {
        setHasMoreMessages(false);
      }
    } catch (err) {
      console.error("Failed to load older messages", err);
    } finally {
      setIsLoadingOlder(false);
    }
  }, [roomId, chatSkip, hasMoreMessages, isLoadingOlder]);

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

  const sendMovement = useCallback((position, rotation) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    
    const now = Date.now();
    if (now - lastMoveSendTimeRef.current < 60) return; // Throttled to ~16 FPS

    const px = position.x, py = position.y, pz = position.z;
    const rx = rotation.x, ry = rotation.y, rz = rotation.z;
    const [lpx, lpy, lpz] = lastSentPosRef.current;
    const [lrx, lry, lrz] = lastSentRotRef.current;

    // Do not send if position and rotation haven't changed at all!
    if (Math.abs(px - lpx) < 0.001 && Math.abs(py - lpy) < 0.001 && Math.abs(pz - lpz) < 0.001 &&
        Math.abs(rx - lrx) < 0.001 && Math.abs(ry - lry) < 0.001 && Math.abs(rz - lrz) < 0.001) {
      return;
    }

    lastMoveSendTimeRef.current = now;
    lastSentPosRef.current = [px, py, pz];
    lastSentRotRef.current = [rx, ry, rz];

    wsRef.current.send(JSON.stringify({
      type: "move",
      position: [px, py, pz],
      rotation: [rx, ry, rz]
    }));
  }, []);

  // Send a chat message to the room
  const sendChat = useCallback((messageText) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN || !messageText.trim()) return;
    
    wsRef.current.send(JSON.stringify({
      type: "chat",
      message: messageText.trim().slice(0, 200)
    }));
  }, []);

  const deleteChat = useCallback((msgId) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "delete_chat",
        msg_id: msgId
      }));
    }
  }, []);

  const editChat = useCallback((msgId, newText) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && newText.trim()) {
      wsRef.current.send(JSON.stringify({
        type: "edit_chat",
        msg_id: msgId,
        new_text: newText.trim().slice(0, 200)
      }));
    }
  }, []);

  // Update profile name or color
  const updateProfile = useCallback((newName, newColor) => {
    if (newName) {
      setVisitorName(newName);
      localStorage.setItem('museum_visitor_name', newName);
    }
    const effectiveColor = isAdmin ? "#f59e0b" : (newColor || visitorColor);
    if (!isAdmin && newColor) {
      setVisitorColor(newColor);
      localStorage.setItem('museum_visitor_color', newColor);
    }
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "update_profile",
        name: newName || visitorName,
        color: effectiveColor
      }));
    }
  }, [visitorName, visitorColor, isAdmin]);

  const sendEmote = useCallback((emote, duration = 3.0) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({
      type: "emote",
      emote,
      duration
    }));
  }, []);

  return {
    visitorId,
    visitorName,
    visitorColor,
    isAdmin,
    isConnected,
    activePlayersList,
    playersRef,
    chatMessages,
    sendMovement,
    sendChat,
    sendEmote,
    deleteChat,
    editChat,
    updateProfile,
    loadMoreMessages,
    hasMoreMessages,
    isLoadingOlder,
    ping,
    NEON_COLORS
  };
};
