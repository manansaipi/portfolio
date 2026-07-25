import React from 'react';

// 🧗 Adventure Hall Decorations — Hall center: [52, 0, 0], East Wing

const AdventureHallDecoration = () => (
  <group>
    {/* ════════════════════════════════════════════════════════════════ */}
    {/* 🧳 1. EXPLORER TRUNK STACK — center feature                     */}
    {/* ════════════════════════════════════════════════════════════════ */}
    <group position={[52, 0, 0]}>
      {/* Large bottom trunk */}
      <mesh position={[0, 0.38, 0]}>
        <boxGeometry args={[1.8, 0.75, 1.1]} />
        <meshLambertMaterial color="#7c4a1e" />
      </mesh>
      {/* Lid detail strip */}
      <mesh position={[0, 0.77, 0]}>
        <boxGeometry args={[1.82, 0.06, 1.12]} />
        <meshLambertMaterial color="#5a3211" />
      </mesh>
      {/* Metal corner bolts (4 spheres) */}
      {[[-0.85, 0.38, -0.52], [-0.85, 0.38, 0.52], [0.85, 0.38, -0.52], [0.85, 0.38, 0.52]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.07, 6, 6]} />
          <meshLambertMaterial color="#c9a84c" />
        </mesh>
      ))}
      {/* Smaller trunk on top, angled slightly */}
      <mesh position={[0.2, 1.25, 0.1]} rotation={[0, 0.1, 0]}>
        <boxGeometry args={[1.2, 0.5, 0.75]} />
        <meshLambertMaterial color="#6b3a15" />
      </mesh>
      <mesh position={[0.2, 1.52, 0.1]}>
        <boxGeometry args={[1.22, 0.05, 0.77]} />
        <meshLambertMaterial color="#4d2a0e" />
      </mesh>
    </group>

    {/* ════════════════════════════════════════════════════════════════ */}
    {/* 🌍 2. GLOBE ON PEDESTAL — back-wall accent                      */}
    {/* ════════════════════════════════════════════════════════════════ */}
    <group position={[65, 0, 6]}>
      {/* Pedestal */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.2, 0.28, 1.2, 14]} />
        <meshLambertMaterial color="#3a2a1a" />
      </mesh>
      {/* Pedestal top disc */}
      <mesh position={[0, 1.22, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.06, 14]} />
        <meshLambertMaterial color="#5a3c1e" />
      </mesh>
      {/* Meridian ring outer */}
      <mesh position={[0, 1.9, 0]} rotation={[0, 0, Math.PI / 6]}>
        <torusGeometry args={[0.72, 0.04, 8, 32]} />
        <meshLambertMaterial color="#b8962e" />
      </mesh>
      {/* Meridian ring inner */}
      <mesh position={[0, 1.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.72, 0.035, 8, 32]} />
        <meshLambertMaterial color="#b8962e" />
      </mesh>
      {/* Globe sphere */}
      <mesh position={[0, 1.9, 0]}>
        <sphereGeometry args={[0.68, 20, 16]} />
        <meshLambertMaterial color="#1a4a7a" />
      </mesh>
      {/* Land masses — simple raised patches */}
      <mesh position={[0.1, 2.2, 0.55]} rotation={[0.4, 0, 0]}>
        <sphereGeometry args={[0.28, 8, 8]} />
        <meshLambertMaterial color="#2d6e2d" />
      </mesh>
      <mesh position={[-0.4, 1.7, 0.5]}>
        <sphereGeometry args={[0.22, 8, 8]} />
        <meshLambertMaterial color="#2d6e2d" />
      </mesh>
    </group>
  </group>
);

export default AdventureHallDecoration;
