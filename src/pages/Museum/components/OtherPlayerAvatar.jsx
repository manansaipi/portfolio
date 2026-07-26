import React, { useRef, useState, useMemo } from 'react';
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
  const headRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const prevPosRef = useRef(new THREE.Vector3());
  const smoothSpeedRef = useRef(0);
  const limbPhaseRef = useRef(0);
  const [activeSpeech, setActiveSpeech] = useState('');
  const [activeEmote, setActiveEmote] = useState(null);

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

      // Check active emote state
      const currentEmote = (playerData.currentEmote && (playerData.emoteEndTime === 0 || Date.now() < playerData.emoteEndTime))
        ? playerData.currentEmote
        : null;
      if (activeEmote !== currentEmote) {
        setActiveEmote(currentEmote);
      }

      // Use Quaternions for robust shortest-path rotation interpolation without drift
      if (bodyGroupRef.current && currentEmote !== 'dance') {
        // cleanYaw is computed relative to +Z axis, matching our mesh front face directly
        const cleanYaw = (playerData.targetRotation && playerData.targetRotation[1]) || 0;
        
        const targetEuler = new THREE.Euler(0, cleanYaw, 0);
        const targetQuaternion = new THREE.Quaternion().setFromEuler(targetEuler);
        
        bodyGroupRef.current.quaternion.slerp(targetQuaternion, Math.min(delta * 12, 1));
      }

      // Animate head pitch (looking up / down) smoothly
      if (headRef.current) {
        // Negate targetPitch because for a +Z facing mesh, positive X rotation tilts down and negative X rotation tilts up
        const targetPitch = -(playerData.targetRotation && playerData.targetRotation[0]) || 0;
        const clampedPitch = THREE.MathUtils.clamp(targetPitch, -1.05, 1.05); // Limit to ~60 deg tilt
        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, clampedPitch, Math.min(delta * 12, 1));
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

    // 3. Proximity clipping prevention: hide avatar if camera is too close (distance < 1.4m)
    const dx = camera.position.x - groupRef.current.position.x;
    const dz = camera.position.z - groupRef.current.position.z;
    const dy = camera.position.y - (groupRef.current.position.y + EYE_HEIGHT);
    const distSq = dx * dx + dy * dy + dz * dz;
    groupRef.current.visible = distSq > 1.96; // 1.4m squared

    // 4. Calculate walking speed and animate limb swing!
    const moveDist = groupRef.current.position.distanceTo(prevPosRef.current);
    const instantSpeed = delta > 0 ? moveDist / delta : 0;
    prevPosRef.current.copy(groupRef.current.position);

    if (moveDist > 5.0) {
      // Teleported or just spawned! Do not swing limbs.
      smoothSpeedRef.current = 0;
      return;
    }

    // Smooth speed over ~10 frames to eliminate network lerp spikes when tapping keys
    smoothSpeedRef.current = THREE.MathUtils.lerp(smoothSpeedRef.current, instantSpeed, Math.min(delta * 12, 1));
    const speed = smoothSpeedRef.current;

    if (speed > 0.15) {
      // Walking / running limb swing animation!
      const swingFreq = Math.min(Math.max(speed * 2.2, 4.0), 10.0);
      limbPhaseRef.current += delta * swingFreq;
      const limbAngle = Math.sin(limbPhaseRef.current) * 0.6;
      if (leftLegRef.current) leftLegRef.current.rotation.x = limbAngle;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -limbAngle;
      if (leftArmRef.current) { leftArmRef.current.rotation.x = -limbAngle * 0.7; leftArmRef.current.rotation.z = 0; }
      if (rightArmRef.current) { rightArmRef.current.rotation.x = limbAngle * 0.7; rightArmRef.current.rotation.z = 0; }
      if (bodyGroupRef.current) bodyGroupRef.current.position.y = THREE.MathUtils.lerp(bodyGroupRef.current.position.y, 0, Math.min(delta * 12, 1));
    } else if (activeEmote) {
      const time = state.clock.elapsedTime;
      if (activeEmote === 'wave') {
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -Math.PI / 1.1, Math.min(delta * 12, 1));
          rightArmRef.current.rotation.z = Math.sin(time * 10) * 0.45;
        }
        if (leftArmRef.current) { leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, Math.min(delta * 12, 1)); leftArmRef.current.rotation.z = 0; }
        if (leftLegRef.current) leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, Math.min(delta * 12, 1));
        if (rightLegRef.current) rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, Math.min(delta * 12, 1));
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
    } else {
      // Smoothly lerp limbs back to neutral standing position when idle!
      if (leftLegRef.current) leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, Math.min(delta * 12, 1));
      if (rightLegRef.current) rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, Math.min(delta * 12, 1));
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, Math.min(delta * 12, 1));
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0, Math.min(delta * 12, 1));
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, Math.min(delta * 12, 1));
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, 0, Math.min(delta * 12, 1));
      }
      if (bodyGroupRef.current) bodyGroupRef.current.position.y = THREE.MathUtils.lerp(bodyGroupRef.current.position.y, 0, Math.min(delta * 12, 1));
      limbPhaseRef.current = 0; // Reset phase for next step
    }
  });

  const avatarColor = player.color || "#38bdf8";
  const isAdmin = player.isAdmin || false;
  const adminGoldAccent = "#f59e0b";

  const { bubbleWidth, bubbleHeight } = useMemo(() => {
    if (!activeSpeech) return { bubbleWidth: 0, bubbleHeight: 0 };
    const lines = activeSpeech.split('\n');
    let totalLines = 0;
    let maxLineLen = 0;
    const maxCharsPerLine = 38; // ~2.4 units / 0.063
    lines.forEach(line => {
      const len = line.length;
      maxLineLen = Math.max(maxLineLen, Math.min(maxCharsPerLine, len));
      const lineWraps = Math.ceil(len / maxCharsPerLine) || 1;
      totalLines += lineWraps;
    });
    const w = Math.min(2.75, Math.max(0.4, maxLineLen * 0.063 + 0.3));
    const h = Math.max(0.32, totalLines * 0.16 + 0.18);
    return { bubbleWidth: w, bubbleHeight: h };
  }, [activeSpeech]);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* ── Floating Name Tag & Speech Bubble Billboard Group (above scaled head) ── */}
      <group ref={nameTagGroupRef} position={[0, 4.45, 0]}>
        {/* Admin Crown / Badge (positioned below the speech bubble!) */}
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
          <meshBasicMaterial color={isAdmin ? adminGoldAccent : avatarColor} transparent opacity={0.6} />
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

        {/* 3D Emote Emoji Badge Above Name Tag */}
        {activeEmote && (
          <group position={[0, isAdmin ? 0.62 : 0.32, 0]}>
            <mesh position={[0, 0, -0.01]}>
              <circleGeometry args={[0.2, 16]} />
              <meshBasicMaterial color="#0f172a" transparent opacity={0.88} />
            </mesh>
            <mesh position={[0, 0, -0.012]}>
              <circleGeometry args={[0.23, 16]} />
              <meshBasicMaterial color={avatarColor} transparent opacity={0.8} />
            </mesh>
            <Text
              position={[0, 0, 0]}
              fontSize={0.24}
              anchorX="center"
              anchorY="middle"
            >
              {activeEmote === 'wave' ? '👋' : activeEmote === 'dance' ? '💃' : activeEmote === 'cheer' ? '🎉' : '👏'}
            </Text>
          </group>
        )}

        {/* 3D Speech Bubble (Appears above crown/emote when talking in chat!) */}
        {activeSpeech && (
          <group position={[0, (isAdmin ? (activeEmote ? 0.88 : 0.42) : (activeEmote ? 0.58 : 0.25)) + (bubbleHeight / 2), 0]}>
            <mesh position={[0, 0, -0.01]}>
              <planeGeometry args={[bubbleWidth, bubbleHeight]} />
              <meshBasicMaterial color={isAdmin ? "#2d1b00" : "#18181b"} transparent opacity={0.94} />
            </mesh>
            <mesh position={[0, 0, -0.012]}>
              <planeGeometry args={[bubbleWidth + 0.04, bubbleHeight + 0.04]} />
              <meshBasicMaterial color={isAdmin ? "#f59e0b" : avatarColor} transparent opacity={0.85} />
            </mesh>
            <Text
              position={[0, 0, 0]}
              fontSize={0.12}
              color={isAdmin ? "#fef3c7" : "#ffffff"}
              maxWidth={2.4}
              overflowWrap="break-word"
              whiteSpace="normal"
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
      <group ref={bodyGroupRef} scale={[2.15, 2.15, 2.15]}>
        {isAdmin ? (
          /* ══════ ADMIN: Premium Gold & Black Character ══════ */
          <group>
            {/* Head Group (pivoting at neck Y=1.58) */}
            <group ref={headRef} position={[0, 1.58, 0]}>
              {/* Head */}
              <mesh position={[0, 0.14, 0]}>
                <sphereGeometry args={[0.18, 16, 16]} />
                <meshLambertMaterial color="#f5d0a9" />
              </mesh>
              {/* Hair */}
              <mesh position={[0, 0.30, -0.04]}>
                <sphereGeometry args={[0.16, 12, 12]} />
                <meshLambertMaterial color="#1a1a2e" />
              </mesh>
              {/* Sunglasses Visor */}
              <mesh position={[0, 0.16, 0.14]}>
                <boxGeometry args={[0.22, 0.07, 0.08]} />
                <meshBasicMaterial color="#0f0f0f" />
              </mesh>
              {/* Gold Earring */}
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
            {/* Blazer Lapel / Gold Trim */}
            <mesh position={[0, 1.38, 0.14]}>
              <boxGeometry args={[0.15, 0.12, 0.02]} />
              <meshBasicMaterial color={adminGoldAccent} />
            </mesh>
            {/* Gold Pocket Square */}
            <mesh position={[-0.15, 1.35, 0.15]}>
              <boxGeometry args={[0.06, 0.06, 0.01]} />
              <meshBasicMaterial color={adminGoldAccent} />
            </mesh>

            {/* Belt */}
            <mesh position={[0, 0.93, 0]}>
              <boxGeometry args={[0.5, 0.07, 0.26]} />
              <meshLambertMaterial color="#1a1a1a" />
            </mesh>
            {/* Belt Buckle */}
            <mesh position={[0, 0.93, 0.14]}>
              <boxGeometry args={[0.08, 0.06, 0.02]} />
              <meshBasicMaterial color={adminGoldAccent} />
            </mesh>

            {/* Left Arm Group (pivoting at shoulder Y=1.45) */}
            <group ref={leftArmRef} position={[-0.35, 1.45, 0]}>
              <mesh position={[0, -0.15, 0]}>
                <boxGeometry args={[0.14, 0.35, 0.16]} />
                <meshLambertMaterial color="#111111" />
              </mesh>
              <mesh position={[0, -0.37, 0]}>
                <boxGeometry args={[0.12, 0.14, 0.14]} />
                <meshLambertMaterial color="#f5d0a9" />
              </mesh>
            </group>
            {/* Right Arm Group (pivoting at shoulder Y=1.45) */}
            <group ref={rightArmRef} position={[0.35, 1.45, 0]}>
              <mesh position={[0, -0.15, 0]}>
                <boxGeometry args={[0.14, 0.35, 0.16]} />
                <meshLambertMaterial color="#111111" />
              </mesh>
              <mesh position={[0, -0.37, 0]}>
                <boxGeometry args={[0.12, 0.14, 0.14]} />
                <meshLambertMaterial color="#f5d0a9" />
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
          /* ══════ REGULAR VISITOR: Cyber-Neon Character ══════ */
          <group>
            {/* Head Group (pivoting at neck Y=1.58) */}
            <group ref={headRef} position={[0, 1.58, 0]}>
              {/* Head */}
              <mesh position={[0, 0.14, 0]}>
                <sphereGeometry args={[0.18, 16, 16]} />
                <meshLambertMaterial color="#f8fafc" />
              </mesh>
              {/* Neon Visor Eyes (makes rotation visible — positioned on the FRONT face) */}
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

export default OtherPlayerAvatar;
