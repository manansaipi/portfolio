import React from 'react';
import * as THREE from 'three';

// 🧗 Adventure Hall Decorations — East Wing (X: 30 to 125, Hall center: [77, 0, 0])

const AdventureHallDecoration = () => (
  <group>
    {/* ════════════════════════════════════════════════════════════════ */}
    {/* 🏛️ 0. GRAND ENTRANCE COLUMNS (At X = 32)                         */}
    {/* ════════════════════════════════════════════════════════════════ */}
    {[[32, -13.2], [32, 13.2]].map(([cx, cz], i) => (
      <group key={`entrance-col-${i}`} position={[cx, 0, cz]}>
        {/* Base plinth */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.9, 0.4, 0.9]} />
          <meshLambertMaterial color="#2b1a0e" />
        </mesh>
        {/* Column Shaft */}
        <mesh position={[0, 3.8, 0]}>
          <cylinderGeometry args={[0.32, 0.36, 7.2, 18]} />
          <meshLambertMaterial color="#3d2817" />
        </mesh>
        {/* Glowing Capital Top */}
        <mesh position={[0, 7.6, 0]}>
          <boxGeometry args={[0.85, 0.5, 0.85]} />
          <meshBasicMaterial color="#fed7aa" />
        </mesh>
      </group>
    ))}

    {/* ════════════════════════════════════════════════════════════════ */}
    {/* 📱 0b. INTERACTIVE DIGITAL INFO KIOSK (At X = 42)                */}
    {/* ════════════════════════════════════════════════════════════════ */}
    <group position={[42, 0, -2.8]} rotation={[0, 0, 0]}>
      {/* Base */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.6, 0.1, 0.5]} />
        <meshLambertMaterial color="#2b1a0e" />
      </mesh>
      {/* Stand */}
      <mesh position={[0, 0.55, 0]} rotation={[0, 0, -0.15]}>
        <boxGeometry args={[0.15, 1.0, 0.12]} />
        <meshLambertMaterial color="#3d2817" />
      </mesh>
      {/* Screen Frame */}
      <mesh position={[0, 1.15, 0.05]} rotation={[0, 0, -0.35]}>
        <boxGeometry args={[0.7, 0.5, 0.06]} />
        <meshLambertMaterial color="#2b1a0e" />
      </mesh>
      {/* Screen Glass */}
      <mesh position={[0, 1.15, 0.09]} rotation={[0, 0, -0.35]}>
        <planeGeometry args={[0.62, 0.42]} />
        <meshBasicMaterial color="#fb923c" side={THREE.DoubleSide} />
      </mesh>
    </group>

    {/* ════════════════════════════════════════════════════════════════ */}
    {/* 🧳 1. EXPLORER TRUNK STACK & MEDALLION — center feature          */}
    {/* ════════════════════════════════════════════════════════════════ */}
    <group position={[77, 0, 0]}>
      {/* Floor Inlay Medallion */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.5, 3.2, 32]} />
        <meshBasicMaterial color="#fed7aa" side={THREE.DoubleSide} />
      </mesh>

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
      {/* Metal corner bolts */}
      {[[-0.85, 0.38, -0.52], [-0.85, 0.38, 0.52], [0.85, 0.38, -0.52], [0.85, 0.38, 0.52]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.07, 6, 6]} />
          <meshLambertMaterial color="#c9a84c" />
        </mesh>
      ))}
      {/* Smaller trunk on top */}
      <mesh position={[0.2, 1.25, 0.1]} rotation={[0, 0.1, 0]}>
        <boxGeometry args={[1.2, 0.5, 0.75]} />
        <meshLambertMaterial color="#6b3a15" />
      </mesh>
      <mesh position={[0.2, 1.52, 0.1]}>
        <boxGeometry args={[1.22, 0.05, 0.77]} />
        <meshLambertMaterial color="#4d2a0e" />
      </mesh>
    </group>

    {/* 🪙 1b. BRASS ROPE STANCHIONS (Around Explorer Trunks X = 77)       */}
    {[
      [75, -3.5], [79, -3.5], [75, 3.5], [79, 3.5]
    ].map(([bx, bz], i) => (
      <group key={`stanchion-${i}`} position={[bx, 0, bz]}>
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
          <meshBasicMaterial color="#fed7aa" />
        </mesh>
      </group>
    ))}

    {/* 🪑 1c. EXPLORER GALLERY BENCHES (At X = 60 & X = 95)              */}
    {[60, 95].map((benchX) => (
      <group key={`bench-${benchX}`} position={[benchX, 0, 0]}>
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[2.8, 0.44, 1.1]} />
          <meshLambertMaterial color="#2b1a0e" />
        </mesh>
        <mesh position={[0, 0.46, 0]}>
          <boxGeometry args={[2.9, 0.05, 1.2]} />
          <meshLambertMaterial color="#3d2817" />
        </mesh>
      </group>
    ))}

    {/* ════════════════════════════════════════════════════════════════ */}
    {/* 🌍 2. GLOBE & PEDESTAL FEATURE — back-wall (At X = 122.5)        */}
    {/* ════════════════════════════════════════════════════════════════ */}
    <group position={[122.5, 0, 0]}>
      {/* Pedestal */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.4, 0.45, 1.2, 24]} />
        <meshLambertMaterial color="#3a2a1a" />
      </mesh>
      <mesh position={[0, 1.23, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.05, 24]} />
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
      {/* Land masses */}
      <mesh position={[0.1, 2.2, 0.55]} rotation={[0.4, 0, 0]}>
        <sphereGeometry args={[0.28, 8, 8]} />
        <meshLambertMaterial color="#2d6e2d" />
      </mesh>
      <mesh position={[-0.4, 1.7, 0.5]}>
        <sphereGeometry args={[0.22, 8, 8]} />
        <meshLambertMaterial color="#2d6e2d" />
      </mesh>

      {/* Flanking Stanchions */}
      {[-2.2, 2.2].map((sz, i) => (
        <group key={`back-st-${i}`} position={[-1.5, 0, sz]}>
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
            <meshBasicMaterial color="#fed7aa" />
          </mesh>
        </group>
      ))}
    </group>

    {/* ════════════════════════════════════════════════════════════════ */}
    {/* 💡 3. MODERN MUSEUM WALL SCONCES / LAMPS                         */}
    {/* ════════════════════════════════════════════════════════════════ */}
    {[40, 56, 72, 88, 104].map((xPos) => (
      <group key={`wall-sconce-${xPos}`}>
        {/* Top Wall Lamp (Z = -14.5) */}
        <group position={[xPos, 6.5, -14.5]}>
          <mesh position={[0, 0, 0.15]}>
            <boxGeometry args={[0.08, 0.08, 0.3]} />
            <meshLambertMaterial color="#2b1a0e" />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.45, 16]} />
            <meshLambertMaterial color="#3d2817" />
          </mesh>
          <mesh position={[0, 0.24, 0]}>
            <cylinderGeometry args={[0.085, 0.085, 0.05, 16]} />
            <meshBasicMaterial color="#fed7aa" />
          </mesh>
          <mesh position={[0, -0.24, 0]}>
            <cylinderGeometry args={[0.085, 0.085, 0.05, 16]} />
            <meshBasicMaterial color="#fed7aa" />
          </mesh>
        </group>

        {/* Bottom Wall Lamp (Z = 14.5) */}
        <group position={[xPos, 6.5, 14.5]}>
          <mesh position={[0, 0, -0.15]}>
            <boxGeometry args={[0.08, 0.08, 0.3]} />
            <meshLambertMaterial color="#2b1a0e" />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.45, 16]} />
            <meshLambertMaterial color="#3d2817" />
          </mesh>
          <mesh position={[0, 0.24, 0]}>
            <cylinderGeometry args={[0.085, 0.085, 0.05, 16]} />
            <meshBasicMaterial color="#fed7aa" />
          </mesh>
          <mesh position={[0, -0.24, 0]}>
            <cylinderGeometry args={[0.085, 0.085, 0.05, 16]} />
            <meshBasicMaterial color="#fed7aa" />
          </mesh>
        </group>
      </group>
    ))}

    {/* ════════════════════════════════════════════════════════════════ */}
    {/* 🕯️ 4. CEILING PENDANT SPOTLIGHTS                                 */}
    {/* ════════════════════════════════════════════════════════════════ */}
    {[50, 70, 90, 110].map((px) => (
      <group key={`pendant-light-${px}`} position={[px, 8.8, 0]}>
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 1.2, 8]} />
          <meshLambertMaterial color="#334155" />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.14, 0.22, 0.35, 16]} />
          <meshLambertMaterial color="#2b1a0e" />
        </mesh>
        <mesh position={[0, -0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.02, 0.2, 16]} />
          <meshBasicMaterial color="#fed7aa" />
        </mesh>
      </group>
    ))}

    {/* ════════════════════════════════════════════════════════════════ */}
    {/* ✨ 5. FLOOR ACCENT LIGHT STRIP — running along the center aisle  */}
    {/* ════════════════════════════════════════════════════════════════ */}
    {[40, 48, 56, 64, 72, 80, 88, 96, 104, 112, 120].map((bx) => (
      <group key={bx}>
        {/* Left floor strip */}
        <mesh position={[bx, 0.008, -3]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.12, 6]} />
          <meshBasicMaterial color="#fed7aa" />
        </mesh>
        {/* Right floor strip */}
        <mesh position={[bx, 0.008, 3]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.12, 6]} />
          <meshBasicMaterial color="#fed7aa" />
        </mesh>
      </group>
    ))}
  </group>
);

export default AdventureHallDecoration;

