import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import { WALKABLE_ZONES } from '../utils/museumLayoutConfig';

const OBSTACLE_ZONES = [
  // Central "THE GALLERY" Kiosk Table: Position [0, 0, 8], Size 4.8 x 2.8 -> X: -2.8 to 2.8, Z: 6.3 to 9.7
  { minX: -2.8, maxX: 2.8, minZ: 6.3, maxZ: 9.7, level: 1 },
  // About the Museum Standing Board: Position [-20, 0, 8] -> X: -21.2 to -18.8, Z: 7.2 to 8.8
  { minX: -21.2, maxX: -18.8, minZ: 7.2, maxZ: 8.8, level: 1 },
];

// 🚀 Pre-allocate static reusable Vector3 objects to prevent GC frame stutters!
const _npcBodyPos = new THREE.Vector3(3, 2.2, 6);
const _npcBubblePos = new THREE.Vector3(3, 3.6, 6);
const _viewDir = new THREE.Vector3();
const _toNpcBody = new THREE.Vector3();
const _toNpcBubble = new THREE.Vector3();
const _artPos = new THREE.Vector3();
const _toArt = new THREE.Vector3();

const checkPositionValid = (x, z) => {
  let inZone = false;
  for (const zone of WALKABLE_ZONES) {
    if (x >= zone.minX && x <= zone.maxX && z >= zone.minZ && z <= zone.maxZ) {
      inZone = true;
      break;
    }
  }
  if (!inZone) return false;

  for (const obs of OBSTACLE_ZONES) {
    if (x >= obs.minX && x <= obs.maxX && z >= obs.minZ && z <= obs.maxZ) {
      return false;
    }
  }
  return true;
};

