import React, { useState } from 'react';
import { Text } from '@react-three/drei';

const EmptyWallSlot = ({ position = [0, 4.5, 0], rotation = [0, 0, 0], onHover, onUnhover, slotIndex, category }) => {
  const [hovered, setHovered] = useState(false);
  const frameW = 4.8;
  const frameH = 3.5;

  return (
    <group position={position} rotation={rotation}>
      <group
        onPointerOver={(e) => {
          e.stopPropagation();
          if (e.distance && e.distance <= 8.5) {
            setHovered(true);
            if (onHover) onHover({ isEmptySlot: true, pos: position, rot: rotation, slotIndex, category });
          }
        }}
        onPointerOut={() => {
          setHovered(false);
          if (onUnhover) onUnhover();
        }}
      >
        {/* Invisible Hitbox for Interaction */}
        <mesh>
          <boxGeometry args={[frameW, frameH, 0.2]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {hovered && (
          <Text
            position={[0, 0, 0.05]}
            fontSize={0.25}
            color="#3b82f6"
            anchorX="center"
            anchorY="middle"
          >
            [ Empty Slot ]
          </Text>
        )}
      </group>
    </group>
  );
};

export default EmptyWallSlot;
