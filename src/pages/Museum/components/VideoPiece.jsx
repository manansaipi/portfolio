import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { resolveImg } from '@utils/imageUtils';

const VideoPiece = ({ media, position, rotation, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef(null);
  const [videoTexture, setVideoTexture] = useState(null);

  const videoUrl = useMemo(() => resolveImg(media.url), [media.url]);

  useEffect(() => {
    const vid = document.createElement('video');
    vid.src = videoUrl;
    vid.crossOrigin = 'Anonymous';
    vid.loop = true;
    vid.muted = true;
    vid.playsInline = true;
    vid.play().catch(e => console.log("Autoplay blocked:", e));

    const texture = new THREE.VideoTexture(vid);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    
    videoRef.current = vid;
    setVideoTexture(texture);

    return () => {
      vid.pause();
      vid.removeAttribute('src');
      vid.load();
      texture.dispose();
    };
  }, [videoUrl]);

  const width = 4.0;
  const height = 2.25; // 16:9 ratio

  return (
    <group position={position} rotation={rotation}>
      {/* Spotlight */}
      {/* <spotLight
        position={[0, height / 2 + 1.0, 1.5]}
        target-position={[0, 0, 0]}
        angle={Math.PI / 4}
        penumbra={0.3}
        intensity={2.0}
        color="#e6f0ff"
      /> */}

      <group
        onClick={(e) => {
          e.stopPropagation();
          if (typeof document !== 'undefined' && !document.pointerLockElement && !('ontouchstart' in window) && window.innerWidth > 768) return;
          // Proximity Enforcement: Only allow inspecting video if player is close (distance <= 8.5m)!
          if (e.distance && e.distance > 8.5) return;
          if (onClick) onClick(media);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (e.distance && e.distance <= 8.5) {
            setHovered(true);
          }
        }}
        onPointerOut={() => {
          setHovered(false);
        }}
      >
        {/* Sleek Dark Frame */}
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[width + 0.2, height + 0.2, 0.1]} />
          <meshLambertMaterial color={hovered ? '#1e293b' : '#0f172a'} />
        </mesh>

        {/* Video Canvas */}
        <mesh position={[0, 0, 0.05]}>
          <planeGeometry args={[width, height]} />
          {videoTexture ? (
            <meshBasicMaterial map={videoTexture} />
          ) : (
            <meshBasicMaterial color="#000000" />
          )}
        </mesh>

        {/* Label */}
        {media.title && (
          <Text
            position={[0, -height / 2 - 0.25, 0.06]}
            fontSize={0.14}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            maxWidth={3.8}
          >
            {media.title}
          </Text>
        )}
      </group>
    </group>
  );
};

export default VideoPiece;
