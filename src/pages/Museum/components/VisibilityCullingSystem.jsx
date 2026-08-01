import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

const VisibilityCullingSystem = ({ playerPosRef, northRef, southRef, eastRef, westRef, lobbyRef }) => {
  const { gl } = useThree();
  const lastLogRef = useRef(0);
  const frameCount = useRef(0);

  useFrame(() => {
    // 🚀 Wait 60 frames (~1 second) before starting occlusion culling.
    // This forces ALL halls to be visible during the loading screen, 
    // ensuring Three.js Preload compiles shaders and uploads VRAM for everything!
    // This completely eliminates the stutter when turning the camera for the first time.
    if (frameCount.current < 60) {
      frameCount.current++;
      return;
    }

    if (!playerPosRef.current) return;
    const { x, z, yaw } = playerPosRef.current;

    // Define Hall Boundaries
    const inNorth = z < -15;
    const inSouth = z > 15;
    const inEast = x > 15;
    const inWest = x < -15;
    const inLobby = !inNorth && !inSouth && !inEast && !inWest;

    const dirX = Math.sin(yaw);
    const dirZ = Math.cos(yaw);

    // If dir is beyond threshold, it means camera is pointing towards that hall.
    const lookNorth = dirZ < -0.25;
    const lookSouth = dirZ > 0.25;
    const lookEast = dirX > 0.25;
    const lookWest = dirX < -0.25;

    // Portal Culling Logic: If you are inside a hall, you can't see the adjacent halls through the walls!
    if (inLobby) {
      if (northRef.current) northRef.current.visible = lookNorth;
      if (southRef.current) southRef.current.visible = lookSouth;
      if (eastRef.current) eastRef.current.visible = lookEast;
      if (westRef.current) westRef.current.visible = lookWest;
    } else if (inNorth) {
      if (northRef.current) northRef.current.visible = true;
      if (southRef.current) southRef.current.visible = lookSouth; // Only visible if looking back at the lobby
      if (eastRef.current) eastRef.current.visible = false;       // Blocked by corridor wall
      if (westRef.current) westRef.current.visible = false;       // Blocked by corridor wall
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
