import React from 'react';
import { useFrame } from '@react-three/fiber';

const VisibilityCullingSystem = ({ playerPosRef, northRef, southRef, eastRef, westRef, lobbyRef }) => {
  useFrame(() => {
    if (!playerPosRef.current) return;
    const { x, z, yaw } = playerPosRef.current;

    // Define Hall Boundaries
    const inNorth = z < -15;
    const inSouth = z > 15;
    const inEast = x > 15;
    const inWest = x < -15;
    const inLobby = !inNorth && !inSouth && !inEast && !inWest;

    if (northRef.current) northRef.current.visible = inNorth || inLobby;
    if (southRef.current) southRef.current.visible = inSouth || inLobby;
    if (eastRef.current) eastRef.current.visible = inEast || inLobby;
    if (westRef.current) westRef.current.visible = inWest || inLobby;
    
    if (lobbyRef.current) {
      lobbyRef.current.visible = true;
    }
  });

  return null;
};

export default VisibilityCullingSystem;
