import React from 'react';
import * as THREE from 'three';

// 💼 Professional Hall Decorations — West Wing (X: -30 to -125, Hall center: [-77, 0, 0])

const ProfessionalHallDecoration = () => (
  <group>
    {/* ════════════════════════════════════════════════════════════════ */}
    {/* 🏛️ 0. GRAND ENTRANCE COLUMNS (At X = -32)                        */}
    {/* ════════════════════════════════════════════════════════════════ */}
    {[[-32, -13.2], [-32, 13.2]].map(([cx, cz], i) => (
      <group key={`entrance-col-${i}`} position={[cx, 0, cz]}>
        {/* Base plinth */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.9, 0.4, 0.9]} />
          <meshLambertMaterial color="#0f0f0f" />
        </mesh>
        {/* Column Shaft */}
        <mesh position={[0, 3.8, 0]}>
          <cylinderGeometry args={[0.32, 0.36, 7.2, 18]} />
          <meshLambertMaterial color="#1c1c1c" />
        </mesh>
        {/* Glowing Capital Top */}
        <mesh position={[0, 7.6, 0]}>
          <boxGeometry args={[0.85, 0.5, 0.85]} />
          <meshBasicMaterial color="#fde047" />
        </mesh>
      </group>
    ))}

    {/* ════════════════════════════════════════════════════════════════ */}
    {/* 📱 0b. INTERACTIVE DIGITAL INFO KIOSK (At X = -42)                */}
    {/* ════════════════════════════════════════════════════════════════ */}
    <group position={[-42, 0, -2.8]} rotation={[0, 0, 0]}>
      {/* Base */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.6, 0.1, 0.5]} />
        <meshLambertMaterial color="#0f0f0f" />
      </mesh>
      {/* Stand */}
      <mesh position={[0, 0.55, 0]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.15, 1.0, 0.12]} />
        <meshLambertMaterial color="#1c1c1c" />
      </mesh>
      {/* Screen Frame */}
      <mesh position={[0, 1.15, 0.05]} rotation={[0, 0, 0.35]}>
        <boxGeometry args={[0.7, 0.5, 0.06]} />
        <meshLambertMaterial color="#0f0f0f" />
      </mesh>
      {/* Screen Glass */}
      <mesh position={[0, 1.15, 0.08]} rotation={[-0.45, 0, 0]}>
        <planeGeometry args={[0.62, 0.42]} />
        <meshBasicMaterial color="#fde047" side={THREE.DoubleSide} />
      </mesh>
    </group>

    {/* ════════════════════════════════════════════════════════════════ */}
    {/* 🖤 1. MINIMALIST DISPLAY PEDESTAL CLUSTER — center of hall      */}
    {/* ════════════════════════════════════════════════════════════════ */}
    <group position={[-77, 0, 0]}>
      {/* Floor Inlay Medallion */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.5, 3.2, 32]} />
        <meshBasicMaterial color="#fde047" side={THREE.DoubleSide} />
      </mesh>

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
    {/* 🪙 1b. BRASS ROPE STANCHIONS (Around Center Pedestals X = -77)    */}
    {/* ════════════════════════════════════════════════════════════════ */}
    {[
      [-79, -3.5], [-75, -3.5], [-79, 3.5], [-75, 3.5]
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
          <meshBasicMaterial color="#fde047" />
        </mesh>
      </group>
    ))}

    {/* ════════════════════════════════════════════════════════════════ */}
    {/* 🪑 1c. EXECUTIVE GALLERY BENCHES (At X = -60 and X = -95)        */}
    {/* ════════════════════════════════════════════════════════════════ */}
    {[-60, -95].map((benchX) => (
      <group key={`bench-${benchX}`} position={[benchX, 0, 0]}>
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[2.8, 0.44, 1.1]} />
          <meshLambertMaterial color="#0f0f0f" />
        </mesh>
        <mesh position={[0, 0.46, 0]}>
          <boxGeometry args={[2.9, 0.05, 1.2]} />
          <meshLambertMaterial color="#1c1c1c" />
        </mesh>
      </group>
    ))}

    {/* ════════════════════════════════════════════════════════════════ */}
    {/* 💎 2. BACK WALL EXECUTIVE FEATURE (At X = -122.5)                */}
    {/* ════════════════════════════════════════════════════════════════ */}
    <group position={[-122.5, 0, 0]}>
      {/* Center Pedestal */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.4, 0.45, 1.2, 24]} />
        <meshLambertMaterial color="#0f0f0f" />
      </mesh>
      <mesh position={[0, 1.23, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.05, 24]} />
        <meshLambertMaterial color="#1c1c1c" />
      </mesh>
      {/* Golden Geometric Crystal Sculpture */}
      <mesh position={[0, 1.65, 0]} rotation={[0.4, 0.3, 0.2]}>
        <dodecahedronGeometry args={[0.3, 0]} />
        <meshBasicMaterial color="#fde047" />
      </mesh>

      {/* Flanking Stanchions */}
      {[-2.2, 2.2].map((sz, i) => (
        <group key={`back-st-${i}`} position={[1.5, 0, sz]}>
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
            <meshBasicMaterial color="#fde047" />
          </mesh>
        </group>
      ))}
    </group>

    {/* ════════════════════════════════════════════════════════════════ */}
    {/* 💡 3. MODERN MUSEUM WALL SCONCES / LAMPS                         */}
    {/* ════════════════════════════════════════════════════════════════ */}
    {[-40, -56, -72, -88, -104].map((xPos) => (
      <group key={`wall-sconce-${xPos}`}>
        {/* Top Wall Lamp (Z = -14.5) */}
        <group position={[xPos, 6.5, -14.5]}>
          <mesh position={[0, 0, 0.15]}>
            <boxGeometry args={[0.08, 0.08, 0.3]} />
            <meshLambertMaterial color="#0f0f0f" />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.45, 16]} />
            <meshLambertMaterial color="#1c1c1c" />
          </mesh>
          <mesh position={[0, 0.24, 0]}>
            <cylinderGeometry args={[0.085, 0.085, 0.05, 16]} />
            <meshBasicMaterial color="#fde68a" />
          </mesh>
          <mesh position={[0, -0.24, 0]}>
            <cylinderGeometry args={[0.085, 0.085, 0.05, 16]} />
            <meshBasicMaterial color="#fde68a" />
          </mesh>
        </group>

        {/* Bottom Wall Lamp (Z = 14.5) */}
        <group position={[xPos, 6.5, 14.5]}>
          <mesh position={[0, 0, -0.15]}>
            <boxGeometry args={[0.08, 0.08, 0.3]} />
            <meshLambertMaterial color="#0f0f0f" />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.45, 16]} />
            <meshLambertMaterial color="#1c1c1c" />
          </mesh>
          <mesh position={[0, 0.24, 0]}>
            <cylinderGeometry args={[0.085, 0.085, 0.05, 16]} />
            <meshBasicMaterial color="#fde68a" />
          </mesh>
          <mesh position={[0, -0.24, 0]}>
            <cylinderGeometry args={[0.085, 0.085, 0.05, 16]} />
            <meshBasicMaterial color="#fde68a" />
          </mesh>
        </group>
      </group>
    ))}

    {/* ════════════════════════════════════════════════════════════════ */}
    {/* 🕯️ 4. CEILING PENDANT SPOTLIGHTS                                 */}
    {/* ════════════════════════════════════════════════════════════════ */}
    {[-50, -70, -90, -110].map((px) => (
      <group key={`pendant-light-${px}`} position={[px, 8.8, 0]}>
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 1.2, 8]} />
          <meshLambertMaterial color="#333" />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.14, 0.22, 0.35, 16]} />
          <meshLambertMaterial color="#0f0f0f" />
        </mesh>
        <mesh position={[0, -0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.02, 0.2, 16]} />
          <meshBasicMaterial color="#fde047" />
        </mesh>
      </group>
    ))}

    {/* ════════════════════════════════════════════════════════════════ */}
    {/* ✨ 5. FLOOR ACCENT LIGHT STRIP — running along the center aisle  */}
    {/* ════════════════════════════════════════════════════════════════ */}
    {[-40, -48, -56, -64, -72, -80, -88, -96, -104, -112, -120].map((bx) => (
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

