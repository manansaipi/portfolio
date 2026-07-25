import React, { useState } from 'react';
import { Text } from '@react-three/drei';

const GuestbookBoard = ({ entries = [], position = [0, 0, -4], rotation = [0, 0, 0], onOpenSignModal }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position} rotation={rotation}>
      {/* Interactive Standing Vertical Board Group */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          if (document.pointerLockElement) document.exitPointerLock();
          if (onOpenSignModal) onOpenSignModal();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Dual Vertical Metal Support Legs */}
        <mesh position={[-3.0, 2.0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 4.0]} />
          <meshLambertMaterial color="#3f3f46" />
        </mesh>
        <mesh position={[3.0, 2.0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 4.0]} />
          <meshLambertMaterial color="#3f3f46" />
        </mesh>

        {/* Floor Stand Base Plates */}
        <mesh position={[-3.0, 0.04, 0]}>
          <boxGeometry args={[0.6, 0.08, 0.6]} />
          <meshLambertMaterial color="#27272a" />
        </mesh>
        <mesh position={[3.0, 0.04, 0]}>
          <boxGeometry args={[0.6, 0.08, 0.6]} />
          <meshLambertMaterial color="#27272a" />
        </mesh>

        {/* Main Vertical Board Backing Frame (Eye Level Y = 3.5) */}
        <mesh position={[0, 3.5, 0]}>
          <boxGeometry args={[8.0, 4.2, 0.15]} />
          <meshLambertMaterial color={hovered ? '#27201b' : '#181412'} />
        </mesh>

        {/* Gold Border Trim */}
        <mesh position={[0, 3.5, 0.08]}>
          <boxGeometry args={[7.8, 4.0, 0.02]} />
          <meshLambertMaterial color="#c5a059" />
        </mesh>

        {/* Inner Dark Board Surface */}
        <mesh position={[0, 3.5, 0.09]}>
          <planeGeometry args={[7.6, 3.8]} />
          <meshLambertMaterial color="#292019" />
        </mesh>

        {/* Board Title Header */}
        <Text
          position={[0, 5.0, 0.11]}
          fontSize={0.28}
          color="#f59e0b"
          anchorX="center"
          letterSpacing={0.06}
        >
          ✍️ MUSEUM VISITOR SIGNATURE BOARD
        </Text>

        <Text
          position={[0, 4.65, 0.11]}
          fontSize={0.12}
          color={hovered ? '#fbbf24' : '#d4d4d8'}
          anchorX="center"
        >
          {hovered ? '👉 CLICK BOARD TO LEAVE YOUR SIGNATURE & NAME 👈' : 'Click anywhere on this board to sign your name in the museum'}
        </Text>

        {/* Render 3D Signature Cards on Vertical Board Surface */}
        {entries.slice(0, 12).map((entry, idx) => {
          const col = idx % 4;
          const row = Math.floor(idx / 4);
          const x = -2.7 + col * 1.8;
          const y = 4.15 - row * 0.95;

          return (
            <group key={entry.id || idx} position={[x, y, 0.11]}>
              {/* Card Paper Base */}
              <mesh>
                <planeGeometry args={[1.65, 0.78]} />
                <meshBasicMaterial color="#fcfbf7" />
              </mesh>

              {/* Visitor Name */}
              <Text
                position={[0, 0.18, 0.01]}
                fontSize={0.09}
                color="#0f172a"
                anchorX="center"
                maxWidth={1.5}
              >
                {entry.name || 'Anonymous Visitor'}
              </Text>

              {/* Visitor Message */}
              <Text
                position={[0, -0.08, 0.01]}
                fontSize={0.065}
                color="#334155"
                anchorX="center"
                maxWidth={1.5}
                lineHeight={1.2}
              >
                "{entry.message || 'Visited!'}"
              </Text>

              {/* Timestamp */}
              <Text
                position={[0, -0.29, 0.01]}
                fontSize={0.05}
                color="#94a3b8"
                anchorX="center"
              >
                {entry.created_at ? new Date(entry.created_at).toLocaleDateString() : 'Recent'}
              </Text>
            </group>
          );
        })}

        {entries.length === 0 && (
          <Text position={[0, 3.2, 0.11]} fontSize={0.2} color="#a1a1aa" anchorX="center">
            Be the first visitor to sign the board!
          </Text>
        )}
      </group>
    </group>
  );
};

export default GuestbookBoard;
