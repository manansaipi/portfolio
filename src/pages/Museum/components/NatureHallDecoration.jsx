import React from 'react';
import * as THREE from 'three';

// 🌿 Nature Hall Decorations — North Wing (Z: -30 to -125, Hall center: [0, 0, -77])

const NatureHallDecoration = () => (
  <group>
    {/* ════════════════════════════════════════════════════════════════ */}
    {/* 🏛️ 0. GRAND ENTRANCE COLUMNS (At Z = -32)                        */}
    {/* ════════════════════════════════════════════════════════════════ */}
    {[[-13.2, -32], [13.2, -32]].map(([cx, cz], i) => (
      <group key={`entrance-col-${i}`} position={[cx, 0, cz]}>
        {/* Base plinth */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.9, 0.4, 0.9]} />
          <meshLambertMaterial color="#1c261d" />
        </mesh>
        {/* Column Shaft */}
        <mesh position={[0, 3.8, 0]}>
          <cylinderGeometry args={[0.32, 0.36, 7.2, 18]} />
          <meshLambertMaterial color="#2d3b2d" />
        </mesh>
        {/* Glowing Capital Top */}
        <mesh position={[0, 7.6, 0]}>
          <boxGeometry args={[0.85, 0.5, 0.85]} />
          <meshBasicMaterial color="#86efac" />
        </mesh>
      </group>
    ))}

    {/* ════════════════════════════════════════════════════════════════ */}
    {/* 📱 0b. INTERACTIVE DIGITAL INFO KIOSK (At Z = -42)                */}
    {/* ════════════════════════════════════════════════════════════════ */}
    <group position={[-2.8, 0, -42]} rotation={[0, -Math.PI / 6, 0]}>
      {/* Base */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.6, 0.1, 0.5]} />
        <meshLambertMaterial color="#1c261d" />
      </mesh>
      {/* Stand */}
      <mesh position={[0, 0.55, 0]} rotation={[0.15, 0, 0]}>
        <boxGeometry args={[0.15, 1.0, 0.12]} />
        <meshLambertMaterial color="#2d3b2d" />
      </mesh>
      {/* Screen Frame */}
      <mesh position={[0, 1.15, 0.05]} rotation={[-0.45, 0, 0]}>
        <boxGeometry args={[0.7, 0.5, 0.06]} />
        <meshLambertMaterial color="#1c261d" />
      </mesh>
      {/* Screen Glass */}
      <mesh position={[0, 1.15, 0.09]} rotation={[-0.45, 0, 0]}>
        <planeGeometry args={[0.62, 0.42]} />
        <meshBasicMaterial color="#86efac" side={THREE.DoubleSide} />
      </mesh>
    </group>

    {/* ════════════════════════════════════════════════════════════════ */}
    {/* 🌳 1. SPECIMEN TREE & MEDALLION — center of hall (Z = -52)        */}
    {/* ════════════════════════════════════════════════════════════════ */}
    <group position={[0, 0, -52]}>
      {/* Floor Inlay Medallion */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.5, 3.2, 32]} />
        <meshBasicMaterial color="#86efac" side={THREE.DoubleSide} />
      </mesh>

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
      {/* Branch forks */}
      <mesh position={[-0.6, 4.2, 0.2]} rotation={[0, 0, 0.4]}>
        <cylinderGeometry args={[0.1, 0.18, 2.0, 8]} />
        <meshLambertMaterial color="#5c3d2e" />
      </mesh>
      <mesh position={[0.6, 4.4, -0.2]} rotation={[0, 0, -0.35]}>
        <cylinderGeometry args={[0.1, 0.18, 2.0, 8]} />
        <meshLambertMaterial color="#5c3d2e" />
      </mesh>
      {/* Upper canopy */}
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

    {/* 🪙 1b. BRASS ROPE STANCHIONS (Around Specimen Tree Z = -52)       */}
    {[
      [-2.8, -50], [2.8, -50], [-2.8, -54], [2.8, -54]
    ].map(([sx, sz], i) => (
      <group key={`tree-stanchion-${i}`} position={[sx, 0, sz]}>
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.06, 16]} />
          <meshLambertMaterial color="#b8962e" />
        </mesh>
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.84, 12]} />
          <meshLambertMaterial color="#b8962e" />
        </mesh>
        <mesh position={[0, 0.9, 0]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshBasicMaterial color="#86efac" />
        </mesh>
      </group>
    ))}

    {/* 🪑 1c. BOTANICAL GALLERY BENCHES (At Z = -72 & Z = -98)           */}
    {[-72, -98].map((benchZ) => (
      <group key={`bench-${benchZ}`} position={[0, 0, benchZ]}>
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[1.2, 0.44, 3.2]} />
          <meshLambertMaterial color="#1c261d" />
        </mesh>
        <mesh position={[0, 0.46, 0]}>
          <boxGeometry args={[1.3, 0.05, 3.3]} />
          <meshLambertMaterial color="#2d3b2d" />
        </mesh>
      </group>
    ))}

    {/* ════════════════════════════════════════════════════════════════ */}
    {/* 🪨 2. ROCK CLUSTER & CRYSTAL FEATURE — back wall (Z = -120)       */}
    {/* ════════════════════════════════════════════════════════════════ */}
    <group position={[8, 0, -120]}>
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

    <group position={[-8, 0, -120]}>
      <mesh position={[0, 0.4, 0]} rotation={[-0.1, 0.6, 0.15]}>
        <dodecahedronGeometry args={[0.7, 0]} />
        <meshLambertMaterial color="#6b6b6b" />
      </mesh>
      <mesh position={[0.8, 0.2, 0.4]} rotation={[0.2, -0.2, 0.0]}>
        <dodecahedronGeometry args={[0.48, 0]} />
        <meshLambertMaterial color="#757575" />
      </mesh>
    </group>

    {/* Central Emerald Crystal Pedestal at Z = -122 */}
    <group position={[0, 0, -122.5]}>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.4, 0.45, 1.2, 24]} />
        <meshLambertMaterial color="#1c261d" />
      </mesh>
      <mesh position={[0, 1.23, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.05, 24]} />
        <meshLambertMaterial color="#2d3b2d" />
      </mesh>
      {/* Emerald Crystal */}
      <mesh position={[0, 1.7, 0]} rotation={[0.3, 0.5, 0.2]}>
        <octahedronGeometry args={[0.32, 0]} />
        <meshBasicMaterial color="#4ade80" />
      </mesh>

      {/* Flanking Stanchions */}
      {[-2.2, 2.2].map((sx, i) => (
        <group key={`back-st-${i}`} position={[sx, 0, 1.5]}>
          <mesh position={[0, 0.03, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.06, 16]} />
            <meshLambertMaterial color="#b8962e" />
          </mesh>
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.84, 12]} />
            <meshLambertMaterial color="#b8962e" />
          </mesh>
          <mesh position={[0, 0.9, 0]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshBasicMaterial color="#86efac" />
          </mesh>
        </group>
      ))}
    </group>

    {/* ════════════════════════════════════════════════════════════════ */}
    {/* 💡 3. MODERN MUSEUM WALL SCONCES / LAMPS                         */}
    {/* ════════════════════════════════════════════════════════════════ */}
    {[-40, -56, -72, -88, -104].map((zPos) => (
      <group key={`wall-sconce-${zPos}`}>
        {/* Left Wall Lamp (X = -14.5) */}
        <group position={[-14.5, 6.5, zPos]}>
          <mesh position={[0.15, 0, 0]}>
            <boxGeometry args={[0.3, 0.08, 0.08]} />
            <meshLambertMaterial color="#1c261d" />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.45, 16]} />
            <meshLambertMaterial color="#2d3b2d" />
          </mesh>
          <mesh position={[0, 0.24, 0]}>
            <cylinderGeometry args={[0.085, 0.085, 0.05, 16]} />
            <meshBasicMaterial color="#86efac" />
          </mesh>
          <mesh position={[0, -0.24, 0]}>
            <cylinderGeometry args={[0.085, 0.085, 0.05, 16]} />
            <meshBasicMaterial color="#86efac" />
          </mesh>
        </group>

        {/* Right Wall Lamp (X = 14.5) */}
        <group position={[14.5, 6.5, zPos]}>
          <mesh position={[-0.15, 0, 0]}>
            <boxGeometry args={[0.3, 0.08, 0.08]} />
            <meshLambertMaterial color="#1c261d" />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.45, 16]} />
            <meshLambertMaterial color="#2d3b2d" />
          </mesh>
          <mesh position={[0, 0.24, 0]}>
            <cylinderGeometry args={[0.085, 0.085, 0.05, 16]} />
            <meshBasicMaterial color="#86efac" />
          </mesh>
          <mesh position={[0, -0.24, 0]}>
            <cylinderGeometry args={[0.085, 0.085, 0.05, 16]} />
            <meshBasicMaterial color="#86efac" />
          </mesh>
        </group>
      </group>
    ))}

    {/* ════════════════════════════════════════════════════════════════ */}
    {/* 🕯️ 4. CEILING PENDANT SPOTLIGHTS                                 */}
    {/* ════════════════════════════════════════════════════════════════ */}
    {[-42, -66, -90, -110].map((pz) => (
      <group key={`pendant-light-${pz}`} position={[0, 8.8, pz]}>
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 1.2, 8]} />
          <meshLambertMaterial color="#334155" />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.14, 0.22, 0.35, 16]} />
          <meshLambertMaterial color="#1c261d" />
        </mesh>
        <mesh position={[0, -0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.02, 0.2, 16]} />
          <meshBasicMaterial color="#86efac" side={THREE.DoubleSide} />
        </mesh>
      </group>
    ))}

    {/* ════════════════════════════════════════════════════════════════ */}
    {/* ✨ 5. FLOOR ACCENT LIGHT STRIP — running along the center aisle  */}
    {/* ════════════════════════════════════════════════════════════════ */}
    {[-40, -48, -56, -64, -72, -80, -88, -96, -104, -112, -120].map((bz) => (
      <group key={bz}>
        {/* Left floor strip */}
        <mesh position={[-3, 0.008, bz]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[6, 0.12]} />
          <meshBasicMaterial color="#86efac" />
        </mesh>
        {/* Right floor strip */}
        <mesh position={[3, 0.008, bz]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[6, 0.12]} />
          <meshBasicMaterial color="#86efac" />
        </mesh>
      </group>
    ))}
  </group>
);

export default NatureHallDecoration;

