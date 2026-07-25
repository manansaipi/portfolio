import React, { useState } from 'react';
import { Text } from '@react-three/drei';

const SLUG_META = {
  nature:   { icon: '🌿', col: '#4ade80' },
  street:   { icon: '💼', col: '#facc15' },
  travel:   { icon: '🧗', col: '#fb923c' },
  portrait: { icon: '👨\u200d👩\u200d👧', col: '#60a5fa' },
};

const LobbyDecoration = ({ onTeleportToLevel2, categories = [] }) => {
  const [hoveredBtn, setHoveredBtn] = useState(false);

  return (
    <group>
      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 🏛️ 0. GRAND MARBLE COLUMNS at Archway Corners                   */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {[
        [-13.2, -13.2], [-13.2, 13.2], [13.2, -13.2], [13.2, 13.2]
      ].map(([cx, cz]) => (
        <group key={`col-${cx}-${cz}`} position={[cx, 0, cz]}>
          {/* Base plinth */}
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[0.9, 0.4, 0.9]} />
            <meshLambertMaterial color="#d4cfc6" />
          </mesh>
          {/* Shaft */}
          <mesh position={[0, 3.8, 0]}>
            <cylinderGeometry args={[0.32, 0.36, 7.2, 18]} />
            <meshLambertMaterial color="#ede9e1" />
          </mesh>
          {/* Capital */}
          <mesh position={[0, 7.6, 0]}>
            <boxGeometry args={[0.85, 0.5, 0.85]} />
            <meshLambertMaterial color="#d4af37" />
          </mesh>
        </group>
      ))}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 🕯️ 0b. CHANDELIER under skylight                               */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <group position={[0, 8.4, 0]}>
        {/* Central brass ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.8, 0.07, 10, 36]} />
          <meshLambertMaterial color="#b8962e" />
        </mesh>
        {/* 8 pendant bulbs around the ring */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <group key={i} position={[Math.cos(angle) * 1.8, 0, Math.sin(angle) * 1.8]}>
              <mesh position={[0, -0.18, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.35, 6]} />
                <meshLambertMaterial color="#b8962e" />
              </mesh>
              <mesh position={[0, -0.48, 0]}>
                <sphereGeometry args={[0.14, 10, 10]} />
                <meshBasicMaterial color="#fff7d6" />
              </mesh>
            </group>
          );
        })}
        {/* Center drop sphere */}
        <mesh position={[0, -0.35, 0]}>
          <sphereGeometry args={[0.28, 14, 14]} />
          <meshBasicMaterial color="#fff9e0" />
        </mesh>
        {/* Hanging rod from ceiling */}
        <mesh position={[0, 0.75, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 1.5, 6]} />
          <meshLambertMaterial color="#b8962e" />
        </mesh>
      </group>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 🟤 0c. DECORATIVE RUG under skylight                           */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[6.5, 48]} />
        <meshLambertMaterial color="#3b1a0a" />
      </mesh>
      <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5.8, 6.4, 48]} />
        <meshBasicMaterial color="#b8962e" />
      </mesh>
      <mesh position={[0, 0.007, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.2, 5.0, 48]} />
        <meshBasicMaterial color="#7c2d12" />
      </mesh>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 🪙 0d. ROPE STANCHIONS around kiosk                            */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {[
        [3.8, 5.5], [3.8, 10.5], [-3.8, 5.5], [-3.8, 10.5]
      ].map(([sx, sz]) => (
        <group key={`st-${sx}-${sz}`} position={[sx, 0, sz]}>
          <mesh position={[0, 0.55, 0]}>
            <cylinderGeometry args={[0.05, 0.07, 1.1, 8]} />
            <meshLambertMaterial color="#b8962e" />
          </mesh>
          <mesh position={[0, 1.08, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshLambertMaterial color="#d4af37" />
          </mesh>
        </group>
      ))}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 💡 0e. WALL SCONCES (N/S/E/W sides)                            */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {[
        { pos: [-6, 5.2, -14.2], rot: [0, 0, 0] },
        { pos: [6, 5.2, -14.2], rot: [0, 0, 0] },
        { pos: [-6, 5.2, 14.2], rot: [0, Math.PI, 0] },
        { pos: [6, 5.2, 14.2], rot: [0, Math.PI, 0] },
        { pos: [-14.2, 5.2, -6], rot: [0, Math.PI / 2, 0] },
        { pos: [-14.2, 5.2, 6], rot: [0, Math.PI / 2, 0] },
        { pos: [14.2, 5.2, -6], rot: [0, -Math.PI / 2, 0] },
        { pos: [14.2, 5.2, 6], rot: [0, -Math.PI / 2, 0] },
      ].map(({ pos, rot }, i) => (
        <group key={`sconce-${i}`} position={pos} rotation={rot}>
          {/* Arm bracket */}
          <mesh position={[0, 0, 0.22]}>
            <boxGeometry args={[0.08, 0.08, 0.45]} />
            <meshLambertMaterial color="#8b7355" />
          </mesh>
          {/* Bulb shade */}
          <mesh position={[0, 0.18, 0.4]}>
            <coneGeometry args={[0.18, 0.28, 10, 1, true]} />
            <meshLambertMaterial color="#c9a84c" />
          </mesh>
          {/* Glow point */}
          <mesh position={[0, 0.1, 0.4]}>
            <sphereGeometry args={[0.09, 8, 8]} />
            <meshBasicMaterial color="#fff5c0" />
          </mesh>
        </group>
      ))}

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
          {['nature', 'street', 'travel', 'portrait'].map((slug) => {
            const cat = categories.find(c => c.slug === slug);
            const label = cat?.label || slug.toUpperCase();
            const meta = SLUG_META[slug] || { icon: '', col: '#ffffff' };
            const xPos = { nature: -1.4, street: -0.45, travel: 0.45, portrait: 1.4 }[slug];
            return (
              <group key={slug} position={[xPos, 0.2, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
                <mesh>
                  <planeGeometry args={[0.8, 0.6]} />
                  <meshBasicMaterial color="#0f172a" />
                </mesh>
                <Text position={[0, 0.06, 0.01]} fontSize={0.07} color={meta.col} anchorX="center">
                  {meta.icon}
                </Text>
                <Text position={[0, -0.08, 0.01]} fontSize={0.065} color={meta.col} anchorX="center">
                  {label.toUpperCase()}
                </Text>
              </group>
            );
          })}

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
