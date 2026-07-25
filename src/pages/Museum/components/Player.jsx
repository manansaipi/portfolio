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

const Player = ({ position = [0, 3.8, 0], teleportTarget, enabled = true }) => {
  const { camera } = useThree();
  const controlsRef = useRef();

  const keys = useRef({ w: false, a: false, s: false, d: false, space: false, crouch: false });
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  
  const SPEED = 180;
  const NORMAL_HEIGHT = 3.8;
  const CROUCH_HEIGHT = 2.0;
  const JUMP_FORCE = 11;
  const GRAVITY = 28;

  useEffect(() => {
    camera.position.set(position[0], position[1] || NORMAL_HEIGHT, position[2]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera]);

  // Handle Pointer Lock events to ensure cursor is ALWAYS visible when unlocked (ESC)
  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': keys.current.w = true; break;
        case 'KeyA': case 'ArrowLeft': keys.current.a = true; break;
        case 'KeyS': case 'ArrowDown': keys.current.s = true; break;
        case 'KeyD': case 'ArrowRight': keys.current.d = true; break;
        case 'Space': keys.current.space = true; break;
        case 'KeyC': case 'ShiftLeft': case 'ShiftRight': keys.current.crouch = true; break;
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
    
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  // Teleport effect with multi-level Y support
  useEffect(() => {
    if (teleportTarget) {
      camera.position.set(teleportTarget[0], teleportTarget[1] || NORMAL_HEIGHT, teleportTarget[2]);
      velocity.current.set(0, 0, 0);
    }
  }, [teleportTarget, camera]);

  useFrame((state, delta) => {
    if (!controlsRef.current || !controlsRef.current.isLocked || !enabled) return;

    // Determine level floor base (Level 1 base = 3.8m, Level 2 Penthouse base = 15.8m)
    const isLevel2 = camera.position.y >= 10;
    const baseFloorY = isLevel2 ? 15.8 : NORMAL_HEIGHT;

    const targetHeight = keys.current.crouch ? baseFloorY - 1.8 : baseFloorY;
    const currentSpeed = keys.current.crouch ? SPEED * 0.5 : SPEED;

    // Dampen velocity
    velocity.current.x -= velocity.current.x * 10.0 * delta;
    velocity.current.z -= velocity.current.z * 10.0 * delta;
    
    // Apply gravity
    velocity.current.y -= GRAVITY * delta;

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
    
    // Jump mechanics
    const canJump = camera.position.y <= targetHeight + 0.1;
    if (canJump && keys.current.space) {
      velocity.current.y = JUMP_FORCE;
    }
    
    camera.position.y += velocity.current.y * delta;
    
    // Floor boundary per level
    if (camera.position.y <= targetHeight) {
      camera.position.y = targetHeight;
      if (velocity.current.y < 0) {
        velocity.current.y = 0;
      }
    }
  });

  return <PointerLockControls ref={controlsRef} />;
};

export default Player;
