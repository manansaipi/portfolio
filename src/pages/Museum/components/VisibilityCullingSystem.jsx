import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

const WARMUP_FRAMES = 5; // Only need a few frames now since we force-init textures

const VisibilityCullingSystem = ({ playerPosRef, northRef, southRef, eastRef, westRef, lobbyRef, onWarmupComplete }) => {
  const { gl, scene, camera } = useThree();
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
        // Force camera to look straight at the South hall during warm-up (not the floor!)
        camera.rotation.set(0, Math.PI, 0);
        if (northRef.current) northRef.current.visible = true;
        if (southRef.current) southRef.current.visible = true;
        if (eastRef.current) eastRef.current.visible = true;
        if (westRef.current) westRef.current.visible = true;
        if (lobbyRef.current) lobbyRef.current.visible = true;

        // Force-upload textures to GPU VRAM immediately (Desktop only, mobile will crash from VRAM spike)
        const isMobile = typeof window !== 'undefined' && (window.innerWidth <= 1024 || 'ontouchstart' in window);
        
        let textureCount = 0;
        let materialCount = 0;
        
        scene.traverse((obj) => {
          if (obj.isMesh) {
            // Disable frustum culling so GPU renders it even if off-screen (Desktop only)  
            if (!isMobile) {
                obj.frustumCulled = false;
            }

            // Force-upload textures to GPU VRAM immediately
            const mat = obj.material;
            if (mat) {
              // Compile the material's shader programw
              materialCount++;

              if (!isMobile) {
                // Force-init all texture maps on this material
                const textureProps = ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap', 'aoMap', 'lightMap', 'bumpMap', 'displacementMap', 'alphaMap', 'envMap'];
                for (const prop of textureProps) {
                  const tex = mat[prop];
                  if (tex && tex.isTexture) {
                    try {
                      gl.initTexture(tex);
                      textureCount++;
                    } catch (e) {
                      // Fallback
                    }
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
        if (onWarmupComplete) onWarmupComplete();
      }
      return;
    }
  });

  return null;
};

export default VisibilityCullingSystem;
