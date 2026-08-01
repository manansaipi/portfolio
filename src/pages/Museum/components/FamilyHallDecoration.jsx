import React from 'react';
import * as THREE from 'three';

// 👨‍👩‍👧 Family Hall Decorations — South Wing (Hall center: [0, 0, 77])

const FamilyHallDecoration = () => (
  <group>
    {/* ════════════════════════════════════════════════════════════════ */}
    {/* 🏛️ 0. GRAND ENTRANCE COLUMNS (At Z = 32)                         */}
    {/* ════════════════════════════════════════════════════════════════ */}
    {[[-13.2, 32], [13.2, 32]].map(([cx, cz], i) => (
      <group key={`entrance-col-${i}`} position={[cx, 0, cz]}>
        {/* Base plinth */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.9, 0.4, 0.9]} />
          <meshLambertMaterial color="#0f172a" />
        </mesh>
        {/* Column Shaft */}
        <mesh position={[0, 3.8, 0]}>
          <cylinderGeometry args={[0.32, 0.36, 7.2, 18]} />
          <meshLambertMaterial color="#1e293b" />
        </mesh>
        {/* Glowing Capital Top */}
        <mesh position={[0, 7.6, 0]}>
          <boxGeometry args={[0.85, 0.5, 0.85]} />
          <meshBasicMaterial color="#bfdbfe" />
        </mesh>
      </group>
    ))}

    {/* ════════════════════════════════════════════════════════════════ */}
    {/* 📱 0b. INTERACTIVE DIGITAL INFO KIOSK (At Z = 42)                 */}
    {/* ════════════════════════════════════════════════════════════════ */}
    <group position={[-2.8, 0, 42]} rotation={[0, Math.PI / 6, 0]}>
      {/* Base */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.6, 0.1, 0.5]} />
        <meshLambertMaterial color="#0f172a" />
      </mesh>
      {/* Angled Stand */}
      <mesh position={[0, 0.55, 0]} rotation={[-0.15, 0, 0]}>
        <boxGeometry args={[0.15, 1.0, 0.12]} />
        <meshLambertMaterial color="#1e293b" />
      </mesh>
      {/* Screen Frame */}
      <mesh position={[0, 1.15, 0.05]} rotation={[-0.45, 0, 0]}>
        <boxGeometry args={[0.7, 0.5, 0.06]} />
        <meshLambertMaterial color="#0f172a" />
      </mesh>
      {/* Screen Display Glass */}
      <mesh position={[0, 1.15, 0.08]} rotation={[-0.45, 0, 0]}>
        <planeGeometry args={[0.62, 0.42]} />
        <meshBasicMaterial color="#bfdbfe" side={THREE.DoubleSide} />
      </mesh>
    </group>

    {/* ════════════════════════════════════════════════════════════════ */}
    {/* 🏛️ 1. MINIMALIST MUSEUM BENCH & PEDESTAL CLUSTER (Center Z = 77) */}
    {/* ════════════════════════════════════════════════════════════════ */}
    <group position={[0, 0, 77]}>
      {/* Floor Inlay Medallion */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.5, 3.2, 32]} />
        <meshBasicMaterial color="#bfdbfe" side={THREE.DoubleSide} />
      </mesh>

      {/* Sleek Minimalist Gallery Bench */}
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[1.2, 0.44, 3.2]} />
        <meshLambertMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0, 0.46, 0]}>
        <boxGeometry args={[1.3, 0.05, 3.3]} />
        <meshLambertMaterial color="#334155" />
      </mesh>

      {/* Small Minimalist Art Pedestal (Left Side) */}
      <mesh position={[-2.2, 0.5, 0]}>
        <boxGeometry args={[0.4, 1.0, 0.4]} />
        <meshLambertMaterial color="#0f172a" />
      </mesh>
      {/* Floating Octahedron Glass Sculpture */}
      <mesh position={[-2.2, 1.15, 0]} rotation={[0.4, 0.3, 0.2]}>
        <octahedronGeometry args={[0.22, 0]} />
        <meshBasicMaterial color="#93c5fd" />
      </mesh>

      {/* Secondary Pedestal + Metallic Ring Sculpture (Right Side) */}
      <mesh position={[2.2, 0.4, 0.6]}>
        <boxGeometry args={[0.35, 0.8, 0.35]} />
        <meshLambertMaterial color="#0f172a" />
      </mesh>
      <mesh position={[2.2, 0.95, 0.6]} rotation={[0.5, 0.2, 0.4]}>
        <torusGeometry args={[0.18, 0.04, 12, 24]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
    </group>

    {/* ════════════════════════════════════════════════════════════════ */}
    {/* 🪙 1b. BRASS ROPE STANCHIONS (Around Center Pedestals Z = 77)     */}
    {/* ════════════════════════════════════════════════════════════════ */}
    {[
      [-3.5, 75], [3.5, 75], [-3.5, 79], [3.5, 79]
    ].map(([sx, sz], i) => (
      <group key={`stanchion-${i}`} position={[sx, 0, sz]}>
        {/* Base */}
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.06, 16]} />
          <meshLambertMaterial color="#b8962e" />
        </mesh>
        {/* Post */}
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.84, 12]} />
          <meshLambertMaterial color="#b8962e" />
        </mesh>
        {/* Sphere Cap */}
        <mesh position={[0, 0.9, 0]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshBasicMaterial color="#bfdbfe" />
        </mesh>
      </group>
    ))}

    {/* ════════════════════════════════════════════════════════════════ */}
    {/* 💎 2. BACK WALL MINIMALIST SCULPTURE FEATURE (At Z = 123)        */}
    {/* ════════════════════════════════════════════════════════════════ */}
    <group position={[0, 0, 122.5]}>
      {/* Center Pedestal */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.4, 0.45, 1.2, 24]} />
        <meshLambertMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0, 1.23, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.05, 24]} />
        <meshLambertMaterial color="#1e293b" />
      </mesh>
      {/* Floating Dual Ring Core Sculpture */}
      <group position={[0, 1.65, 0]}>
        <mesh rotation={[0.3, 0.6, 0]}>
          <torusGeometry args={[0.3, 0.04, 12, 32]} />
          <meshBasicMaterial color="#60a5fa" />
        </mesh>
        <mesh rotation={[-0.4, -0.2, 0.5]}>
          <torusGeometry args={[0.22, 0.03, 12, 32]} />
          <meshBasicMaterial color="#bfdbfe" />
        </mesh>
      </group>

      {/* Flanking Sleek Rectangular Planters */}
      {[-5, 5].map((px, i) => (
        <group key={i} position={[px, 0, 0]}>
          <mesh position={[0, 0.35, 0]}>
            <boxGeometry args={[1.2, 0.7, 0.6]} />
            <meshLambertMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0, 0.85, 0]}>
            <boxGeometry args={[1.0, 0.3, 0.4]} />
            <meshLambertMaterial color="#166534" />
          </mesh>
        </group>
      ))}
    </group>

    {/* 🪙 2b. BRASS ROPE STANCHIONS (Around Back Wall Sculpture Z = 121) */}
    {[-2.2, 2.2].map((sx, i) => (
      <group key={`back-stanchion-${i}`} position={[sx, 0, 121]}>
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
          <meshBasicMaterial color="#bfdbfe" />
        </mesh>
      </group>
    ))}

    {/* ════════════════════════════════════════════════════════════════ */}
    {/* 🏛️ 2c. CEILING CROWN MOLDING STRIPS                              */}
    {/* ════════════════════════════════════════════════════════════════ */}
    {/* Left Ceiling Edge Molding */}
    <mesh position={[-14.8, 9.8, 77]}>
      <boxGeometry args={[0.2, 0.2, 95]} />
      <meshLambertMaterial color="#0f172a" />
    </mesh>
    <mesh position={[-14.7, 9.7, 77]}>
      <boxGeometry args={[0.08, 0.08, 95]} />
      <meshBasicMaterial color="#bfdbfe" />
    </mesh>

    {/* Right Ceiling Edge Molding */}
    <mesh position={[14.8, 9.8, 77]}>
      <boxGeometry args={[0.2, 0.2, 95]} />
      <meshLambertMaterial color="#0f172a" />
    </mesh>
    <mesh position={[14.7, 9.7, 77]}>
      <boxGeometry args={[0.08, 0.08, 95]} />
      <meshBasicMaterial color="#bfdbfe" />
    </mesh>

    {/* ════════════════════════════════════════════════════════════════ */}
    {/* 💡 3. ELEGANT MODERN MUSEUM WALL SCONCES / LAMPS                 */}
    {/* ════════════════════════════════════════════════════════════════ */}
    {[40, 56, 72, 88, 104].map((zPos) => (
      <group key={`wall-sconce-${zPos}`}>
        {/* Left Wall Lamp */}
        <group position={[-14.5, 6.5, zPos]}>
          {/* Wall Mounting Bracket */}
          <mesh position={[0.15, 0, 0]}>
            <boxGeometry args={[0.3, 0.08, 0.08]} />
            <meshLambertMaterial color="#0f172a" />
          </mesh>
          {/* Lamp Cylinder Base */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.45, 16]} />
            <meshLambertMaterial color="#1e293b" />
          </mesh>
          {/* Top Light Diffuser Cap */}
          <mesh position={[0, 0.24, 0]}>
            <cylinderGeometry args={[0.085, 0.085, 0.05, 16]} />
            <meshBasicMaterial color="#bfdbfe" />
          </mesh>
          {/* Bottom Light Diffuser Cap */}
          <mesh position={[0, -0.24, 0]}>
            <cylinderGeometry args={[0.085, 0.085, 0.05, 16]} />
            <meshBasicMaterial color="#bfdbfe" />
          </mesh>
        </group>

        {/* Right Wall Lamp */}
        <group position={[14.5, 6.5, zPos]}>
          {/* Wall Mounting Bracket */}
          <mesh position={[-0.15, 0, 0]}>
            <boxGeometry args={[0.3, 0.08, 0.08]} />
            <meshLambertMaterial color="#0f172a" />
          </mesh>
          {/* Lamp Cylinder Base */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.45, 16]} />
            <meshLambertMaterial color="#1e293b" />
          </mesh>
          {/* Top Light Diffuser Cap */}
          <mesh position={[0, 0.24, 0]}>
            <cylinderGeometry args={[0.085, 0.085, 0.05, 16]} />
            <meshBasicMaterial color="#bfdbfe" />
          </mesh>
          {/* Bottom Light Diffuser Cap */}
          <mesh position={[0, -0.24, 0]}>
            <cylinderGeometry args={[0.085, 0.085, 0.05, 16]} />
            <meshBasicMaterial color="#bfdbfe" />
          </mesh>
        </group>
      </group>
    ))}

    {/* ════════════════════════════════════════════════════════════════ */}
    {/* 🕯️ 4. CEILING PENDANT SPOTLIGHTS                                 */}
    {/* ════════════════════════════════════════════════════════════════ */}
    {[50, 70, 90, 110].map((pz) => (
      <group key={`pendant-light-${pz}`} position={[0, 8.8, pz]}>
        {/* Wire */}
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 1.2, 8]} />
          <meshLambertMaterial color="#334155" />
        </mesh>
        {/* Spot Fixture */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.14, 0.22, 0.35, 16]} />
          <meshLambertMaterial color="#0f172a" />
        </mesh>
        {/* Downward Light Glow Ring */}
        <mesh position={[0, -0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.02, 0.2, 16]} />
          <meshBasicMaterial color="#bfdbfe" />
        </mesh>
      </group>
    ))}

    {/* ════════════════════════════════════════════════════════════════ */}
    {/* 🪑 5. SECONDARY GALLERY BENCH (Near Entrance Z = 48)              */}
    {/* ════════════════════════════════════════════════════════════════ */}
    <group position={[0, 0, 48]}>
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[1.0, 0.44, 2.4]} />
        <meshLambertMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0, 0.46, 0]}>
        <boxGeometry args={[1.1, 0.05, 2.5]} />
        <meshLambertMaterial color="#334155" />
      </mesh>
    </group>

    {/* ════════════════════════════════════════════════════════════════ */}
    {/* ✨ 6. FLOOR ACCENT LIGHT STRIPS — running along the center aisle  */}
    {/* ════════════════════════════════════════════════════════════════ */}
    {[40, 48, 56, 64, 72, 80, 88, 96, 104, 112, 120].map((bz) => (
      <group key={bz}>
        {/* Left floor strip */}
        <mesh position={[-3, 0.008, bz]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[6, 0.12]} />
          <meshBasicMaterial color="#bfdbfe" />
        </mesh>
        {/* Right floor strip */}
        <mesh position={[3, 0.008, bz]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[6, 0.12]} />
          <meshBasicMaterial color="#bfdbfe" />
        </mesh>
      </group>
    ))}
  </group>
);

export default FamilyHallDecoration;






