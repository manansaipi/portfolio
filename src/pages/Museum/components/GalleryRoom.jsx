import React from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const GalleryRoom = () => {
  return (
    <group>
      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 🏛️ 1. LEVEL 1 MAIN LOBBY ARCHITECTURE (Center [0,0,0], 30x30x10) */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <group>
        {/* Level 1 Floor */}
        <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[30, 30]} />
          <meshLambertMaterial color="#dedcd7" side={THREE.DoubleSide} />
        </mesh>

        {/* Base Ceiling Slab */}
        <mesh position={[0, 10, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[30, 30]} />
          <meshLambertMaterial color="#18181b" side={THREE.DoubleSide} />
        </mesh>

        {/* 🌟 Central Grand Skylight Oculus in Main Lobby */}
        <mesh position={[0, 9.95, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0, 4.8, 32]} />
          <meshBasicMaterial color="#e0f2fe" side={THREE.DoubleSide} />
        </mesh>

        {/* Skylight Outer Glowing Frame Ring */}
        <mesh position={[0, 9.92, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[4.8, 5.2, 32]} />
          <meshBasicMaterial color="#38bdf8" side={THREE.DoubleSide} />
        </mesh>

        {/* Coffered Architectural Cross-Beams in Lobby */}
        {[-10, -5, 5, 10].map((pos) => (
          <group key={pos}>
            {/* X-axis Beam */}
            <mesh position={[0, 9.7, pos]}>
              <boxGeometry args={[30, 0.4, 0.6]} />
              <meshLambertMaterial color="#27272a" />
            </mesh>
            {/* X-axis LED Light Strip */}
            <mesh position={[0, 9.49, pos]}>
              <planeGeometry args={[30, 0.12]} />
              <meshBasicMaterial color="#fef08a" side={THREE.DoubleSide} />
            </mesh>

            {/* Z-axis Beam */}
            <mesh position={[pos, 9.7, 0]}>
              <boxGeometry args={[0.6, 0.4, 30]} />
              <meshLambertMaterial color="#27272a" />
            </mesh>
            {/* Z-axis LED Light Strip */}
            <mesh position={[pos, 9.49, 0]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry args={[30, 0.12]} />
              <meshBasicMaterial color="#fef08a" side={THREE.DoubleSide} />
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
        <Text position={[0, 6.2, -14.5]} fontSize={0.55} color="#15803d" anchorX="center">
          🌿 NATURE HALL ➔
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
        <Text position={[0, 6.2, 14.5]} rotation={[0, Math.PI, 0]} fontSize={0.55} color="#3b82f6" anchorX="center">
          👤 PORTRAIT HALL ➔
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
        <Text position={[-14.5, 6.2, 0]} rotation={[0, Math.PI / 2, 0]} fontSize={0.55} color="#eab308" anchorX="center">
          🏙️ STREET HALL ➔
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
        <Text position={[14.5, 6.2, 0]} rotation={[0, -Math.PI / 2, 0]} fontSize={0.55} color="#f97316" anchorX="center">
          ✈️ TRAVEL HALL ➔
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
          <meshLambertMaterial color="#27272a" side={THREE.DoubleSide} />
        </mesh>
        {/* LED Strip */}
        <mesh position={[0, 9.95, -21]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.4, 12]} />
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
          <meshLambertMaterial color="#27272a" side={THREE.DoubleSide} />
        </mesh>
        {/* LED Strip */}
        <mesh position={[0, 9.95, 21]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.4, 12]} />
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
          <meshLambertMaterial color="#27272a" side={THREE.DoubleSide} />
        </mesh>
        {/* LED Strip */}
        <mesh position={[-21, 9.95, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[12, 0.4]} />
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
          <meshLambertMaterial color="#27272a" side={THREE.DoubleSide} />
        </mesh>
        {/* LED Strip */}
        <mesh position={[21, 9.95, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[12, 0.4]} />
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
        <mesh position={[0, -0.01, -52]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[30, 50]} />
          <meshLambertMaterial color="#252e25" side={THREE.DoubleSide} />
        </mesh>

        {/* Nature Hall Architectural Ceiling */}
        <mesh position={[0, 10, -52]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[30, 50]} />
          <meshLambertMaterial color="#141e15" side={THREE.DoubleSide} />
        </mesh>

        {/* Wooden Ceiling Beams & Recessed Lighting in Nature Hall */}
        {[-70, -60, -50, -40, -30].map((bz) => (
          <group key={bz}>
            <mesh position={[0, 9.7, bz]}>
              <boxGeometry args={[30, 0.4, 0.8]} />
              <meshLambertMaterial color="#1c2b1e" />
            </mesh>
            <mesh position={[0, 9.49, bz]}>
              <planeGeometry args={[30, 0.15]} />
              <meshBasicMaterial color="#86efac" side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}

        <mesh position={[-15, 5, -52]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[50, 10, 0.8]} />
          <meshLambertMaterial color="#2d3b2d" />
        </mesh>
        <mesh position={[15, 5, -52]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[50, 10, 0.8]} />
          <meshLambertMaterial color="#2d3b2d" />
        </mesh>
        <mesh position={[0, 5, -77]}>
          <boxGeometry args={[30, 10, 0.8]} />
          <meshLambertMaterial color="#2d3b2d" />
        </mesh>
        <Text position={[0, 8.2, -27.2]} fontSize={0.65} color="#4ade80" anchorX="center">
          NATURE & WILDLIFE EXHIBITION
        </Text>
      </group>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 🏙️ 4. STREET HALL (West Wing)                                    */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <group>
        <mesh position={[-52, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 30]} />
          <meshLambertMaterial color="#1c1c1e" side={THREE.DoubleSide} />
        </mesh>

        {/* Street Hall Architectural Ceiling */}
        <mesh position={[-52, 10, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 30]} />
          <meshLambertMaterial color="#18181b" side={THREE.DoubleSide} />
        </mesh>

        {/* Industrial Beams & Neon Yellow LED Lighting in Street Hall */}
        {[-70, -60, -50, -40, -30].map((bx) => (
          <group key={bx}>
            <mesh position={[bx, 9.7, 0]}>
              <boxGeometry args={[0.8, 0.4, 30]} />
              <meshLambertMaterial color="#27272a" />
            </mesh>
            <mesh position={[bx, 9.49, 0]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry args={[30, 0.15]} />
              <meshBasicMaterial color="#fef08a" side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}

        <mesh position={[-52, 5, -15]}>
          <boxGeometry args={[50, 10, 0.8]} />
          <meshLambertMaterial color="#2b2b2e" />
        </mesh>
        <mesh position={[-52, 5, 15]}>
          <boxGeometry args={[50, 10, 0.8]} />
          <meshLambertMaterial color="#2b2b2e" />
        </mesh>
        <mesh position={[-77, 5, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[30, 10, 0.8]} />
          <meshLambertMaterial color="#2b2b2e" />
        </mesh>
        <Text position={[-27.2, 8.2, 0]} rotation={[0, Math.PI / 2, 0]} fontSize={0.65} color="#facc15" anchorX="center">
          URBAN & STREET PHOTOGRAPHY
        </Text>
      </group>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ✈️ 5. TRAVEL HALL (East Wing)                                    */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <group>
        <mesh position={[52, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 30]} />
          <meshLambertMaterial color="#2b231d" side={THREE.DoubleSide} />
        </mesh>

        {/* Travel Hall Architectural Ceiling */}
        <mesh position={[52, 10, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 30]} />
          <meshLambertMaterial color="#211812" side={THREE.DoubleSide} />
        </mesh>

        {/* Warm Timber Beams & Amber LED Lighting in Travel Hall */}
        {[30, 40, 50, 60, 70].map((bx) => (
          <group key={bx}>
            <mesh position={[bx, 9.7, 0]}>
              <boxGeometry args={[0.8, 0.4, 30]} />
              <meshLambertMaterial color="#3f2d20" />
            </mesh>
            <mesh position={[bx, 9.49, 0]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry args={[30, 0.15]} />
              <meshBasicMaterial color="#fed7aa" side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}

        <mesh position={[52, 5, -15]}>
          <boxGeometry args={[50, 10, 0.8]} />
          <meshLambertMaterial color="#3d3229" />
        </mesh>
        <mesh position={[52, 5, 15]}>
          <boxGeometry args={[50, 10, 0.8]} />
          <meshLambertMaterial color="#3d3229" />
        </mesh>
        <mesh position={[77, 5, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[30, 10, 0.8]} />
          <meshLambertMaterial color="#3d3229" />
        </mesh>
        <Text position={[27.2, 8.2, 0]} rotation={[0, -Math.PI / 2, 0]} fontSize={0.65} color="#fb923c" anchorX="center">
          WORLD TRAVEL & CULTURES
        </Text>
      </group>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 👤 6. PORTRAIT HALL (South Wing)                                 */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <group>
        <mesh position={[0, -0.01, 52]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[30, 50]} />
          <meshLambertMaterial color="#1d222b" side={THREE.DoubleSide} />
        </mesh>

        {/* Portrait Hall Architectural Ceiling */}
        <mesh position={[0, 10, 52]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[30, 50]} />
          <meshLambertMaterial color="#141a24" side={THREE.DoubleSide} />
        </mesh>

        {/* Sleek Blue LED Recessed Beams in Portrait Hall */}
        {[30, 40, 50, 60, 70].map((bz) => (
          <group key={bz}>
            <mesh position={[0, 9.7, bz]}>
              <boxGeometry args={[30, 0.4, 0.8]} />
              <meshLambertMaterial color="#1e293b" />
            </mesh>
            <mesh position={[0, 9.49, bz]}>
              <planeGeometry args={[30, 0.15]} />
              <meshBasicMaterial color="#93c5fd" side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}

        <mesh position={[-15, 5, 52]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[50, 10, 0.8]} />
          <meshLambertMaterial color="#232b38" />
        </mesh>
        <mesh position={[15, 5, 52]} rotation={[0, -Math.PI / 2, 0]}>
          <boxGeometry args={[50, 10, 0.8]} />
          <meshLambertMaterial color="#232b38" />
        </mesh>
        <mesh position={[0, 5, 77]}>
          <boxGeometry args={[30, 10, 0.8]} />
          <meshLambertMaterial color="#232b38" />
        </mesh>
        <Text position={[0, 8.2, 27.2]} rotation={[0, Math.PI, 0]} fontSize={0.65} color="#60a5fa" anchorX="center">
          PORTRAITURE & EDITORIAL ARTS
        </Text>
      </group>
    </group>
  );
};

export default GalleryRoom;
