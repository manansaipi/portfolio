import React from 'react';

// 👨‍👩‍👧 Family Hall Decorations — Hall center: [0, 0, 52], South Wing

const FamilyHallDecoration = () => (
  <group>
    {/* ════════════════════════════════════════════════════════════════ */}
    {/* 🪑 1. ARMCHAIR PAIR + COFFEE TABLE — center of hall             */}
    {/* ════════════════════════════════════════════════════════════════ */}
    <group position={[0, 0, 52]}>
      {/* Left armchair */}
      <group position={[-1.4, 0, 0]}>
        {/* Seat cushion */}
        <mesh position={[0, 0.38, 0]}>
          <boxGeometry args={[0.95, 0.2, 0.85]} />
          <meshLambertMaterial color="#7c3f3f" />
        </mesh>
        {/* Back rest */}
        <mesh position={[0, 0.82, -0.38]}>
          <boxGeometry args={[0.95, 0.7, 0.12]} />
          <meshLambertMaterial color="#7c3f3f" />
        </mesh>
        {/* Left armrest */}
        <mesh position={[-0.44, 0.58, 0]}>
          <boxGeometry args={[0.1, 0.4, 0.85]} />
          <meshLambertMaterial color="#5c2d2d" />
        </mesh>
        {/* Right armrest */}
        <mesh position={[0.44, 0.58, 0]}>
          <boxGeometry args={[0.1, 0.4, 0.85]} />
          <meshLambertMaterial color="#5c2d2d" />
        </mesh>
        {/* 4 legs */}
        {[[-0.38, -0.38], [-0.38, 0.38], [0.38, -0.38], [0.38, 0.38]].map(([lx, lz], i) => (
          <mesh key={i} position={[lx, 0.13, lz]}>
            <cylinderGeometry args={[0.04, 0.04, 0.28, 6]} />
            <meshLambertMaterial color="#2a1a0a" />
          </mesh>
        ))}
      </group>

      {/* Right armchair (mirror) */}
      <group position={[1.4, 0, 0]}>
        <mesh position={[0, 0.38, 0]}>
          <boxGeometry args={[0.95, 0.2, 0.85]} />
          <meshLambertMaterial color="#7c3f3f" />
        </mesh>
        <mesh position={[0, 0.82, -0.38]}>
          <boxGeometry args={[0.95, 0.7, 0.12]} />
          <meshLambertMaterial color="#7c3f3f" />
        </mesh>
        <mesh position={[-0.44, 0.58, 0]}>
          <boxGeometry args={[0.1, 0.4, 0.85]} />
          <meshLambertMaterial color="#5c2d2d" />
        </mesh>
        <mesh position={[0.44, 0.58, 0]}>
          <boxGeometry args={[0.1, 0.4, 0.85]} />
          <meshLambertMaterial color="#5c2d2d" />
        </mesh>
        {[[-0.38, -0.38], [-0.38, 0.38], [0.38, -0.38], [0.38, 0.38]].map(([lx, lz], i) => (
          <mesh key={i} position={[lx, 0.13, lz]}>
            <cylinderGeometry args={[0.04, 0.04, 0.28, 6]} />
            <meshLambertMaterial color="#2a1a0a" />
          </mesh>
        ))}
      </group>

      {/* Coffee table between chairs */}
      <mesh position={[0, 0.22, 0.5]}>
        <cylinderGeometry args={[0.45, 0.45, 0.06, 20]} />
        <meshLambertMaterial color="#5c3d2e" />
      </mesh>
      {/* Table leg */}
      <mesh position={[0, 0.1, 0.5]}>
        <cylinderGeometry args={[0.06, 0.06, 0.2, 8]} />
        <meshLambertMaterial color="#3a2010" />
      </mesh>
      {/* Small vase on table */}
      <mesh position={[0, 0.34, 0.5]}>
        <cylinderGeometry args={[0.07, 0.1, 0.22, 10]} />
        <meshLambertMaterial color="#c0a060" />
      </mesh>
      <mesh position={[0, 0.56, 0.5]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshLambertMaterial color="#e84040" />
      </mesh>
    </group>

    {/* ════════════════════════════════════════════════════════════════ */}
    {/* 🔥 2. FIREPLACE MANTLE — back wall warm glow                    */}
    {/* ════════════════════════════════════════════════════════════════ */}
    <group position={[0, 0, 73]}>
      {/* Mantle surround — outer */}
      <mesh position={[0, 1.8, 0]}>
        <boxGeometry args={[3.8, 3.6, 0.55]} />
        <meshLambertMaterial color="#c8b89a" />
      </mesh>
      {/* Firebox opening (dark inset) */}
      <mesh position={[0, 1.2, 0.1]}>
        <boxGeometry args={[2.2, 2.0, 0.4]} />
        <meshLambertMaterial color="#111" />
      </mesh>
      {/* Inner fire glow plane */}
      <mesh position={[0, 0.7, 0.28]}>
        <planeGeometry args={[1.8, 1.0]} />
        <meshBasicMaterial color="#ff6a00" />
      </mesh>
      <mesh position={[0, 1.0, 0.27]}>
        <planeGeometry args={[1.4, 0.7]} />
        <meshBasicMaterial color="#ffb347" />
      </mesh>
      {/* Top mantle shelf */}
      <mesh position={[0, 3.68, 0.1]}>
        <boxGeometry args={[4.0, 0.12, 0.75]} />
        <meshLambertMaterial color="#d4c4a0" />
      </mesh>
      {/* Mantle shelf decorations: 2 candles */}
      {[-1.4, 1.4].map((cx, i) => (
        <group key={i} position={[cx, 3.8, 0.1]}>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
            <meshLambertMaterial color="#f5f0e0" />
          </mesh>
          <mesh position={[0, 0.32, 0]}>
            <sphereGeometry args={[0.06, 6, 6]} />
            <meshBasicMaterial color="#ffdd77" />
          </mesh>
        </group>
      ))}
    </group>
  </group>
);

export default FamilyHallDecoration;
