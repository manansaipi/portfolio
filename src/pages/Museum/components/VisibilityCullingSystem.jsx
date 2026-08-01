import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

const VisibilityCullingSystem = ({ playerPosRef, northRef, southRef, eastRef, westRef, lobbyRef }) => {
  const { gl } = useThree();
  const lastLogRef = useRef(0);

  useFrame(() => {
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

    // A hall is visible if you are inside it OR if you are looking in its direction
    if (northRef.current) northRef.current.visible = inNorth || lookNorth;
    if (southRef.current) southRef.current.visible = inSouth || lookSouth;
    if (eastRef.current) eastRef.current.visible = inEast || lookEast;
    if (westRef.current) westRef.current.visible = inWest || lookWest;
    
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
