import React, { useState, useEffect, useRef, useCallback } from 'react';

// Museum world bounds for coordinate → minimap pixel mapping
const WORLD_MIN = -130;
const WORLD_MAX = 130;
const WORLD_RANGE = WORLD_MAX - WORLD_MIN; // 260 units total

// NPC locations (AI Bot is at [3, 2.2, 6])
const NPC_POS = { x: 3, z: 6 };

const MuseumMiniMap = ({ playersRef, playerPosRef, isMobile = false }) => {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  const MAP_SIZE = isMobile ? 120 : 180;
  const PADDING = 8;

  // Convert world XZ → canvas pixel
  const worldToMap = useCallback((wx, wz) => {
    const px = ((wx - WORLD_MIN) / WORLD_RANGE) * MAP_SIZE;
    const py = ((wz - WORLD_MIN) / WORLD_RANGE) * MAP_SIZE;
    return [px, py];
  }, [MAP_SIZE]);

  // Draw the mini-map floor plan + dots
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const s = MAP_SIZE;
    ctx.clearRect(0, 0, s, s);

    // Background
    ctx.fillStyle = 'rgba(10, 10, 14, 0.75)';
    ctx.fillRect(0, 0, s, s);

    // ── Draw cross-shaped floor plan ──
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';

    // Center lobby: world X -15..15, Z -15..15
    const drawRoom = (minX, minZ, maxX, maxZ) => {
      const [x1, y1] = worldToMap(minX, minZ);
      const [x2, y2] = worldToMap(maxX, maxZ);
      ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
    };

    // Lobby
    drawRoom(-15, -15, 15, 15);

    // North corridor + hall (Nature) — negative Z
    drawRoom(-4, -28, 4, -15);
    drawRoom(-15, -126, 15, -28);

    // South corridor + hall (Portrait) — positive Z
    drawRoom(-4, 15, 4, 28);
    drawRoom(-15, 28, 15, 126);

    // West corridor + hall (Street) — negative X
    drawRoom(-28, -4, -15, 4);
    drawRoom(-126, -15, -28, 15);

    // East corridor + hall (Travel) — positive X
    drawRoom(15, -4, 28, 4);
    drawRoom(28, -15, 126, 15);

    // ── Draw room labels ──
    ctx.fillStyle = 'rgba(255, 255, 255, 0.30)';
    ctx.font = `bold ${isMobile ? 5 : 6}px Inter, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const drawLabel = (text, wx, wz) => {
      const [lx, ly] = worldToMap(wx, wz);
      ctx.fillText(text, lx, ly);
    };

    drawLabel('LOBBY', 0, 0);
    drawLabel('🌿', 0, -52);
    drawLabel('📷', -52, 0);
    drawLabel('✈️', 52, 0);
    drawLabel('🖼️', 0, 52);

    // ── Draw NPC dot (AI Bot) ──
    const [npcX, npcY] = worldToMap(NPC_POS.x, NPC_POS.z);
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.arc(npcX, npcY, 3, 0, Math.PI * 2);
    ctx.fill();
    // Small label
    ctx.fillStyle = 'rgba(168, 85, 247, 0.7)';
    ctx.font = `${isMobile ? 4 : 5}px Inter, system-ui, sans-serif`;
    ctx.fillText('AI', npcX, npcY - 5);

    // ── Draw other players ──
    if (playersRef && playersRef.current) {
      const players = playersRef.current;
      const entries = players instanceof Map ? [...players.entries()] : Object.entries(players);
      for (const [, p] of entries) {
        const pos = p.targetPosition || p.position;
        if (!pos || pos.length < 3) continue;
        const [px, py] = worldToMap(pos[0], pos[2]);
        ctx.fillStyle = p.color || '#38bdf8';
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // ── Draw local player (YOU) with direction arrow ──
    if (playerPosRef && playerPosRef.current) {
      const { x, z, yaw } = playerPosRef.current;
      const [mx, my] = worldToMap(x, z);

      // Direction triangle
      ctx.save();
      ctx.translate(mx, my);
      // yaw is atan2(forward.x, forward.z), in Three.js: 0 = +Z, PI/2 = +X
      // On minimap: +Z is down, +X is right. Canvas 0rad = right.
      // Convert: canvas angle = -(yaw - PI/2) but let's just rotate correctly.
      // yaw 0 = facing +Z (down on map). Canvas: down = PI/2. So canvasAngle = yaw + PI/2
      // But we need to negate because canvas Y is flipped from world sense.
      // After testing: rotation = yaw (yaw=0 faces +Z = down on minimap)
      ctx.rotate(-yaw + Math.PI);
      
      // Bright cone of vision
      ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      const coneLen = isMobile ? 14 : 18;
      const coneAngle = Math.PI / 5;
      ctx.lineTo(Math.sin(coneAngle) * coneLen, -Math.cos(coneAngle) * coneLen);
      ctx.lineTo(-Math.sin(coneAngle) * coneLen, -Math.cos(coneAngle) * coneLen);
      ctx.closePath();
      ctx.fill();

      // Player arrow
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(0, -5);  // tip (behind)
      ctx.lineTo(-3.5, 3);
      ctx.lineTo(0, 1);
      ctx.lineTo(3.5, 3);
      ctx.closePath();
      ctx.fill();

      // Glow ring
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    }

    animFrameRef.current = requestAnimationFrame(draw);
  }, [MAP_SIZE, worldToMap, playersRef, playerPosRef, isMobile]);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(draw);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [draw]);

  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 15,
        pointerEvents: 'auto',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          width: MAP_SIZE + PADDING * 2,
          height: MAP_SIZE + PADDING * 2,
          background: 'rgba(10, 10, 14, 0.82)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '12px',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          padding: `${PADDING}px`,
          boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
        }}
      >
        <canvas
          ref={canvasRef}
          width={MAP_SIZE}
          height={MAP_SIZE}
          style={{
            width: MAP_SIZE,
            height: MAP_SIZE,
            borderRadius: '8px',
            display: 'block',
          }}
        />
      </div>
    </div>
  );
};

export default MuseumMiniMap;
