import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// Helper function to clean markdown syntax for crisp, beautifully formatted 3D speech text
const cleanMarkdownFor3D = (rawText) => {
  if (!rawText) return '';
  return rawText
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace [Link Label](url) with "Link Label"
    .replace(/\*\*([^*]+)\*\*/g, '$1')       // Replace **bold** with "bold"
    .replace(/\*([^*]+)\*/g, '$1')           // Replace *italic* with "italic"
    .replace(/`([^`]+)`/g, '$1')             // Replace `code` with "code"
    .replace(/^[*-\s]+/gm, '• ');            // Clean bullet points
};

const DEFAULT_WELCOME_SPEECH = "Hello! I'm Abdul Mannan's AI Assistant. I'm here to help you learn more about Abdul's projects, technical expertise, professional experience, achievements, and creative work. Feel free to ask me anything, and I'll be happy to assist you.";

const _npcPos = new THREE.Vector3(3, 2.0, 6);
const _lookDir = new THREE.Vector3();

const BotAssistantNPC = ({ onOpenChat, isLookingAtNPC = false }) => {
  const { camera } = useThree();
  const groupRef = useRef();
  const headRef = useRef();
  const rightArmRef = useRef();
  const leftArmRef = useRef();
  const [isHovered, setIsHovered] = useState(false);

  // Localized states to completely prevent parent Museum.jsx re-renders!
  const [localSpeechText, setLocalSpeechText] = useState(DEFAULT_WELCOME_SPEECH);
  const [localIsSpeaking, setLocalIsSpeaking] = useState(false);

  React.useEffect(() => {
    const handleSpeaking = (e) => {
      setLocalIsSpeaking(e.detail);
    };
    const handleSpeechText = (e) => {
      setLocalSpeechText(e.detail);
    };

    window.addEventListener('ai-speaking', handleSpeaking);
    window.addEventListener('ai-speech-text', handleSpeechText);

    return () => {
      window.removeEventListener('ai-speaking', handleSpeaking);
      window.removeEventListener('ai-speech-text', handleSpeechText);
    };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    // 1. Taller Scale & Base Idle Breathing Sway
    const breathe = Math.sin(time * 2) * 0.04;
    groupRef.current.position.y = breathe;

    // 2. Smooth Head & Body Orientation Facing Player Camera (No 360 Spinning, Zero GC Allocations!)
    const distToPlayer = camera.position.distanceTo(_npcPos);

    if (distToPlayer < 12) {
      _lookDir.copy(camera.position).sub(_npcPos);
      const targetAngle = Math.atan2(_lookDir.x, _lookDir.z);
      
      // Compute shortest angle difference to prevent 360-degree spinning across the +-PI boundary!
      let diff = targetAngle - groupRef.current.rotation.y;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      groupRef.current.rotation.y += diff * 0.08;
    }

    // 3. Animated Arm Talking Gestures when Answering Questions
    if (localIsSpeaking) {
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -Math.PI / 4 + Math.sin(time * 6) * 0.2;
        rightArmRef.current.rotation.z = Math.PI / 8 + Math.cos(time * 4) * 0.1;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -Math.PI / 4 + Math.cos(time * 6) * 0.2;
      }
    } else {
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = Math.sin(time * 2) * 0.05;
        rightArmRef.current.rotation.z = 0;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -Math.sin(time * 2) * 0.05;
      }
    }
  });

  // STRICT RULE: Show 3D overhead speech bubble ONLY when user is actively pointing at bot (isLookingAtNPC)!
  const shouldShowBubble = Boolean(isLookingAtNPC && localSpeechText);
  const formattedSpeechText = cleanMarkdownFor3D(localSpeechText);

  // Tightly calculate dynamic 3D speech bubble size with ZERO excess height!
  const textLength = formattedSpeechText ? formattedSpeechText.length : 0;
  const lineCount = Math.max(1, Math.ceil(textLength / 34));
  const bubbleWidth = textLength < 25 ? Math.max(1.8, textLength * 0.08 + 0.5) : 3.4;
  const bubbleHeight = 0.24 + lineCount * 0.15;
  const bubbleYPos = 3.0 + bubbleHeight * 0.5;

  // Border color: White (#ffffff) by default, turns Blue (#38bdf8) when hovered/clickable!
  const borderColor = isHovered ? '#38bdf8' : '#ffffff';

  return (
    <group ref={groupRef} position={[3, 0, 6]} scale={[1.3, 1.3, 1.3]}>
      {/* ── 1. Dynamic 3D Speech Bubble (ONLY Visible When Actively Pointing at Bot!) ── */}
      {shouldShowBubble && (
        <group position={[0, bubbleYPos, 0]}>
          {/* Background Bubble Plate */}
          <mesh position={[0, 0, -0.02]}>
            <planeGeometry args={[bubbleWidth, bubbleHeight]} />
            <meshBasicMaterial color="#09090b" opacity={0.94} transparent />
          </mesh>
          {/* Border Frame Plate */}
          <mesh position={[0, 0, -0.03]}>
            <planeGeometry args={[bubbleWidth + 0.05, bubbleHeight + 0.05]} />
            <meshBasicMaterial color={borderColor} />
          </mesh>

          {/* Header Title */}
          <Text
            fontSize={0.12}
            color="#38bdf8"
            anchorX="center"
            anchorY="top"
            position={[0, bubbleHeight / 2 - 0.06, 0.01]}
            fontWeight={800}
          >
            🤖 AI ASSISTANT
          </Text>

          {/* Formatted Clean 3D Speech Text */}
          <Text
            fontSize={0.115}
            color="#ffffff"
            anchorX="center"
            anchorY="top"
            position={[0, bubbleHeight / 2 - 0.20, 0.01]}
            maxWidth={bubbleWidth - 0.2}
            textAlign="center"
            lineHeight={1.2}
          >
            {formattedSpeechText}
          </Text>
        </group>
      )}

      {/* ── 2. Taller 3D AI Assistant Character ── */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          if (e.distance && e.distance > 6.0) return;
          if (onOpenChat) onOpenChat();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (e.distance && e.distance <= 6.0) {
            setIsHovered(true);
          }
        }}
        onPointerOut={() => {
          setIsHovered(false);
        }}
        cursor="pointer"
      >
        {/* Head & Hair */}
        <group ref={headRef} position={[0, 2.5, 0]}>
          <mesh>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshLambertMaterial color="#f5d0a9" />
          </mesh>
          <mesh position={[0, 0.15, -0.1]}>
            <sphereGeometry args={[0.16, 12, 12]} />
            <meshLambertMaterial color="#2d1a0e" />
          </mesh>
          <mesh position={[0.23, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.1, 8]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
          <mesh position={[-0.08, 0.05, 0.2]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color="#0284c7" />
          </mesh>
          <mesh position={[0.08, 0.05, 0.2]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color="#0284c7" />
          </mesh>
        </group>

        {/* Torso & Blazer */}
        <mesh position={[0, 1.7, 0]}>
          <cylinderGeometry args={[0.22, 0.25, 0.9, 16]} />
          <meshLambertMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0, 1.9, 0.12]}>
          <planeGeometry args={[0.14, 0.25]} />
          <meshLambertMaterial color="#ffffff" />
        </mesh>

        {/* Museum Staff Badge */}
        <mesh position={[0, 1.75, 0.23]}>
          <boxGeometry args={[0.12, 0.16, 0.02]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <Text position={[0, 1.75, 0.25]} fontSize={0.035} color="#000000" anchorX="center" anchorY="middle">
          AI ASSISTANT
        </Text>

        {/* Left Arm */}
        <group ref={leftArmRef} position={[-0.3, 2.0, 0]}>
          <mesh position={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.06, 0.05, 0.6, 12]} />
            <meshLambertMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, -0.62, 0]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshLambertMaterial color="#f5d0a9" />
          </mesh>
        </group>

        {/* Right Arm */}
        <group ref={rightArmRef} position={[0.3, 2.0, 0]}>
          <mesh position={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.06, 0.05, 0.6, 12]} />
            <meshLambertMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, -0.62, 0]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshLambertMaterial color="#f5d0a9" />
          </mesh>
        </group>

        {/* Trousers & Taller Legs */}
        <group position={[-0.12, 1.2, 0]}>
          <mesh position={[0, -0.5, 0]}>
            <cylinderGeometry args={[0.08, 0.07, 1.0, 12]} />
            <meshLambertMaterial color="#0284c7" />
          </mesh>
          <mesh position={[0, -1.02, 0.06]}>
            <boxGeometry args={[0.12, 0.08, 0.22]} />
            <meshLambertMaterial color="#000000" />
          </mesh>
        </group>

        <group position={[0.12, 1.2, 0]}>
          <mesh position={[0, -0.5, 0]}>
            <cylinderGeometry args={[0.08, 0.07, 1.0, 12]} />
            <meshLambertMaterial color="#0284c7" />
          </mesh>
          <mesh position={[0, -1.02, 0.06]}>
            <boxGeometry args={[0.12, 0.08, 0.22]} />
            <meshLambertMaterial color="#000000" />
          </mesh>
        </group>
      </group>
    </group>
  );
};

export default BotAssistantNPC;
