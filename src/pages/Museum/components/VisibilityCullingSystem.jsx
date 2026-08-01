import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

const WARMUP_FRAMES = 90; // ~1.5 seconds at 60fps — enough for GPU to compile all shaders & upload textures

const VisibilityCullingSystem = ({ playerPosRef, northRef, southRef, eastRef, westRef, lobbyRef }) => {
  const { gl } = useThree();
  const lastLogRef = useRef(0);
  const frameCountRef = useRef(0);
  const warmupDoneRef = useRef(false);

  useFrame(() => {
    if (!playerPosRef.current) return;

    // ── GPU WARM-UP PHASE ──
    // Keep ALL halls visible for the first ~1.5 seconds so the GPU compiles
    // every shader and uploads every texture. After warm-up, culling kicks in
    // and toggling visibility is instant with zero frame drops.
    if (!warmupDoneRef.current) {
      frameCountRef.current++;
      if (northRef.current) northRef.current.visible = true;
      if (southRef.current) southRef.current.visible = true;
      if (eastRef.current) eastRef.current.visible = true;
      if (westRef.current) westRef.current.visible = true;
      if (lobbyRef.current) lobbyRef.current.visible = true;

      if (frameCountRef.current >= WARMUP_FRAMES) {
        warmupDoneRef.current = true;
        console.log('%c🔥 GPU Warm-up Complete! All shaders compiled. Portal Culling now active.', 'color: #facc15; font-weight: bold; font-size: 14px;');
      }
      return;
    }

    // ── PORTAL CULLING (post warm-up) ──
    const { x, z, yaw } = playerPosRef.current;

    // Define Hall Boundaries
    const inNorth = z < -15;
    const inSouth = z > 15;
    const inEast = x > 15;
    const inWest = x < -15;

    const dirX = Math.sin(yaw);
    const dirZ = Math.cos(yaw);

    // If dir is beyond threshold, it means camera is pointing towards that hall.
    const lookNorth = dirZ < -0.25;
    const lookSouth = dirZ > 0.25;
    const lookEast = dirX > 0.25;
    const lookWest = dirX < -0.25;

    // Portal Culling Logic: If you are inside a hall, you can't see the adjacent halls through the walls!
    if (inNorth) {
      if (northRef.current) northRef.current.visible = true;
      if (southRef.current) southRef.current.visible = lookSouth;
      if (eastRef.current) eastRef.current.visible = false;
      if (westRef.current) westRef.current.visible = false;
    } else if (inSouth) {
      if (northRef.current) northRef.current.visible = lookNorth;
      if (southRef.current) southRef.current.visible = true;
      if (eastRef.current) eastRef.current.visible = false;
      if (westRef.current) westRef.current.visible = false;
    } else if (inEast) {
      if (northRef.current) northRef.current.visible = false;
      if (southRef.current) southRef.current.visible = false;
      if (eastRef.current) eastRef.current.visible = true;
      if (westRef.current) westRef.current.visible = lookWest;
    } else if (inWest) {
      if (northRef.current) northRef.current.visible = false;
      if (southRef.current) southRef.current.visible = false;
      if (eastRef.current) eastRef.current.visible = lookEast;
      if (westRef.current) westRef.current.visible = true;
    } else {
      // Lobby — only show halls you're looking at
      if (northRef.current) northRef.current.visible = lookNorth;
      if (southRef.current) southRef.current.visible = lookSouth;
      if (eastRef.current) eastRef.current.visible = lookEast;
      if (westRef.current) westRef.current.visible = lookWest;
    }
    
    if (lobbyRef.current) {
      lobbyRef.current.visible = true;
    }

    // ── DEBUG LOGGING (Once per second) to prove Culling ──
    const now = Date.now();
    if (now - lastLogRef.current > 1000) {
      lastLogRef.current = now;
      console.log(
        `%c🛡️ Culling Active!%c\n` +
        `Visible Halls: North[${northRef.current?.visible ? '✅' : '❌'}] South[${southRef.current?.visible ? '✅' : '❌'}] East[${eastRef.current?.visible ? '✅' : '❌'}] West[${westRef.current?.visible ? '✅' : '❌'}]\n` +
        `WebGL Draw Calls: ${gl.info.render.calls}\n` +
        `WebGL Triangles: ${gl.info.render.triangles}`,
        'color: #4ade80; font-weight: bold; font-size: 14px;',
        'color: inherit;'
      );
    }
  });

  return null;
};

export default VisibilityCullingSystem;
