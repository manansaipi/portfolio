import React, { useState, useMemo } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const WALL_SPECS = [
  // North Wall (Level 2 Penthouse Z = -14.8)
  { name: 'north', center: [0, 17.0, -14.8], rot: [0, 0, 0] },
  // South Wall (Level 2 Penthouse Z = 14.8)
  { name: 'south', center: [0, 17.0, 14.8], rot: [0, Math.PI, 0] },
  // West Wall (Level 2 Penthouse X = -14.8)
  { name: 'west', center: [-14.8, 17.0, 0], rot: [0, Math.PI / 2, 0] },
  // East Wall (Level 2 Penthouse X = 14.8)
  { name: 'east', center: [14.8, 17.0, 0], rot: [0, -Math.PI / 2, 0] },
];

const SignatureTile = ({ wall, col, row, savedEntry, onOpenStudio }) => {
  const [hovered, setHovered] = useState(false);

  const texture = useMemo(() => {
    if (!savedEntry?.drawing) return null;
    const img = new Image();
    img.src = savedEntry.drawing;
    const tex = new THREE.CanvasTexture(img);
    img.onload = () => { tex.needsUpdate = true; };
    return tex;
  }, [savedEntry?.drawing]);

  const width = 2.4;
  const height = 0.8;

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        if (typeof document !== 'undefined' && !document.pointerLockElement && !('ontouchstart' in window) && window.innerWidth > 768) return;
        if (document.pointerLockElement) document.exitPointerLock();
        onOpenStudio({ wall, col, row, savedEntry });
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => {
        setHovered(false);
      }}
    >
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshLambertMaterial color={hovered ? '#3b82f6' : savedEntry ? '#1e293b' : '#18181b'} />
      </mesh>

      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[width - 0.1, height - 0.1]} />
        {texture ? (
          <meshBasicMaterial map={texture} />
        ) : (
          <meshLambertMaterial color={hovered ? '#1e293b' : '#09090b'} />
        )}
      </mesh>

      {!savedEntry && (
        <Text
          position={[0, 0, 0.02]}
          fontSize={0.16}
          color={hovered ? '#60a5fa' : '#52525b'}
          anchorX="center"
          anchorY="middle"
        >
          {hovered ? '✏️ TAP TO DRAW' : `+ Slot [${row + 1}, ${col + 1}]`}
        </Text>
      )}

      {savedEntry?.name && (
        <Text
          position={[0, -0.32, 0.02]}
          fontSize={0.07}
          color="#94a3b8"
          anchorX="center"
        >
          By: {savedEntry.name}
        </Text>
      )}
    </group>
  );
};

const SignatureRoomWalls = ({ entries = [], onOpenStudio }) => {
  const entryMap = useMemo(() => {
    const map = {};
    entries.forEach((item) => {
      if (!item.message) return;
      try {
        const parsed = typeof item.message === 'string' ? JSON.parse(item.message) : item.message;
        if (parsed.wall && parsed.col !== undefined && parsed.row !== undefined) {
          const key = `${parsed.wall}_${parsed.col}_${parsed.row}`;
          map[key] = { ...parsed, name: item.name, created_at: item.created_at };
        }
      } catch (e) {
        // Ignore non-JSON entries
      }
    });
    return map;
  }, [entries]);

  return (
    <group>
      {WALL_SPECS.map((wallSpec) => (
        <group key={wallSpec.name} position={wallSpec.center} rotation={wallSpec.rot}>
          {Array.from({ length: 10 }).map((_, row) =>
            Array.from({ length: 10 }).map((_, col) => {
              const x = -11.5 + col * 2.55;
              const y = 4.0 - row * 0.88;
              const key = `${wallSpec.name}_${col}_${row}`;
              const savedEntry = entryMap[key];

              return (
                <group key={key} position={[x, y, 0]}>
                  <SignatureTile
                    wall={wallSpec.name}
                    col={col}
                    row={row}
                    savedEntry={savedEntry}
                    onOpenStudio={onOpenStudio}
                  />
                </group>
              );
            })
          )}
        </group>
      ))}
    </group>
  );
};

export default SignatureRoomWalls;
