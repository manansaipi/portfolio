import React from 'react';

// 🌿 Nature Hall Decorations — Hall center: [0, 0, -52], North Wing

const NatureHallDecoration = () => (
  <group>
    {/* ════════════════════════════════════════════════════════════════ */}
    {/* 🌳 1. SPECIMEN TREE — center of the hall                        */}
    {/* ════════════════════════════════════════════════════════════════ */}
    <group position={[0, 0, -52]}>
      {/* Root base mound */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.8, 1.1, 0.3, 14]} />
        <meshLambertMaterial color="#3d2b1f" />
      </mesh>
      {/* Main trunk */}
      <mesh position={[0, 2.1, 0]}>
        <cylinderGeometry args={[0.22, 0.35, 3.8, 12]} />
        <meshLambertMaterial color="#5c3d2e" />
      </mesh>
      {/* Branch fork 1 */}
      <mesh position={[-0.6, 4.2, 0.2]} rotation={[0, 0, 0.4]}>
        <cylinderGeometry args={[0.1, 0.18, 2.0, 8]} />
        <meshLambertMaterial color="#5c3d2e" />
      </mesh>
      {/* Branch fork 2 */}
      <mesh position={[0.6, 4.4, -0.2]} rotation={[0, 0, -0.35]}>
        <cylinderGeometry args={[0.1, 0.18, 2.0, 8]} />
        <meshLambertMaterial color="#5c3d2e" />
      </mesh>
      {/* Upper canopy — 3 overlapping spheres */}
      <mesh position={[0, 6.2, 0]}>
        <sphereGeometry args={[2.2, 14, 12]} />
        <meshLambertMaterial color="#15803d" />
      </mesh>
      <mesh position={[-1.1, 5.5, 0.4]}>
        <sphereGeometry args={[1.4, 12, 10]} />
        <meshLambertMaterial color="#166534" />
      </mesh>
      <mesh position={[1.2, 5.8, -0.3]}>
        <sphereGeometry args={[1.5, 12, 10]} />
        <meshLambertMaterial color="#14532d" />
      </mesh>
      {/* Planter box */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[2.2, 0.9, 2.2]} />
        <meshLambertMaterial color="#1c1008" />
      </mesh>
    </group>

    {/* ════════════════════════════════════════════════════════════════ */}
    {/* 🪨 2. ROCK CLUSTER — back wall accent                           */}
    {/* ════════════════════════════════════════════════════════════════ */}
    <group position={[8, 0, -70]}>
      <mesh position={[0, 0.5, 0]} rotation={[0.2, 0.4, 0.1]}>
        <dodecahedronGeometry args={[0.9, 0]} />
        <meshLambertMaterial color="#6b6b6b" />
      </mesh>
      <mesh position={[-1.1, 0.3, 0.3]} rotation={[0.1, -0.3, 0.2]}>
        <dodecahedronGeometry args={[0.6, 0]} />
        <meshLambertMaterial color="#7a7a7a" />
      </mesh>
      <mesh position={[0.9, 0.2, -0.4]} rotation={[-0.1, 0.5, 0.0]}>
        <dodecahedronGeometry args={[0.45, 0]} />
        <meshLambertMaterial color="#5a5a5a" />
      </mesh>
      <mesh position={[-0.4, 0.1, 0.8]}>
        <sphereGeometry args={[0.22, 6, 6]} />
        <meshLambertMaterial color="#888" />
      </mesh>
    </group>
    <group position={[-8, 0, -70]}>
      <mesh position={[0, 0.4, 0]} rotation={[-0.1, 0.6, 0.15]}>
        <dodecahedronGeometry args={[0.7, 0]} />
        <meshLambertMaterial color="#6b6b6b" />
      </mesh>
      <mesh position={[0.8, 0.2, 0.4]} rotation={[0.2, -0.2, 0.0]}>
        <dodecahedronGeometry args={[0.48, 0]} />
        <meshLambertMaterial color="#757575" />
      </mesh>
    </group>
  </group>
);

export default NatureHallDecoration;
