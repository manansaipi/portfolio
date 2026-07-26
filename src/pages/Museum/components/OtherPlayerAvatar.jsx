import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// Eye-height constant matching Player.jsx NORMAL_HEIGHT
const EYE_HEIGHT = 3.8;

const OtherPlayerAvatar = ({ player, playersRef }) => {
  const { camera } = useThree();
  const groupRef = useRef();
  const nameTagGroupRef = useRef();
  const bodyGroupRef = useRef();
  const [activeSpeech, setActiveSpeech] = useState('');

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // 1. Read latest target coordinates from the non-reactive high-performance Ref dictionary
    const playerData = playersRef.current[player.id];
    if (playerData) {
      const [tx, ty, tz] = playerData.targetPosition || [0, EYE_HEIGHT, 0];
      // Offset Y down from camera eye-level to ground level (feet on floor)
      const groundY = ty - EYE_HEIGHT;
      const targetVec = new THREE.Vector3(tx, groundY, tz);
      
      // Smoothly lerp position towards target at 12x delta speed (~60/120 FPS butter-smooth motion)
      groupRef.current.position.lerp(targetVec, Math.min(delta * 12, 1));

      // Use Quaternions for robust shortest-path rotation interpolation without drift
      if (bodyGroupRef.current) {
        // cleanYaw is computed relative to +Z axis, matching our mesh front face directly
        const cleanYaw = (playerData.targetRotation && playerData.targetRotation[1]) || 0;
        
        const targetEuler = new THREE.Euler(0, cleanYaw, 0);
        const targetQuaternion = new THREE.Quaternion().setFromEuler(targetEuler);
        
        bodyGroupRef.current.quaternion.slerp(targetQuaternion, Math.min(delta * 12, 1));
      }

      // Check active speech text
      if (playerData.speechText && Date.now() < playerData.speechEndTime) {
        if (activeSpeech !== playerData.speechText) {
          setActiveSpeech(playerData.speechText);
        }
      } else if (activeSpeech) {
        setActiveSpeech('');
      }
    }

    // 2. Make the floating name tag and speech bubble billboard (always face the player camera)
    if (nameTagGroupRef.current) {
      nameTagGroupRef.current.lookAt(camera.position);
    }
  });

  const avatarColor = player.color || "#38bdf8";
  const isAdmin = player.isAdmin || false;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* ── Floating Name Tag & Speech Bubble Billboard Group (above scaled head) ── */}
      <group ref={nameTagGroupRef} position={[0, 2.9, 0]}>
        {/* Admin Crown / Badge */}
        {isAdmin && (
          <Text
            position={[0, 0.28, 0]}
            fontSize={0.18}
            anchorX="center"
            anchorY="middle"
          >
            👑
          </Text>
        )}

        {/* Visitor Nickname Badge */}
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[1.8, 0.34]} />
          <meshBasicMaterial color={isAdmin ? "#1a0f00" : "#0f172a"} transparent opacity={0.88} />
        </mesh>
        <mesh position={[0, 0, -0.012]}>
          <planeGeometry args={[1.84, 0.38]} />
          <meshBasicMaterial color={avatarColor} transparent opacity={0.6} />
        </mesh>
        <Text
          position={[0, 0, 0]}
          fontSize={0.14}
          color="#ffffff"
          fontWeight={700}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          {player.name}
        </Text>

        {/* 3D Speech Bubble (Appears when player talks in chat!) */}
        {activeSpeech && (
          <group position={[0, 0.55, 0]}>
            <mesh position={[0, 0, -0.01]}>
              <planeGeometry args={[2.8, 0.65]} />
              <meshBasicMaterial color="#18181b" transparent opacity={0.92} />
            </mesh>
            <mesh position={[0, 0, -0.012]}>
              <planeGeometry args={[2.84, 0.69]} />
              <meshBasicMaterial color={avatarColor} transparent opacity={0.8} />
            </mesh>
            <Text
              position={[0, 0, 0]}
              fontSize={0.12}
              color="#ffffff"
              maxWidth={2.6}
              textAlign="center"
              anchorX="center"
              anchorY="middle"
              lineHeight={1.3}
            >
              {activeSpeech}
            </Text>
          </group>
        )}
      </group>

      {/* ── Human-Proportioned 3D Character Body (rotates with camera yaw, scaled to match bot NPC) ── */}
      <group ref={bodyGroupRef} scale={[1.3, 1.3, 1.3]}>
        {isAdmin ? (
          /* ══════ ADMIN: Premium Gold & Black Character ══════ */
          <group>
            {/* Head */}
            <mesh position={[0, 1.72, 0]}>
              <sphereGeometry args={[0.18, 16, 16]} />
              <meshLambertMaterial color="#f5d0a9" />
            </mesh>
            {/* Hair */}
            <mesh position={[0, 1.88, -0.04]}>
              <sphereGeometry args={[0.16, 12, 12]} />
              <meshLambertMaterial color="#1a1a2e" />
            </mesh>
            {/* Sunglasses Visor */}
            <mesh position={[0, 1.74, 0.14]}>
              <boxGeometry args={[0.22, 0.07, 0.08]} />
              <meshBasicMaterial color="#0f0f0f" />
            </mesh>
            {/* Accent Earring */}
            <mesh position={[0.19, 1.70, 0]}>
              <sphereGeometry args={[0.025, 8, 8]} />
              <meshBasicMaterial color={avatarColor} />
            </mesh>

            {/* Neck */}
            <mesh position={[0, 1.52, 0]}>
              <cylinderGeometry args={[0.07, 0.08, 0.1, 8]} />
              <meshLambertMaterial color="#f5d0a9" />
            </mesh>

            {/* Torso — Premium Blazer */}
            <mesh position={[0, 1.22, 0]}>
              <boxGeometry args={[0.52, 0.55, 0.28]} />
              <meshLambertMaterial color="#111111" />
            </mesh>
            {/* Blazer Lapel / Accent Trim */}
            <mesh position={[0, 1.38, 0.14]}>
              <boxGeometry args={[0.15, 0.12, 0.02]} />
              <meshBasicMaterial color={avatarColor} />
            </mesh>
            {/* Accent Pocket Square */}
            <mesh position={[-0.15, 1.35, 0.15]}>
              <boxGeometry args={[0.06, 0.06, 0.01]} />
              <meshBasicMaterial color={avatarColor} />
            </mesh>

            {/* Belt */}
            <mesh position={[0, 0.93, 0]}>
              <boxGeometry args={[0.5, 0.07, 0.26]} />
              <meshLambertMaterial color="#1a1a1a" />
            </mesh>
            {/* Belt Buckle */}
            <mesh position={[0, 0.93, 0.14]}>
              <boxGeometry args={[0.08, 0.06, 0.02]} />
              <meshBasicMaterial color={avatarColor} />
            </mesh>

            {/* Left Arm Upper */}
            <mesh position={[-0.35, 1.30, 0]}>
              <boxGeometry args={[0.14, 0.35, 0.16]} />
              <meshLambertMaterial color="#111111" />
            </mesh>
            {/* Left Hand */}
            <mesh position={[-0.35, 1.08, 0]}>
              <boxGeometry args={[0.12, 0.14, 0.14]} />
              <meshLambertMaterial color="#f5d0a9" />
            </mesh>
            {/* Right Arm Upper */}
            <mesh position={[0.35, 1.30, 0]}>
              <boxGeometry args={[0.14, 0.35, 0.16]} />
              <meshLambertMaterial color="#111111" />
            </mesh>
            {/* Right Hand */}
            <mesh position={[0.35, 1.08, 0]}>
              <boxGeometry args={[0.12, 0.14, 0.14]} />
              <meshLambertMaterial color="#f5d0a9" />
            </mesh>

            {/* Left Leg */}
            <mesh position={[-0.12, 0.52, 0]}>
              <boxGeometry args={[0.18, 0.75, 0.2]} />
              <meshLambertMaterial color="#1a1a2e" />
            </mesh>
            {/* Right Leg */}
            <mesh position={[0.12, 0.52, 0]}>
              <boxGeometry args={[0.18, 0.75, 0.2]} />
              <meshLambertMaterial color="#1a1a2e" />
            </mesh>

            {/* Left Shoe */}
            <mesh position={[-0.12, 0.08, 0.04]}>
              <boxGeometry args={[0.18, 0.16, 0.28]} />
              <meshLambertMaterial color="#0a0a0a" />
            </mesh>
            {/* Right Shoe */}
            <mesh position={[0.12, 0.08, 0.04]}>
              <boxGeometry args={[0.18, 0.16, 0.28]} />
              <meshLambertMaterial color="#0a0a0a" />
            </mesh>
          </group>
        ) : (
          /* ══════ REGULAR VISITOR: Cyber-Neon Character ══════ */
          <group>
            {/* Head */}
            <mesh position={[0, 1.72, 0]}>
              <sphereGeometry args={[0.18, 16, 16]} />
              <meshLambertMaterial color="#f8fafc" />
            </mesh>
            {/* Neon Visor Eyes (makes rotation visible — positioned on the FRONT face) */}
            <mesh position={[0, 1.74, 0.14]}>
              <boxGeometry args={[0.22, 0.07, 0.08]} />
              <meshBasicMaterial color={avatarColor} />
            </mesh>

            {/* Neck */}
            <mesh position={[0, 1.52, 0]}>
              <cylinderGeometry args={[0.07, 0.08, 0.1, 8]} />
              <meshLambertMaterial color="#f8fafc" />
            </mesh>

            {/* Torso (Neon Theme Color) */}
            <mesh position={[0, 1.22, 0]}>
              <boxGeometry args={[0.48, 0.55, 0.26]} />
              <meshLambertMaterial color={avatarColor} />
            </mesh>
            {/* Chest Energy Core / Badge */}
            <mesh position={[0, 1.30, 0.14]}>
              <sphereGeometry args={[0.05, 10, 10]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>

            {/* Belt */}
            <mesh position={[0, 0.93, 0]}>
              <boxGeometry args={[0.46, 0.07, 0.24]} />
              <meshLambertMaterial color="#1e293b" />
            </mesh>

            {/* Left Arm Upper */}
            <mesh position={[-0.33, 1.30, 0]}>
              <boxGeometry args={[0.14, 0.35, 0.15]} />
              <meshLambertMaterial color={avatarColor} />
            </mesh>
            {/* Left Hand */}
            <mesh position={[-0.33, 1.08, 0]}>
              <boxGeometry args={[0.12, 0.14, 0.13]} />
              <meshLambertMaterial color="#f8fafc" />
            </mesh>
            {/* Right Arm Upper */}
            <mesh position={[0.33, 1.30, 0]}>
              <boxGeometry args={[0.14, 0.35, 0.15]} />
              <meshLambertMaterial color={avatarColor} />
            </mesh>
            {/* Right Hand */}
            <mesh position={[0.33, 1.08, 0]}>
              <boxGeometry args={[0.12, 0.14, 0.13]} />
              <meshLambertMaterial color="#f8fafc" />
            </mesh>

            {/* Left Leg */}
            <mesh position={[-0.12, 0.52, 0]}>
              <boxGeometry args={[0.17, 0.75, 0.19]} />
              <meshLambertMaterial color="#334155" />
            </mesh>
            {/* Right Leg */}
            <mesh position={[0.12, 0.52, 0]}>
              <boxGeometry args={[0.17, 0.75, 0.19]} />
              <meshLambertMaterial color="#334155" />
            </mesh>

            {/* Left Shoe */}
            <mesh position={[-0.12, 0.08, 0.04]}>
              <boxGeometry args={[0.17, 0.16, 0.26]} />
              <meshLambertMaterial color="#1e293b" />
            </mesh>
            {/* Right Shoe */}
            <mesh position={[0.12, 0.08, 0.04]}>
              <boxGeometry args={[0.17, 0.16, 0.26]} />
              <meshLambertMaterial color="#1e293b" />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
};

export default OtherPlayerAvatar;
