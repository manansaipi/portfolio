import React from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// Default icons & fallback names per slug
const SLUG_META = {
  nature:   { icon: '🌿', color: '#4ade80', bannerColor: '#4ade80' },
  street:   { icon: '🏙️', color: '#facc15', bannerColor: '#facc15' },
  travel:   { icon: '🌍', color: '#fb923c', bannerColor: '#fb923c' },
  portrait: { icon: '👨\u200d👩\u200d👧', color: '#60a5fa', bannerColor: '#60a5fa' },
};

const GalleryRoom = ({ categories = [] }) => {
  // Build a lookup: slug -> label
  const catLabels = {};
  categories.forEach(c => { catLabels[c.slug] = c.label; });

  const getLabel = (slug, fallback) => catLabels[slug] || fallback;
  const getMeta  = (slug) => SLUG_META[slug] || { icon: '🖼️', color: '#ffffff', bannerColor: '#ffffff' };

  return (
    <group>
      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 🏛️ 1. LEVEL 1 MAIN LOBBY ARCHITECTURE (Center [0,0,0], 30x30x10) */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <group>
        {/* Level 1 Floor (Polished Warm Gray Marble) */}
        <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[30, 30]} />
          <meshLambertMaterial color="#dedcd7" side={THREE.DoubleSide} />
        </mesh>

        {/* 🏛️ Main Lobby Ceiling Slab (Matches Lobby Walls: #e5e2dc) */}
        <mesh position={[0, 10, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[30, 30]} />
          <meshLambertMaterial color="#e5e2dc" side={THREE.DoubleSide} />
        </mesh>

        {/* 🌟 Central Grand Gold & Glass Skylight Dome in Main Lobby */}
        <mesh position={[0, 9.95, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0, 5.2, 32]} />
          <meshBasicMaterial color="#fef08a" side={THREE.DoubleSide} />
        </mesh>

        {/* Skylight Outer Gold Brass Molding Ring */}
        <mesh position={[0, 9.92, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[5.2, 5.8, 32]} />
          <meshBasicMaterial color="#d4af37" side={THREE.DoubleSide} />
        </mesh>

        {/* Warm Perimeter Cove Light Strip around Entire Lobby Ceiling Edge */}
        {[-14.6, 14.6].map((edgePos) => (
          <group key={edgePos}>
            {/* X-Edge Cove Strip */}
            <mesh position={[0, 9.92, edgePos]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[29, 0.6]} />
              <meshBasicMaterial color="#fef3c7" side={THREE.DoubleSide} />
            </mesh>
            {/* Z-Edge Cove Strip */}
            <mesh position={[edgePos, 9.92, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.6, 29]} />
              <meshBasicMaterial color="#fef3c7" side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}

        {/* Luxury Dark Walnut & Gold Coffered Ceiling Grid Beams */}
        {[-10, -5, 5, 10].map((pos) => (
          <group key={pos}>
            {/* X-axis Walnut Beam */}
            <mesh position={[0, 9.75, pos]}>
              <boxGeometry args={[29.2, 0.35, 0.5]} />
              <meshLambertMaterial color="#2d221e" />
            </mesh>
            {/* Gold Brass Trim Line under X-Beam */}
            <mesh position={[0, 9.56, pos]}>
              <planeGeometry args={[29.2, 0.1]} />
              <meshBasicMaterial color="#fbbf24" side={THREE.DoubleSide} />
            </mesh>

            {/* Z-axis Walnut Beam */}
            <mesh position={[pos, 9.75, 0]}>
              <boxGeometry args={[0.5, 0.35, 29.2]} />
              <meshLambertMaterial color="#2d221e" />
            </mesh>
            {/* Gold Brass Trim Line under Z-Beam */}
            <mesh position={[pos, 9.56, 0]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry args={[29.2, 0.1]} />
              <meshBasicMaterial color="#fbbf24" side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}

        {/* North Wall Segments */}
        <mesh position={[-9.5, 5, -15]}>
          <boxGeometry args={[11, 10, 0.8]} />
          <meshLambertMaterial color="#e5e2dc" />
        </mesh>
        <mesh position={[9.5, 5, -15]}>
          <boxGeometry args={[11, 10, 0.8]} />
          <meshLambertMaterial color="#e5e2dc" />
        </mesh>
        <mesh position={[0, 8.5, -15]}>
          <boxGeometry args={[8, 3, 0.8]} />
          <meshLambertMaterial color="#e5e2dc" />
        </mesh>
        <Text position={[0, 6.2, -14.5]} fontSize={0.55} color={getMeta('nature').color} anchorX="center">
          {getMeta('nature').icon} {getLabel('nature', 'NATURE HALL').toUpperCase()} ➔
        </Text>

        {/* South Wall Segments */}
        <mesh position={[-9.5, 5, 15]}>
          <boxGeometry args={[11, 10, 0.8]} />
          <meshLambertMaterial color="#e5e2dc" />
        </mesh>
        <mesh position={[9.5, 5, 15]}>
          <boxGeometry args={[11, 10, 0.8]} />
          <meshLambertMaterial color="#e5e2dc" />
        </mesh>
        <mesh position={[0, 8.5, 15]}>
          <boxGeometry args={[8, 3, 0.8]} />
          <meshLambertMaterial color="#e5e2dc" />
        </mesh>
        <Text position={[0, 6.2, 14.5]} rotation={[0, Math.PI, 0]} fontSize={0.55} color={getMeta('portrait').color} anchorX="center">
          {getMeta('portrait').icon} {getLabel('portrait', 'FAMILY HALL').toUpperCase()} ➔
        </Text>

        {/* West Wall Segments */}
        <mesh position={[-15, 5, -9.5]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[11, 10, 0.8]} />
          <meshLambertMaterial color="#e5e2dc" />
        </mesh>
        <mesh position={[-15, 5, 9.5]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[11, 10, 0.8]} />
          <meshLambertMaterial color="#e5e2dc" />
        </mesh>
        <mesh position={[-15, 8.5, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[8, 3, 0.8]} />
          <meshLambertMaterial color="#e5e2dc" />
        </mesh>
        <Text position={[-14.5, 6.2, 0]} rotation={[0, Math.PI / 2, 0]} fontSize={0.55} color={getMeta('street').color} anchorX="center">
          {getMeta('street').icon} {getLabel('street', 'PROFESSIONAL HALL').toUpperCase()} ➔
        </Text>

        {/* East Wall Segments */}
        <mesh position={[15, 5, -9.5]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[11, 10, 0.8]} />
          <meshLambertMaterial color="#e5e2dc" />
        </mesh>
        <mesh position={[15, 5, 9.5]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[11, 10, 0.8]} />
          <meshLambertMaterial color="#e5e2dc" />
        </mesh>
        <mesh position={[15, 8.5, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[8, 3, 0.8]} />
          <meshLambertMaterial color="#e5e2dc" />
        </mesh>
        <Text position={[14.5, 6.2, 0]} rotation={[0, -Math.PI / 2, 0]} fontSize={0.55} color={getMeta('travel').color} anchorX="center">
          {getMeta('travel').icon} {getLabel('travel', 'ADVENTURE HALL').toUpperCase()} ➔
        </Text>
      </group>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 🚪 2. LEVEL 1 CORRIDORS                                          */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {/* North Corridor */}
      <group>
        <mesh position={[0, -0.01, -21]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[8, 12]} />
          <meshLambertMaterial color="#ccc9c2" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 10, -21]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[8, 12]} />
          <meshLambertMaterial color="#dcd8d0" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 9.95, -21]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.6, 12]} />
          <meshBasicMaterial color="#fef08a" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[-4, 5, -21]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[12, 10, 0.8]} />
          <meshLambertMaterial color="#dcd8d0" />
        </mesh>
        <mesh position={[4, 5, -21]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[12, 10, 0.8]} />
          <meshLambertMaterial color="#dcd8d0" />
        </mesh>
      </group>

      {/* South Corridor */}
      <group>
        <mesh position={[0, -0.01, 21]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[8, 12]} />
          <meshLambertMaterial color="#ccc9c2" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 10, 21]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[8, 12]} />
          <meshLambertMaterial color="#dcd8d0" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 9.95, 21]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.6, 12]} />
          <meshBasicMaterial color="#fef08a" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[-4, 5, 21]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[12, 10, 0.8]} />
          <meshLambertMaterial color="#dcd8d0" />
        </mesh>
        <mesh position={[4, 5, 21]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[12, 10, 0.8]} />
          <meshLambertMaterial color="#dcd8d0" />
        </mesh>
      </group>

      {/* West Corridor */}
      <group>
        <mesh position={[-21, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[12, 8]} />
          <meshLambertMaterial color="#ccc9c2" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[-21, 10, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[12, 8]} />
          <meshLambertMaterial color="#dcd8d0" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[-21, 9.95, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[12, 0.6]} />
          <meshBasicMaterial color="#fef08a" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[-21, 5, -4]}>
          <boxGeometry args={[12, 10, 0.8]} />
          <meshLambertMaterial color="#dcd8d0" />
        </mesh>
        <mesh position={[-21, 5, 4]}>
          <boxGeometry args={[12, 10, 0.8]} />
          <meshLambertMaterial color="#dcd8d0" />
        </mesh>
      </group>

      {/* East Corridor */}
      <group>
        <mesh position={[21, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[12, 8]} />
          <meshLambertMaterial color="#ccc9c2" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[21, 10, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[12, 8]} />
          <meshLambertMaterial color="#dcd8d0" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[21, 9.95, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[12, 0.6]} />
          <meshBasicMaterial color="#fef08a" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[21, 5, -4]}>
          <boxGeometry args={[12, 10, 0.8]} />
          <meshLambertMaterial color="#dcd8d0" />
        </mesh>
        <mesh position={[21, 5, 4]}>
          <boxGeometry args={[12, 10, 0.8]} />
          <meshLambertMaterial color="#dcd8d0" />
        </mesh>
      </group>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 🌿 3. NATURE HALL (North Wing)                                   */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <group>
        {/* Floor */}
        <mesh position={[0, -0.01, -77]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[30, 100]} />
          <meshLambertMaterial color="#252e25" side={THREE.DoubleSide} />
        </mesh>

        {/* Ceiling */}
        <mesh position={[0, 10, -77]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[30, 100]} />
          <meshLambertMaterial color="#2d3b2d" side={THREE.DoubleSide} />
        </mesh>

        {/* Beams */}
        {[-120, -110, -100, -90, -80, -70, -60, -50, -40, -30].map((bz) => (
          <group key={bz}>
            <mesh position={[0, 9.75, bz]}>
              <boxGeometry args={[29.2, 0.35, 0.6]} />
              <meshLambertMaterial color="#1e2b1f" />
            </mesh>
            <mesh position={[0, 9.56, bz]}>
              <planeGeometry args={[29.2, 0.12]} />
              <meshBasicMaterial color="#86efac" side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}

        {/* Outer Side Walls */}
        <mesh position={[-15, 5, -77]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[100, 10, 0.8]} />
          <meshLambertMaterial color="#e8f5e9" />
        </mesh>
        <mesh position={[15, 5, -77]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[100, 10, 0.8]} />
          <meshLambertMaterial color="#e8f5e9" />
        </mesh>

        {/* Back Wall */}
        <mesh position={[0, 5, -127]}>
          <boxGeometry args={[30, 10, 0.8]} />
          <meshLambertMaterial color="#e8f5e9" />
        </mesh>

        {/* 🧱 Front Entrance Walls of Nature Hall at Z = -27 (Encloses left & right when looking back!) */}
        <mesh position={[-9.5, 5, -27]}>
          <boxGeometry args={[11, 10, 0.8]} />
          <meshLambertMaterial color="#e8f5e9" />
        </mesh>
        <mesh position={[9.5, 5, -27]}>
          <boxGeometry args={[11, 10, 0.8]} />
          <meshLambertMaterial color="#e8f5e9" />
        </mesh>
        <mesh position={[0, 8.5, -27]}>
          <boxGeometry args={[8, 3, 0.8]} />
          <meshLambertMaterial color="#e8f5e9" />
        </mesh>

        <Text position={[0, 8.2, -27.2]} fontSize={0.65} color={getMeta('nature').bannerColor} anchorX="center">
          {getMeta('nature').icon}  {getLabel('nature', 'NATURE HALL').toUpperCase()}
        </Text>
      </group>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 🏙️ 4. STREET HALL (West Wing)                                    */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <group>
        {/* Floor */}
        <mesh position={[-77, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[100, 30]} />
          <meshLambertMaterial color="#1c1c1e" side={THREE.DoubleSide} />
        </mesh>

        {/* Ceiling */}
        <mesh position={[-77, 10, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[100, 30]} />
          <meshLambertMaterial color="#2b2b2e" side={THREE.DoubleSide} />
        </mesh>

        {/* Beams */}
        {[-120, -110, -100, -90, -80, -70, -60, -50, -40, -30].map((bx) => (
          <group key={bx}>
            <mesh position={[bx, 9.75, 0]}>
              <boxGeometry args={[0.6, 0.35, 29.2]} />
              <meshLambertMaterial color="#1c1c1e" />
            </mesh>
            <mesh position={[bx, 9.56, 0]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry args={[29.2, 0.12]} />
              <meshBasicMaterial color="#fde047" side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}

        {/* Outer Side Walls */}
        <mesh position={[-77, 5, -15]}>
          <boxGeometry args={[100, 10, 0.8]} />
          <meshLambertMaterial color="#2b2b2e" />
        </mesh>
        <mesh position={[-77, 5, 15]}>
          <boxGeometry args={[100, 10, 0.8]} />
          <meshLambertMaterial color="#2b2b2e" />
        </mesh>

        {/* Back Wall */}
        <mesh position={[-127, 5, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[30, 10, 0.8]} />
          <meshLambertMaterial color="#2b2b2e" />
        </mesh>

        {/* 🧱 Front Entrance Walls of Street Hall at X = -27 (Encloses top & bottom when looking back!) */}
        <mesh position={[-27, 5, -9.5]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[11, 10, 0.8]} />
          <meshLambertMaterial color="#2b2b2e" />
        </mesh>
        <mesh position={[-27, 5, 9.5]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[11, 10, 0.8]} />
          <meshLambertMaterial color="#2b2b2e" />
        </mesh>
        <mesh position={[-27, 8.5, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[8, 3, 0.8]} />
          <meshLambertMaterial color="#2b2b2e" />
        </mesh>

        <Text position={[-27.2, 8.2, 0]} rotation={[0, Math.PI / 2, 0]} fontSize={0.65} color={getMeta('street').bannerColor} anchorX="center">
          {getMeta('street').icon}  {getLabel('street', 'PROFESSIONAL HALL').toUpperCase()}
        </Text>
      </group>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ✈️ 5. TRAVEL HALL (East Wing)                                    */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <group>
        {/* Floor */}
        <mesh position={[77, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[100, 30]} />
          <meshLambertMaterial color="#2b231d" side={THREE.DoubleSide} />
        </mesh>

        {/* Ceiling */}
        <mesh position={[77, 10, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[100, 30]} />
          <meshLambertMaterial color="#3d3229" side={THREE.DoubleSide} />
        </mesh>

        {/* Beams */}
        {[30, 40, 50, 60, 70, 80, 90, 100, 110, 120].map((bx) => (
          <group key={bx}>
            <mesh position={[bx, 9.75, 0]}>
              <boxGeometry args={[0.6, 0.35, 29.2]} />
              <meshLambertMaterial color="#281f18" />
            </mesh>
            <mesh position={[bx, 9.56, 0]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry args={[29.2, 0.12]} />
              <meshBasicMaterial color="#fed7aa" side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}

        {/* Outer Side Walls */}
        <mesh position={[77, 5, -15]}>
          <boxGeometry args={[100, 10, 0.8]} />
          <meshLambertMaterial color="#3d3229" />
        </mesh>
        <mesh position={[77, 5, 15]}>
          <boxGeometry args={[100, 10, 0.8]} />
          <meshLambertMaterial color="#3d3229" />
        </mesh>

        {/* Back Wall */}
        <mesh position={[127, 5, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[30, 10, 0.8]} />
          <meshLambertMaterial color="#3d3229" />
        </mesh>

        {/* 🧱 Front Entrance Walls of Travel Hall at X = 27 (Encloses top & bottom when looking back!) */}
        <mesh position={[27, 5, -9.5]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[11, 10, 0.8]} />
          <meshLambertMaterial color="#3d3229" />
        </mesh>
        <mesh position={[27, 5, 9.5]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[11, 10, 0.8]} />
          <meshLambertMaterial color="#3d3229" />
        </mesh>
        <mesh position={[27, 8.5, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[8, 3, 0.8]} />
          <meshLambertMaterial color="#3d3229" />
        </mesh>

        <Text position={[27.2, 8.2, 0]} rotation={[0, -Math.PI / 2, 0]} fontSize={0.65} color={getMeta('travel').bannerColor} anchorX="center">
          {getMeta('travel').icon}  {getLabel('travel', 'ADVENTURE HALL').toUpperCase()}
        </Text>
      </group>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 👤 6. PORTRAIT HALL (South Wing)                                 */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <group>
        {/* Floor */}
        <mesh position={[0, -0.01, 77]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[30, 100]} />
          <meshLambertMaterial color="#1d222b" side={THREE.DoubleSide} />
        </mesh>

        {/* Ceiling */}
        <mesh position={[0, 10, 77]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[30, 100]} />
          <meshLambertMaterial color="#232b38" side={THREE.DoubleSide} />
        </mesh>

        {/* Beams */}
        {[30, 40, 50, 60, 70, 80, 90, 100, 110, 120].map((bz) => (
          <group key={bz}>
            <mesh position={[0, 9.75, bz]}>
              <boxGeometry args={[29.2, 0.35, 0.6]} />
              <meshLambertMaterial color="#141a24" />
            </mesh>
            <mesh position={[0, 9.56, bz]}>
              <planeGeometry args={[29.2, 0.12]} />
              <meshBasicMaterial color="#bfdbfe" side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}

        {/* Outer Side Walls */}
        <mesh position={[-15, 5, 77]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[100, 10, 0.8]} />
          <meshLambertMaterial color="#e3f2fd" />
        </mesh>
        <mesh position={[15, 5, 77]} rotation={[0, -Math.PI / 2, 0]}>
          <boxGeometry args={[100, 10, 0.8]} />
          <meshLambertMaterial color="#e3f2fd" />
        </mesh>

        {/* Back Wall */}
        <mesh position={[0, 5, 127]}>
          <boxGeometry args={[30, 10, 0.8]} />
          <meshLambertMaterial color="#e3f2fd" />
        </mesh>

        {/* 🧱 Front Entrance Walls of Portrait Hall at Z = 27 (Encloses left & right when looking back!) */}
        <mesh position={[-9.5, 5, 27]}>
          <boxGeometry args={[11, 10, 0.8]} />
          <meshLambertMaterial color="#e3f2fd" />
        </mesh>
        <mesh position={[9.5, 5, 27]}>
          <boxGeometry args={[11, 10, 0.8]} />
          <meshLambertMaterial color="#e3f2fd" />
        </mesh>
        <mesh position={[0, 8.5, 27]}>
          <boxGeometry args={[8, 3, 0.8]} />
          <meshLambertMaterial color="#e3f2fd" />
        </mesh>

        <Text position={[0, 8.2, 27.2]} rotation={[0, Math.PI, 0]} fontSize={0.65} color={getMeta('portrait').bannerColor} anchorX="center">
          {getMeta('portrait').icon}  {getLabel('portrait', 'FAMILY HALL').toUpperCase()}
        </Text>
      </group>
    </group>
  );
};

export default GalleryRoom;
