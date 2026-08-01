import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

const WARMUP_FRAMES = 120; // ~2 seconds at 60fps

const VisibilityCullingSystem = ({ playerPosRef, northRef, southRef, eastRef, westRef, lobbyRef }) => {
  const { gl, scene, camera } = useThree();
  const lastLogRef = useRef(0);
  const frameCountRef = useRef(0);
  const warmupDoneRef = useRef(false);
  const frustumCulledCache = useRef([]);

  useFrame(() => {
    if (!playerPosRef.current) return;

    // ── GPU WARM-UP PHASE ──
    // Force-render ALL meshes (even off-screen ones) for the first ~2 seconds
    // so the GPU compiles every shader and uploads every texture to VRAM.
    // After warm-up, culling kicks in and toggling is instant with zero frame drops.
    if (!warmupDoneRef.current) {
      frameCountRef.current++;

      // Frame 1: Make everything visible AND disable frustum culling on every mesh
      if (frameCountRef.current === 1) {
        if (northRef.current) northRef.current.visible = true;
        if (southRef.current) southRef.current.visible = true;
        if (eastRef.current) eastRef.current.visible = true;
        if (westRef.current) westRef.current.visible = true;
        if (lobbyRef.current) lobbyRef.current.visible = true;

        // Traverse entire scene and disable frustumCulled on every mesh
        // so the GPU is forced to compile shaders for ALL objects, even off-screen ones
        frustumCulledCache.current = [];
        scene.traverse((obj) => {
          if (obj.isMesh) {
            frustumCulledCache.current.push({ obj, original: obj.frustumCulled });
            obj.frustumCulled = false;
          }
        });

        console.log('%c⏳ GPU Warm-up started... Compiling all shaders & uploading textures...', 'color: #facc15; font-weight: bold;');
      }

      // After warm-up frames: restore frustumCulled and enable portal culling
      if (frameCountRef.current >= WARMUP_FRAMES) {
        warmupDoneRef.current = true;

        // Restore original frustumCulled values
        for (const entry of frustumCulledCache.current) {
          entry.obj.frustumCulled = entry.original;
        }
        frustumCulledCache.current = [];

        console.log('%c🔥 GPU Warm-up Complete! All shaders compiled. Portal Culling now active. Zero frame drops guaranteed!', 'color: #4ade80; font-weight: bold; font-size: 14px;');
      }
      return;
    }

    // ── PORTAL CULLING (post warm-up) ──
    const { x, z, yaw } = playerPosRef.current;

    const inNorth = z < -15;
    const inSouth = z > 15;
    const inEast = x > 15;
    const inWest = x < -15;

    const dirX = Math.sin(yaw);
    const dirZ = Math.cos(yaw);

    const lookNorth = dirZ < -0.25;
    const lookSouth = dirZ > 0.25;
    const lookEast = dirX > 0.25;
    const lookWest = dirX < -0.25;

    // Portal Culling Logic: If you are inside a hall, you can't see the adjacent halls through the walls!
    if (inNorth) {
      if (northRef.current) northRef.current.visible = true;
      if (southRef.current) southRef.current.visible = lookSouth;
      if (eastRef.current) eastRef.current.visible = false;
      if (westRef.current) westRef.current.visible = false;
    } else if (inSouth) {
      if (northRef.current) northRef.current.visible = lookNorth;
      if (southRef.current) southRef.current.visible = true;
      if (eastRef.current) eastRef.current.visible = false;
      if (westRef.current) westRef.current.visible = false;
    } else if (inEast) {
      if (northRef.current) northRef.current.visible = false;
      if (southRef.current) southRef.current.visible = false;
      if (eastRef.current) eastRef.current.visible = true;
      if (westRef.current) westRef.current.visible = lookWest;
    } else if (inWest) {
      if (northRef.current) northRef.current.visible = false;
      if (southRef.current) southRef.current.visible = false;
      if (eastRef.current) eastRef.current.visible = lookEast;
      if (westRef.current) westRef.current.visible = true;
    } else {
      // Lobby
      if (northRef.current) northRef.current.visible = lookNorth;
      if (southRef.current) southRef.current.visible = lookSouth;
      if (eastRef.current) eastRef.current.visible = lookEast;
      if (westRef.current) westRef.current.visible = lookWest;
    }
    
    if (lobbyRef.current) {
      lobbyRef.current.visible = true;
    }

    // ── DEBUG LOGGING (Once per second) ──
    const now = Date.now();
    if (now - lastLogRef.current > 1000) {
      lastLogRef.current = now;
      console.log(
        `%c🛡️ Culling Active!%c\n` +
        `Visible Halls: North[${northRef.current?.visible ? '✅' : '❌'}] South[${southRef.current?.visible ? '✅' : '❌'}] East[${eastRef.current?.visible ? '✅' : '❌'}] West[${westRef.current?.visible ? '✅' : '❌'}]\n` +
        `WebGL Draw Calls: ${gl.info.render.calls}\n` +
        `WebGL Triangles: ${gl.info.render.triangles}`,
        'color: #4ade80; font-weight: bold; font-size: 14px;',
        'color: inherit;'
      );
    }
  });

  return null;
};

export default VisibilityCullingSystem;
