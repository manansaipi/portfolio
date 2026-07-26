import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const EYE_HEIGHT = 3.8;

const LocalPlayerEmoteAvatar = ({ activeEmote, visitorName = "You", visitorColor = "#38bdf8", isAdmin = false }) => {
  const { camera } = useThree();
  const groupRef = useRef();
  const bodyGroupRef = useRef();
  const headRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();

  // Snapshot standing position and camera orientation exactly on mount
  const snapshot = useMemo(() => {
    const initialEyePos = camera.position.clone();
    const initialYaw = camera.rotation.y;
    const initialPitch = camera.rotation.x;
    const groundPos = new THREE.Vector3(initialEyePos.x, initialEyePos.y - EYE_HEIGHT, initialEyePos.z);
    
    // Calculate exact 3D forward vector of the camera
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    forward.y = 0; // Flatten to XZ plane
    if (forward.lengthSq() > 0) forward.normalize();
    else forward.set(0, 0, -1);

    // Compute cleanYaw matching our mesh's front face (+Z axis) so character faces the exact direction player was looking!
    const cleanYaw = Math.atan2(forward.x, forward.z);
    
    // Cinematic 3rd-Person Camera: Place camera BEHIND character (-5.2 units along forward vector), zoomed out and moved up higher (+4.2 units)
    const cameraTargetPos = groundPos.clone().add(forward.clone().multiplyScalar(-5.2)).add(new THREE.Vector3(0, 4.2, 0));
    const lookAtTarget = groundPos.clone().add(new THREE.Vector3(0, 2.0, 0)); // Look at body center

    return {
      initialEyePos,
      initialYaw,
      initialPitch,
      groundPos,
      cameraTargetPos,
      lookAtTarget,
      avatarRotationY: cleanYaw,
    };
  }, []);

  // Restore exact 1st person camera position and rotation when emote finishes / unmounts
  useEffect(() => {
    return () => {
      camera.position.copy(snapshot.initialEyePos);
      camera.rotation.set(snapshot.initialPitch, snapshot.initialYaw, 0, 'YXZ');
    };
  }, [camera, snapshot]);

  useFrame((state, delta) => {
    // 1. Smoothly transition camera to cinematic 3rd-person behind-the-back view
    camera.position.lerp(snapshot.cameraTargetPos, Math.min(delta * 8, 1));
    
    const tempCam = camera.clone();
    tempCam.lookAt(snapshot.lookAtTarget);
    camera.quaternion.slerp(tempCam.quaternion, Math.min(delta * 8, 1));

    // 2. Animate 3D Character Limbs & Body
    const time = state.clock.elapsedTime;
    if (activeEmote === 'wave') {
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -Math.PI / 1.1, Math.min(delta * 12, 1));
        rightArmRef.current.rotation.z = Math.sin(time * 10) * 0.45;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, Math.min(delta * 12, 1));
        leftArmRef.current.rotation.z = 0;
      }
      if (bodyGroupRef.current) bodyGroupRef.current.position.y = THREE.MathUtils.lerp(bodyGroupRef.current.position.y, 0, Math.min(delta * 12, 1));
    } else if (activeEmote === 'dance') {
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -Math.PI / 1.2 + Math.sin(time * 8) * 0.4;
        leftArmRef.current.rotation.z = -0.2;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -Math.PI / 1.2 - Math.sin(time * 8) * 0.4;
        rightArmRef.current.rotation.z = 0.2;
      }
      if (leftLegRef.current) leftLegRef.current.rotation.x = Math.sin(time * 8) * 0.2;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -Math.sin(time * 8) * 0.2;
      if (bodyGroupRef.current) {
        bodyGroupRef.current.position.y = Math.abs(Math.sin(time * 8)) * 0.15;
        bodyGroupRef.current.rotation.y += delta * 6.0;
      }
    } else if (activeEmote === 'cheer') {
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, -Math.PI / 1.1, Math.min(delta * 12, 1));
        leftArmRef.current.rotation.z = -0.3 + Math.sin(time * 12) * 0.1;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -Math.PI / 1.1, Math.min(delta * 12, 1));
        rightArmRef.current.rotation.z = 0.3 - Math.sin(time * 12) * 0.1;
      }
      if (headRef.current) headRef.current.rotation.x = Math.sin(time * 12) * 0.35;
      if (bodyGroupRef.current) bodyGroupRef.current.position.y = Math.abs(Math.sin(time * 10)) * 0.1;
    } else if (activeEmote === 'clap') {
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, -Math.PI / 2.1, Math.min(delta * 12, 1));
        leftArmRef.current.rotation.z = -0.15 + Math.sin(time * 16) * 0.15;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -Math.PI / 2.1, Math.min(delta * 12, 1));
        rightArmRef.current.rotation.z = 0.15 - Math.sin(time * 16) * 0.15;
      }
      if (headRef.current) headRef.current.rotation.x = Math.sin(time * 8) * 0.15;
      if (bodyGroupRef.current) bodyGroupRef.current.position.y = Math.abs(Math.sin(time * 16)) * 0.08;
    }
  });

  const adminGoldAccent = "#f59e0b";
  const avatarColor = visitorColor || "#38bdf8";

  return (
    <group ref={groupRef} position={snapshot.groundPos} rotation={[0, snapshot.avatarRotationY, 0]}>
      {/* ── Floating Name Tag & Emote Badge (above head) ── */}
      <group position={[0, 4.45, 0]}>
        {isAdmin && (
          <Text position={[0, 0.28, 0]} fontSize={0.18} anchorX="center" anchorY="middle">
            👑
          </Text>
        )}
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[1.8, 0.34]} />
          <meshBasicMaterial color={isAdmin ? "#1a0f00" : "#0f172a"} transparent opacity={0.88} />
        </mesh>
        <mesh position={[0, 0, -0.012]}>
          <planeGeometry args={[1.84, 0.38]} />
          <meshBasicMaterial color={isAdmin ? adminGoldAccent : avatarColor} transparent opacity={0.6} />
        </mesh>
        <Text position={[0, 0, 0]} fontSize={0.14} color="#ffffff" fontWeight={700} anchorX="center" anchorY="middle">
          {visitorName} (You)
        </Text>

        <group position={[0, isAdmin ? 0.62 : 0.32, 0]}>
          <mesh position={[0, 0, -0.01]}>
            <circleGeometry args={[0.2, 16]} />
            <meshBasicMaterial color="#0f172a" transparent opacity={0.88} />
          </mesh>
          <mesh position={[0, 0, -0.012]}>
            <circleGeometry args={[0.23, 16]} />
            <meshBasicMaterial color={avatarColor} transparent opacity={0.8} />
          </mesh>
          <Text position={[0, 0, 0]} fontSize={0.24} anchorX="center" anchorY="middle">
            {activeEmote === 'wave' ? '👋' : activeEmote === 'dance' ? '💃' : activeEmote === 'cheer' ? '🎉' : '👏'}
          </Text>
        </group>
      </group>

      {/* ── Human-Proportioned 3D Character Body (Exactly identical to OtherPlayerAvatar) ── */}
      <group ref={bodyGroupRef} scale={[2.15, 2.15, 2.15]}>
        {isAdmin ? (
          /* ══════ ADMIN: Premium Gold & Black Character ══════ */
          <group>
            {/* Head Group (pivoting at neck Y=1.58) */}
            <group ref={headRef} position={[0, 1.58, 0]}>
              <mesh position={[0, 0.14, 0]}>
                <sphereGeometry args={[0.18, 16, 16]} />
                <meshLambertMaterial color="#f5d0a9" />
              </mesh>
              <mesh position={[0, 0.30, -0.04]}>
                <sphereGeometry args={[0.16, 12, 12]} />
                <meshLambertMaterial color="#1a1a2e" />
              </mesh>
              <mesh position={[0, 0.16, 0.14]}>
                <boxGeometry args={[0.22, 0.07, 0.08]} />
                <meshBasicMaterial color="#0f0f0f" />
              </mesh>
              <mesh position={[0.19, 0.12, 0]}>
                <sphereGeometry args={[0.025, 8, 8]} />
                <meshBasicMaterial color={adminGoldAccent} />
              </mesh>
            </group>

            {/* Neck */}
            <mesh position={[0, 1.52, 0]}>
              <cylinderGeometry args={[0.07, 0.08, 0.1, 8]} />
              <meshLambertMaterial color="#f5d0a9" />
            </mesh>

            {/* Torso — Premium Blazer (Black with Gold trim) */}
            <mesh position={[0, 1.22, 0]}>
              <boxGeometry args={[0.52, 0.55, 0.28]} />
              <meshLambertMaterial color="#111111" />
            </mesh>
            <mesh position={[0, 1.38, 0.14]}>
              <boxGeometry args={[0.15, 0.12, 0.02]} />
              <meshBasicMaterial color={adminGoldAccent} />
            </mesh>
            <mesh position={[-0.15, 1.35, 0.15]}>
              <boxGeometry args={[0.06, 0.06, 0.01]} />
              <meshBasicMaterial color={adminGoldAccent} />
            </mesh>

            {/* Belt */}
            <mesh position={[0, 0.93, 0]}>
              <boxGeometry args={[0.5, 0.07, 0.26]} />
              <meshLambertMaterial color="#1a1a1a" />
            </mesh>
            <mesh position={[0, 0.93, 0.14]}>
              <boxGeometry args={[0.08, 0.06, 0.02]} />
              <meshBasicMaterial color={adminGoldAccent} />
            </mesh>

            {/* Left Arm Group (pivoting at shoulder Y=1.45) */}
            <group ref={leftArmRef} position={[-0.34, 1.45, 0]}>
              <mesh position={[0, -0.15, 0]}>
                <boxGeometry args={[0.14, 0.35, 0.15]} />
                <meshLambertMaterial color="#111111" />
              </mesh>
              <mesh position={[0, -0.37, 0]}>
                <boxGeometry args={[0.12, 0.14, 0.13]} />
                <meshLambertMaterial color="#f5d0a9" />
              </mesh>
              <mesh position={[0, -0.32, 0.07]}>
                <boxGeometry args={[0.13, 0.04, 0.02]} />
                <meshBasicMaterial color={adminGoldAccent} />
              </mesh>
            </group>
            {/* Right Arm Group (pivoting at shoulder Y=1.45) */}
            <group ref={rightArmRef} position={[0.34, 1.45, 0]}>
              <mesh position={[0, -0.15, 0]}>
                <boxGeometry args={[0.14, 0.35, 0.15]} />
                <meshLambertMaterial color="#111111" />
              </mesh>
              <mesh position={[0, -0.37, 0]}>
                <boxGeometry args={[0.12, 0.14, 0.13]} />
                <meshLambertMaterial color="#f5d0a9" />
              </mesh>
              <mesh position={[0, -0.32, 0.07]}>
                <boxGeometry args={[0.13, 0.04, 0.02]} />
                <meshBasicMaterial color={adminGoldAccent} />
              </mesh>
            </group>

            {/* Left Leg Group (pivoting at hip Y=0.90) */}
            <group ref={leftLegRef} position={[-0.12, 0.90, 0]}>
              <mesh position={[0, -0.38, 0]}>
                <boxGeometry args={[0.18, 0.75, 0.2]} />
                <meshLambertMaterial color="#1a1a2e" />
              </mesh>
              <mesh position={[0, -0.82, 0.04]}>
                <boxGeometry args={[0.18, 0.16, 0.28]} />
                <meshLambertMaterial color="#0a0a0a" />
              </mesh>
            </group>
            {/* Right Leg Group (pivoting at hip Y=0.90) */}
            <group ref={rightLegRef} position={[0.12, 0.90, 0]}>
              <mesh position={[0, -0.38, 0]}>
                <boxGeometry args={[0.18, 0.75, 0.2]} />
                <meshLambertMaterial color="#1a1a2e" />
              </mesh>
              <mesh position={[0, -0.82, 0.04]}>
                <boxGeometry args={[0.18, 0.16, 0.28]} />
                <meshLambertMaterial color="#0a0a0a" />
              </mesh>
            </group>
          </group>
        ) : (
          /* ══════ REGULAR VISITOR: Cyber-Neon Character (Identical to OtherPlayerAvatar) ══════ */
          <group>
            {/* Head Group (pivoting at neck Y=1.58) */}
            <group ref={headRef} position={[0, 1.58, 0]}>
              {/* Head */}
              <mesh position={[0, 0.14, 0]}>
                <sphereGeometry args={[0.18, 16, 16]} />
                <meshLambertMaterial color="#f8fafc" />
              </mesh>
              {/* Neon Visor Eyes */}
              <mesh position={[0, 0.16, 0.14]}>
                <boxGeometry args={[0.22, 0.07, 0.08]} />
                <meshBasicMaterial color={avatarColor} />
              </mesh>
            </group>

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

            {/* Left Arm Group (pivoting at shoulder Y=1.45) */}
            <group ref={leftArmRef} position={[-0.33, 1.45, 0]}>
              <mesh position={[0, -0.15, 0]}>
                <boxGeometry args={[0.14, 0.35, 0.15]} />
                <meshLambertMaterial color={avatarColor} />
              </mesh>
              <mesh position={[0, -0.37, 0]}>
                <boxGeometry args={[0.12, 0.14, 0.13]} />
                <meshLambertMaterial color="#f8fafc" />
              </mesh>
            </group>
            {/* Right Arm Group (pivoting at shoulder Y=1.45) */}
            <group ref={rightArmRef} position={[0.33, 1.45, 0]}>
              <mesh position={[0, -0.15, 0]}>
                <boxGeometry args={[0.14, 0.35, 0.15]} />
                <meshLambertMaterial color={avatarColor} />
              </mesh>
              <mesh position={[0, -0.37, 0]}>
                <boxGeometry args={[0.12, 0.14, 0.13]} />
                <meshLambertMaterial color="#f8fafc" />
              </mesh>
            </group>

            {/* Left Leg Group (pivoting at hip Y=0.90) */}
            <group ref={leftLegRef} position={[-0.12, 0.90, 0]}>
              <mesh position={[0, -0.38, 0]}>
                <boxGeometry args={[0.17, 0.75, 0.19]} />
                <meshLambertMaterial color="#334155" />
              </mesh>
              <mesh position={[0, -0.82, 0.04]}>
                <boxGeometry args={[0.17, 0.16, 0.26]} />
                <meshLambertMaterial color="#1e293b" />
              </mesh>
            </group>
            {/* Right Leg Group (pivoting at hip Y=0.90) */}
            <group ref={rightLegRef} position={[0.12, 0.90, 0]}>
              <mesh position={[0, -0.38, 0]}>
                <boxGeometry args={[0.17, 0.75, 0.19]} />
                <meshLambertMaterial color="#334155" />
              </mesh>
              <mesh position={[0, -0.82, 0.04]}>
                <boxGeometry args={[0.17, 0.16, 0.26]} />
                <meshLambertMaterial color="#1e293b" />
              </mesh>
            </group>
          </group>
        )}
      </group>
    </group>
  );
};

export default LocalPlayerEmoteAvatar;
