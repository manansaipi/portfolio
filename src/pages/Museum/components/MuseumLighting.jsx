import React from 'react';

const MuseumLighting = () => {
  return (
    <group>
      {/* ── Ultra-Fast Global Fill Lighting ── */}
      <ambientLight intensity={1.5} color="#fffcf5" />

      {/* ── Main Directional Light ── */}
      <directionalLight
        position={[0, 20, 10]}
        intensity={1.0}
        color="#fffaed"
      />
    </group>
  );
};

export default MuseumLighting;
