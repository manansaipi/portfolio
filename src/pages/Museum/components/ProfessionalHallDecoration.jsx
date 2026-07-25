import React from 'react';

// 💼 Professional Hall Decorations — Hall center: [-52, 0, 0], West Wing

const ProfessionalHallDecoration = () => (
  <group>
    {/* ════════════════════════════════════════════════════════════════ */}
    {/* 🖤 1. MINIMALIST DISPLAY PEDESTAL CLUSTER — center of hall      */}
    {/* ════════════════════════════════════════════════════════════════ */}
    <group position={[-52, 0, 0]}>
      {/* Tall slim pedestal */}
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[0.35, 1.5, 0.35]} />
        <meshLambertMaterial color="#0f0f0f" />
      </mesh>
      <mesh position={[0, 1.53, 0]}>
        <boxGeometry args={[0.55, 0.06, 0.55]} />
        <meshLambertMaterial color="#1c1c1c" />
      </mesh>
      {/* Trophy-like chrome sphere on top */}
      <mesh position={[0, 1.72, 0]}>
        <sphereGeometry args={[0.2, 14, 14]} />
        <meshLambertMaterial color="#c0c0c0" />
      </mesh>

      {/* Short pedestal + floating cube art */}
      <mesh position={[1.4, 0.45, -0.8]}>
        <boxGeometry args={[0.4, 0.9, 0.4]} />
        <meshLambertMaterial color="#111" />
      </mesh>
      <mesh position={[1.4, 1.02, -0.8]} rotation={[0.3, 0.5, 0.2]}>
        <boxGeometry args={[0.32, 0.32, 0.32]} />
        <meshLambertMaterial color="#e0e0e0" />
      </mesh>

      {/* Medium pedestal + disc */}
      <mesh position={[-1.4, 0.6, 0.9]}>
        <cylinderGeometry args={[0.18, 0.22, 1.2, 16]} />
        <meshLambertMaterial color="#0a0a0a" />
      </mesh>
      <mesh position={[-1.4, 1.28, 0.9]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.06, 24]} />
        <meshLambertMaterial color="#b8b8b8" />
      </mesh>
    </group>

    {/* ════════════════════════════════════════════════════════════════ */}
    {/* ✨ 2. FLOOR ACCENT LIGHT STRIP — running along the center aisle  */}
    {/* ════════════════════════════════════════════════════════════════ */}
    {[-40, -48, -56, -64].map((bx) => (
      <group key={bx}>
        {/* Left floor strip */}
        <mesh position={[bx, 0.008, -3]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.12, 6]} />
          <meshBasicMaterial color="#fde68a" />
        </mesh>
        {/* Right floor strip */}
        <mesh position={[bx, 0.008, 3]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.12, 6]} />
          <meshBasicMaterial color="#fde68a" />
        </mesh>
      </group>
    ))}
  </group>
);

export default ProfessionalHallDecoration;
