import React, { useState } from 'react';
import { Text } from '@react-three/drei';

const LobbyDecoration = ({ onTeleportToLevel2 }) => {
  const [hoveredBtn, setHoveredBtn] = useState(false);

  return (
    <group>
      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 🧭 1. CENTRAL INFORMATION KIOSK ("THE GALLERY")                  */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <group position={[0, 0, 8]} rotation={[0, Math.PI, 0]}>
        {/* Main Base Body */}
        <mesh position={[0, 0.75, 0]}>
          <boxGeometry args={[4.8, 1.5, 2.8]} />
          <meshLambertMaterial color="#171717" />
        </mesh>

        {/* Slanted Glass Map Screen Surface */}
        <group position={[0, 1.52, 0]} rotation={[0.28, 0, 0]}>
          <mesh>
            <boxGeometry args={[4.6, 0.06, 2.5]} />
            <meshLambertMaterial color="#262626" />
          </mesh>

          {/* Glowing Floorplan Map Graphics */}
          <mesh position={[0, 0.04, 0]}>
            <planeGeometry args={[4.2, 2.2]} />
            <meshBasicMaterial color="#1e293b" />
          </mesh>

          {/* Map Layout Diagram Lines & Text */}
          <Text position={[0, 0.7, 0.05]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.15} color="#38bdf8" anchorX="center">
            MUSEUM DIRECTORY
          </Text>

          {/* Hall Box Highlights on Map Diagram */}
          {[
            { label: 'NATURE', pos: [-1.4, 0.2, 0.05], col: '#4ade80' },
            { label: 'STREET', pos: [-0.45, 0.2, 0.05], col: '#facc15' },
            { label: 'TRAVEL', pos: [0.45, 0.2, 0.05], col: '#fb923c' },
            { label: 'PORTRAIT', pos: [1.4, 0.2, 0.05], col: '#60a5fa' },
          ].map(({ label, pos, col }) => (
            <group key={label} position={pos} rotation={[-Math.PI / 2, 0, 0]}>
              <mesh>
                <planeGeometry args={[0.8, 0.6]} />
                <meshBasicMaterial color="#0f172a" />
              </mesh>
              <Text position={[0, 0, 0.01]} fontSize={0.08} color={col} anchorX="center">
                {label}
              </Text>
            </group>
          ))}

          <Text position={[0, -0.6, 0.05]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.12} color="#fbbf24" anchorX="center">
            ▲ YOU ARE HERE (MAIN LOBBY)
          </Text>
        </group>

        {/* 3D Glowing Text Logo on Front Face */}
        <Text
          position={[0, 0.75, 1.42]}
          fontSize={0.42}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.12}
        >
          THE GALLERY
        </Text>
      </group>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ℹ️ 2. ABOUT THE MUSEUM STANDING BOARD (LEFT SIDE)                 */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <group position={[-20, 0, 8]} rotation={[0, Math.PI / 6, 0]}>
        <mesh position={[0, 1.4, 0]}>
          <boxGeometry args={[1.6, 2.8, 0.12]} />
          <meshLambertMaterial color="#111111" />
        </mesh>

        <Text position={[0, 2.4, 0.07]} fontSize={0.12} color="#ffffff" anchorX="center">
          About the Museum
        </Text>
        <Text
          position={[0, 1.3, 0.07]}
          fontSize={0.075}
          color="#a1a1aa"
          anchorX="center"
          maxWidth={1.4}
          lineHeight={1.4}
        >
          Welcome to the Virtual Photography Gallery.{"\n\n"}
          Explore curated collections of Nature, Street, Travel, and Portrait photography in full 3D.{"\n\n"}
          Click any exhibit frame to inspect artwork details in high resolution.
        </Text>
      </group>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 🪴 3. POTTED PLANTS FLANKING ARCHWAYS                            */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {[-13.5, -11.0, -1.0, 1.5, 11.5, 14.0].map((px) => (
        <group key={px} position={[px, 0, 1.2]}>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.4, 0.3, 1.0, 16]} />
            <meshLambertMaterial color="#1a1a1a" />
          </mesh>
          <mesh position={[0, 1.4, 0]}>
            <sphereGeometry args={[0.7, 12, 12]} />
            <meshLambertMaterial color="#166534" />
          </mesh>
        </group>
      ))}

      {/* Modern Benches in Exhibition Halls */}
      {[-17.5, -5.0, 7.5, 20.0].map((hx) => (
        <group key={hx} position={[hx, 0, -28]}>
          <mesh position={[0, 0.45, 0]}>
            <boxGeometry args={[3.2, 0.14, 0.9]} />
            <meshLambertMaterial color="#543c29" />
          </mesh>
          <mesh position={[-1.3, 0.2, 0]}>
            <boxGeometry args={[0.1, 0.4, 0.8]} />
            <meshLambertMaterial color="#111" />
          </mesh>
          <mesh position={[1.3, 0.2, 0]}>
            <boxGeometry args={[0.1, 0.4, 0.8]} />
            <meshLambertMaterial color="#111" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export default LobbyDecoration;
