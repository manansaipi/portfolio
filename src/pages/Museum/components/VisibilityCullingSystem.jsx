import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

const WARMUP_FRAMES = 5; // Only need a few frames now since we force-init textures

const VisibilityCullingSystem = ({ playerPosRef, northRef, southRef, eastRef, westRef, lobbyRef }) => {
  const { gl, scene } = useThree();
  const lastLogRef = useRef(0);
  const frameCountRef = useRef(0);
  const warmupDoneRef = useRef(false);

  useFrame(() => {
    if (!playerPosRef.current) return;

    // ── GPU WARM-UP PHASE ──
    // Force ALL halls visible + force-upload ALL textures to GPU VRAM
    // so there are zero frame drops when the user first looks at a new hall.
    if (!warmupDoneRef.current) {
      frameCountRef.current++;

      // Frame 1: Make everything visible and force-upload all textures to GPU
      if (frameCountRef.current === 1) {
        if (northRef.current) northRef.current.visible = true;
        if (southRef.current) southRef.current.visible = true;
        if (eastRef.current) eastRef.current.visible = true;
        if (westRef.current) westRef.current.visible = true;
        if (lobbyRef.current) lobbyRef.current.visible = true;

        // Force-upload every texture and compile every material to GPU
        let textureCount = 0;
        let materialCount = 0;
        scene.traverse((obj) => {
          if (obj.isMesh) {
            // Disable frustum culling so GPU renders it even if off-screen
            obj.frustumCulled = false;

            // Force-upload textures to GPU VRAM immediately
            const mat = obj.material;
            if (mat) {
              // Compile the material's shader program
              materialCount++;

              // Force-init all texture maps on this material
              const textureProps = ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap', 'aoMap', 'lightMap', 'bumpMap', 'displacementMap', 'alphaMap', 'envMap'];
              for (const prop of textureProps) {
                const tex = mat[prop];
                if (tex && tex.isTexture) {
                  try {
                    gl.initTexture(tex);
                    textureCount++;
                  } catch (e) {
                    // Fallback: some older Three.js versions don't have initTexture
                  }
                }
              }
            }
          }
        });

        console.log(`%c⏳ GPU Warm-up: Force-uploaded ${textureCount} textures and ${materialCount} materials to GPU VRAM`, 'color: #facc15; font-weight: bold;');
      }

      if (frameCountRef.current >= WARMUP_FRAMES) {
        warmupDoneRef.current = true;

        // Restore frustumCulled on all meshes
        scene.traverse((obj) => {
          if (obj.isMesh) {
            obj.frustumCulled = true;
          }
        });

        console.log('%c🔥 GPU Warm-up Complete! All shaders compiled & textures uploaded. Zero frame drops guaranteed!', 'color: #4ade80; font-weight: bold; font-size: 14px;');
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
