import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { TOUR_WAYPOINTS } from '../utils/tourGuideNavConfig';
import { speakNPC, stopNPCSpeech } from '../utils/useNPCVoice';

const TourGuideNPC = ({ isTourActive, onTourToggle, onSubtitleUpdate }) => {
  const { camera } = useThree();
  const groupRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();

  const [currentWaypointIdx, setCurrentWaypointIdx] = useState(0);
  const [npcState, setNpcState] = useState('IDLE'); // 'IDLE' | 'WALKING' | 'EXPLAINING' | 'WAITING'
  const [speechText, setSpeechText] = useState("Hi! I'm Maya. Press [E] to start a guided museum tour!");

  const walkSpeed = 5.2; // Smooth walking speed m/s
  const currentPos = useRef(new THREE.Vector3(3, 0, 6));

  // Sync subtitle text with HUD overlay
  useEffect(() => {
    if (onSubtitleUpdate) {
      onSubtitleUpdate(speechText);
    }
  }, [speechText, onSubtitleUpdate]);

  // Handle tour state activation / reset
  useEffect(() => {
    if (isTourActive) {
      setCurrentWaypointIdx(0);
      setNpcState('WALKING');
      const startWp = TOUR_WAYPOINTS[0];
      setSpeechText(startWp.speech);
      speakNPC(startWp.speech);
    } else {
      setNpcState('IDLE');
      currentPos.current.set(3, 0, 6);
      if (groupRef.current) groupRef.current.position.set(3, 0, 6);
      setSpeechText("Press [E] to start a guided museum tour!");
      stopNPCSpeech();
    }
  }, [isTourActive]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();

    // ── 1. User Distance Tracking & Waiting Logic ──
    const playerDist = currentPos.current.distanceTo(camera.position);

    if (isTourActive && npcState === 'WALKING') {
      if (playerDist > 14) {
        // User fell too far behind! Pause tour & wait
        setNpcState('WAITING');
        const waitMsg = "I'll wait for you here! Catch up to continue our tour.";
        setSpeechText(waitMsg);
        speakNPC(waitMsg);
      }
    } else if (isTourActive && npcState === 'WAITING') {
      if (playerDist < 6) {
        // User caught up! Resume tour walking
        setNpcState('WALKING');
        const resumeMsg = "Great! Let me show you the next gallery.";
        setSpeechText(resumeMsg);
        speakNPC(resumeMsg);
      }
    }

    // ── 2. Waypoint Walking Navigation Engine ──
    if (isTourActive && npcState === 'WALKING') {
      const targetWp = TOUR_WAYPOINTS[currentWaypointIdx];
      const targetPos = new THREE.Vector3(...targetWp.position);
      const distToWp = currentPos.current.distanceTo(targetPos);

      if (distToWp > 0.4) {
        // Walk towards target waypoint
        const moveDir = targetPos.clone().sub(currentPos.current).normalize();
        currentPos.current.add(moveDir.multiplyScalar(walkSpeed * delta));
        groupRef.current.position.copy(currentPos.current);

        // Smooth rotation facing movement direction
        const targetAngle = Math.atan2(moveDir.x, moveDir.z);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetAngle, 0.1);

        // Walking limb swing animation
        const limbAngle = Math.sin(time * 8) * 0.5;
        if (leftLegRef.current) leftLegRef.current.rotation.x = limbAngle;
        if (rightLegRef.current) rightLegRef.current.rotation.x = -limbAngle;
        if (leftArmRef.current) leftArmRef.current.rotation.x = -limbAngle * 0.6;
        if (rightArmRef.current) rightArmRef.current.rotation.x = limbAngle * 0.6;
      } else {
        // Waypoint reached! Execute waypoint action
        if (targetWp.action === 'explain' || targetWp.action === 'greet') {
          setNpcState('EXPLAINING');
          setSpeechText(targetWp.speech);

          // Reset leg positions
          if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
          if (rightLegRef.current) rightLegRef.current.rotation.x = 0;

          speakNPC(targetWp.speech, () => {
            // Speech completed! Advance to next waypoint
            if (currentWaypointIdx < TOUR_WAYPOINTS.length - 1) {
              setCurrentWaypointIdx((prev) => prev + 1);
              setNpcState('WALKING');
            } else {
              // Tour Complete!
              setNpcState('IDLE');
              if (onTourToggle) onTourToggle(false);
            }
          });
        } else if (targetWp.action === 'finish') {
          setSpeechText(targetWp.speech);
          speakNPC(targetWp.speech);
          setNpcState('IDLE');
          if (onTourToggle) onTourToggle(false);
        } else {
          // Normal walk waypoint -> advance immediately
          if (currentWaypointIdx < TOUR_WAYPOINTS.length - 1) {
            setCurrentWaypointIdx((prev) => prev + 1);
          }
        }
      }
    } else {
      // ── 3. Idle / Explaining Animations ──
      // Reset legs
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;

      if (npcState === 'EXPLAINING') {
        // Point right arm towards exhibit target
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = -Math.PI / 3;
          rightArmRef.current.rotation.z = Math.PI / 6;
        }
        // Subtle talking head sway
        groupRef.current.rotation.y += Math.sin(time * 2) * 0.002;
      } else if (npcState === 'WAITING') {
        // Turn back to face player
        const lookDir = camera.position.clone().sub(currentPos.current);
        const lookAngle = Math.atan2(lookDir.x, lookDir.z);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, lookAngle, 0.05);

        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = 0;
          rightArmRef.current.rotation.z = 0;
        }
      } else {
        // Idle breathing & player-facing sway
        const idleBreathe = Math.sin(time * 2) * 0.03;
        groupRef.current.position.y = idleBreathe;

        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = Math.sin(time * 2) * 0.05;
          rightArmRef.current.rotation.z = 0;
        }
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = -Math.sin(time * 2) * 0.05;
        }
      }
    }
  });

  return (
    <group ref={groupRef} position={[3, 0, 6]}>
      {/* ── 1. 3D Overhead Speech & Subtitle Bubble ── */}
      {speechText && (
        <group position={[0, 3.2, 0]}>
          {/* Background Bubble Plate */}
          <mesh position={[0, 0, -0.02]}>
            <planeGeometry args={[3.8, 0.9]} />
            <meshBasicMaterial color="#09090b" opacity={0.9} transparent />
          </mesh>
          <mesh position={[0, 0, -0.03]}>
            <planeGeometry args={[3.86, 0.96]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
          <Text
            fontSize={0.16}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            maxWidth={3.5}
            textAlign="center"
          >
            {speechText}
          </Text>
        </group>
      )}

      {/* ── 2. Realistic 3D Museum Staff Guide Character (Maya) ── */}

      {/* Head & Hair */}
      <mesh position={[0, 2.5, 0]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshLambertMaterial color="#f5d0a9" />
      </mesh>
      {/* Hair Bun */}
      <mesh position={[0, 2.65, -0.1]}>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshLambertMaterial color="#2d1a0e" />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.08, 2.55, 0.2]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.08, 2.55, 0.2]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>

      {/* Torso & Staff Blazer */}
      <mesh position={[0, 1.7, 0]}>
        <cylinderGeometry args={[0.22, 0.25, 0.9, 16]} />
        <meshLambertMaterial color="#1e293b" />
      </mesh>
      {/* White Shirt V-Neck */}
      <mesh position={[0, 1.9, 0.12]}>
        <planeGeometry args={[0.14, 0.25]} />
        <meshLambertMaterial color="#ffffff" />
      </mesh>

      {/* Museum ID Badge Lanyard */}
      <mesh position={[0, 1.75, 0.23]}>
        <boxGeometry args={[0.12, 0.16, 0.02]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>
      <Text position={[0, 1.75, 0.25]} fontSize={0.04} color="#000000" anchorX="center" anchorY="middle">
        MAYA GUIDE
      </Text>

      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.3, 2.0, 0]}>
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.06, 0.05, 0.6, 12]} />
          <meshLambertMaterial color="#1e293b" />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.62, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshLambertMaterial color="#f5d0a9" />
        </mesh>
      </group>

      {/* Right Arm (Pointing / Gesturing) */}
      <group ref={rightArmRef} position={[0.3, 2.0, 0]}>
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.06, 0.05, 0.6, 12]} />
          <meshLambertMaterial color="#1e293b" />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.62, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshLambertMaterial color="#f5d0a9" />
        </mesh>
      </group>

      {/* Trousers & Legs */}
      <group ref={leftLegRef} position={[-0.12, 1.2, 0]}>
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.08, 0.07, 1.0, 12]} />
          <meshLambertMaterial color="#0f172a" />
        </mesh>
        {/* Shoe */}
        <mesh position={[0, -1.02, 0.06]}>
          <boxGeometry args={[0.12, 0.08, 0.22]} />
          <meshLambertMaterial color="#000000" />
        </mesh>
      </group>

      <group ref={rightLegRef} position={[0.12, 1.2, 0]}>
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.08, 0.07, 1.0, 12]} />
          <meshLambertMaterial color="#0f172a" />
        </mesh>
        {/* Shoe */}
        <mesh position={[0, -1.02, 0.06]}>
          <boxGeometry args={[0.12, 0.08, 0.22]} />
          <meshLambertMaterial color="#000000" />
        </mesh>
      </group>
    </group>
  );
};

export default TourGuideNPC;