const Player = ({
  position = [0, 3.8, 0],
  teleportTarget,
  enabled = true,
  onInteractE,
  onLookingAtNPC,
  placedArtworks = [],
  onSelectArt,
  mobileMoveVectorRef,
  mobileLookDeltaRef,
  mobileJumpTrigger = 0,
  mobileInteractTrigger = 0,
  mobileCrouched = false,
  onInteractTypeChange,
  isMobile = false,
}) => {
  const { camera } = useThree();
  const controlsRef = useRef();

  const yaw = useRef(Math.PI);
  const pitch = useRef(0);
  const prevLookingAtNpc = useRef(false);

  const keys = useRef({ w: false, a: false, s: false, d: false, space: false, crouch: false });
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const isLookingAtNPCRef = useRef(false);
  const lookingAtArtRef = useRef(null);
  
  const SPEED = 180;
  const NORMAL_HEIGHT = 3.8;
  const JUMP_FORCE = 11;
  const GRAVITY = 28;

  // Pre-parse artwork Vector3 positions to avoid array spread inside useFrame!
  const parsedArtworks = useRef([]);
  useEffect(() => {
    parsedArtworks.current = placedArtworks.map(art => ({
      art,
      vec: art.pos ? new THREE.Vector3(...art.pos) : null
    })).filter(item => item.vec !== null);
  }, [placedArtworks]);

  // Initial Spawn: Orient camera level at eye height facing directly towards the Portrait Hall (+Z)!
  useEffect(() => {
    camera.position.set(position[0], position[1] || NORMAL_HEIGHT, position[2]);
    camera.rotation.set(0, Math.PI, 0); // Face South (Portrait Hall) level at eye height!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera]);

  // Handle Pointer Lock events to ensure cursor is ALWAYS visible when unlocked (ESC)
  useEffect(() => {
    if (isMobile) return;
    const controls = controlsRef.current;
    if (!controls) return;

    const onLock = () => {
      document.body.style.cursor = 'none';
    };

    const onUnlock = () => {
      document.body.style.cursor = 'default';
    };

    controls.addEventListener('lock', onLock);
    controls.addEventListener('unlock', onUnlock);

    return () => {
      controls.removeEventListener('lock', onLock);
      controls.removeEventListener('unlock', onUnlock);
      document.body.style.cursor = 'default';
    };
  }, [isMobile]);

  // 🚀 Automatically re-engage Pointer Lock on desktop when Modal closes!
  useEffect(() => {
    if (isMobile) return;
    if (enabled && controlsRef.current && !controlsRef.current.isLocked) {
      const timer = setTimeout(() => {
        if (controlsRef.current && !controlsRef.current.isLocked) {
          try {
            controlsRef.current.lock();
          } catch (err) {
            console.log("Auto-lock prevented:", err);
          }
        }
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [enabled]);

  const triggerInteraction = () => {
    if (isLookingAtNPCRef.current && onInteractE) {
      onInteractE();
    } else if (lookingAtArtRef.current && onSelectArt) {
      onSelectArt(lookingAtArtRef.current);
    }
  };

  // Listen for both KeyE press and mouse click to interact with AI Assistant OR inspect Artworks!
  useEffect(() => {
    const onKeyDown = (e) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': keys.current.w = true; break;
        case 'KeyA': case 'ArrowLeft': keys.current.a = true; break;
        case 'KeyS': case 'ArrowDown': keys.current.s = true; break;
        case 'KeyD': case 'ArrowRight': keys.current.d = true; break;
        case 'Space': keys.current.space = true; break;
        case 'KeyC': case 'ShiftLeft': case 'ShiftRight': keys.current.crouch = true; break;
        case 'KeyE':
          triggerInteraction();
          break;
      }
    };

    const onKeyUp = (e) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': keys.current.w = false; break;
        case 'KeyA': case 'ArrowLeft': keys.current.a = false; break;
        case 'KeyS': case 'ArrowDown': keys.current.s = false; break;
        case 'KeyD': case 'ArrowRight': keys.current.d = false; break;
        case 'Space': keys.current.space = false; break;
        case 'KeyC': case 'ShiftLeft': case 'ShiftRight': keys.current.crouch = false; break;
      }
    };

    const onMouseDown = () => {
      if (!isMobile) {
        triggerInteraction();
      }
    };
    
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('mousedown', onMouseDown);
    
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, [onInteractE, onSelectArt]);

  // Handle mobile jump trigger
  useEffect(() => {
    if (mobileJumpTrigger > 0) {
      const isLevel2 = camera.position.y >= 10;
      const baseFloorY = isLevel2 ? 15.8 : NORMAL_HEIGHT;
      const canJump = camera.position.y <= baseFloorY + 0.1;
      if (canJump) {
        velocity.current.y = JUMP_FORCE;
      }
    }
  }, [mobileJumpTrigger]);

  // Handle mobile interact trigger
  useEffect(() => {
    if (mobileInteractTrigger > 0) {
      triggerInteraction();
    }
  }, [mobileInteractTrigger]);

  // Teleport effect with multi-level Y support
  useEffect(() => {
    if (teleportTarget) {
      camera.position.set(teleportTarget[0], teleportTarget[1] || NORMAL_HEIGHT, teleportTarget[2]);
      velocity.current.set(0, 0, 0);
    }
  }, [teleportTarget, camera]);

  useFrame((state, delta) => {
    camera.getWorldDirection(_viewDir);

    // 1. Raycast Target Check for AI Assistant & Overhead Speech Bubble
    // Hysteresis calculation (enter at 0.83, exit at 0.74) eliminates boundary glitching/flickering!
    const distToNpc = camera.position.distanceTo(_npcBodyPos);
    let isLookingAtNpc = false;

    if (distToNpc <= 8.5) {
      _toNpcBody.copy(_npcBodyPos).sub(camera.position).normalize();
      _toNpcBubble.copy(_npcBubblePos).sub(camera.position).normalize();

      const dotBody = _viewDir.dot(_toNpcBody);
      const dotBubble = _viewDir.dot(_toNpcBubble);
      const maxDot = Math.max(dotBody, dotBubble);

      const threshold = prevLookingAtNpc.current ? 0.74 : 0.83;
      isLookingAtNpc = maxDot > threshold;
    }
    prevLookingAtNpc.current = isLookingAtNpc;
    isLookingAtNPCRef.current = isLookingAtNpc;

    // 2. Zero-Allocation Raycast Check for Artworks (Distance <= 8.5m, Dot > 0.94)
    let bestArt = null;
    let bestDot = 0.94;

    const list = parsedArtworks.current;
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const distToArt = camera.position.distanceTo(item.vec);

      if (distToArt <= 8.5) {
        _toArt.copy(item.vec).sub(camera.position).normalize();
        const dotArt = _viewDir.dot(_toArt);
        if (dotArt > bestDot) {
          bestDot = dotArt;
          bestArt = item.art;
        }
      }
    }
    lookingAtArtRef.current = bestArt;

    // Highlight crosshair and determine type of interactive target
    const isInteractive = isLookingAtNpc || Boolean(bestArt);
    if (onLookingAtNPC) {
      onLookingAtNPC(isInteractive);
    }

    if (onInteractTypeChange) {
      const type = isLookingAtNpc ? 'bot' : (bestArt ? 'art' : null);
      onInteractTypeChange(type);
    }

    // Determine level floor base (Level 1 base = 3.8m, Level 2 Penthouse base = 15.8m)
    const isLevel2 = camera.position.y >= 10;
    const baseFloorY = isLevel2 ? 15.8 : NORMAL_HEIGHT;

    const isCrouching = keys.current.crouch || mobileCrouched;
    const targetHeight = isCrouching ? baseFloorY - 1.8 : baseFloorY;
    const currentSpeed = isCrouching ? SPEED * 0.5 : SPEED;

    // ── Apply Gravity & Vertical Movement (Shared for Mobile & Desktop!) ──
    velocity.current.y -= GRAVITY * delta;
    camera.position.y += velocity.current.y * delta;

    // Snap to floor boundary (Shared for Mobile & Desktop!)
    if (camera.position.y <= targetHeight) {
      camera.position.y = targetHeight;
      if (velocity.current.y < 0) {
        velocity.current.y = 0;
      }
    }

    // ── Zero-Allocation Touch Controls Handler ──
    if (isMobile) {
      const moveVec = mobileMoveVectorRef?.current;
      const lookDelta = mobileLookDeltaRef?.current;

      if (lookDelta && (lookDelta.x !== 0 || lookDelta.y !== 0)) {
        const sensitivity = 0.0058;
        yaw.current -= lookDelta.x * sensitivity;
        pitch.current -= lookDelta.y * sensitivity;
        pitch.current = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, pitch.current));

        // Consume look delta immediately
        lookDelta.x = 0;
        lookDelta.y = 0;
      }

      camera.rotation.set(pitch.current, yaw.current, 0, 'YXZ');

      if (enabled && moveVec && (moveVec.x !== 0 || moveVec.y !== 0)) {
        const touchSpeed = 12 * delta;
        const sin = Math.sin(yaw.current);
        const cos = Math.cos(yaw.current);

        const forwardX = -sin;
        const forwardZ = -cos;
        const rightX = cos;
        const rightZ = -sin;

        const moveX = (rightX * moveVec.x - forwardX * moveVec.y) * touchSpeed;
        const moveZ = (rightZ * moveVec.x - forwardZ * moveVec.y) * touchSpeed;

        // Move X & check validity
        camera.position.x += moveX;
        if (!checkPositionValid(camera.position.x, camera.position.z)) {
          camera.position.x -= moveX;
        }

        // Move Z & check validity
        camera.position.z += moveZ;
        if (!checkPositionValid(camera.position.x, camera.position.z)) {
          camera.position.z -= moveZ;
        }
      }

      // Exit early on touch devices so desktop WASD PointerLock controls don't run
      return;
    }

    if (!controlsRef.current || !controlsRef.current.isLocked || !enabled) return;

    // Sync yaw & pitch on desktop
    yaw.current = camera.rotation.y;
    pitch.current = camera.rotation.x;

    // Dampen velocity
    velocity.current.x -= velocity.current.x * 10.0 * delta;
    velocity.current.z -= velocity.current.z * 10.0 * delta;

    direction.current.z = Number(keys.current.w) - Number(keys.current.s);
    direction.current.x = Number(keys.current.d) - Number(keys.current.a);
    direction.current.normalize();

    if (keys.current.w || keys.current.s) velocity.current.z -= direction.current.z * currentSpeed * delta;
    if (keys.current.a || keys.current.d) velocity.current.x -= direction.current.x * currentSpeed * delta;

    // Move X first & check validity for smooth wall sliding
    controlsRef.current.moveRight(-velocity.current.x * delta);
    if (!checkPositionValid(camera.position.x, camera.position.z)) {
      controlsRef.current.moveRight(velocity.current.x * delta);
    }

    // Move Z second & check validity
    controlsRef.current.moveForward(-velocity.current.z * delta);
    if (!checkPositionValid(camera.position.x, camera.position.z)) {
      controlsRef.current.moveForward(velocity.current.z * delta);
    }
    
    // Desktop Jump Mechanics (Spacebar)
    const canJump = camera.position.y <= targetHeight + 0.1;
    if (canJump && keys.current.space) {
      velocity.current.y = JUMP_FORCE;
    }
  });

  if (isMobile) return null;
  return <PointerLockControls ref={controlsRef} />;
};

export default Player;
