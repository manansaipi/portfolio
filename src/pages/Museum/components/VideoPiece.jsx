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
      <spotLight
        position={[0, height / 2 + 1.0, 1.5]}
        target-position={[0, 0, 0]}
        angle={Math.PI / 4}
        penumbra={0.3}
        intensity={2.0}
        color="#e6f0ff"
      />

      <group
        onClick={(e) => {
          e.stopPropagation();
          if (onClick) onClick(media);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        {/* LED Display Casing */}
        <mesh position={[0, 0, -0.05]} castShadow receiveShadow>
          <boxGeometry args={[width + 0.2, height + 0.2, 0.1]} />
          <meshStandardMaterial color={hovered ? '#22252a' : '#111317'} metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Video Screen */}
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[width, height]} />
          {videoTexture ? (
            <meshBasicMaterial map={videoTexture} />
          ) : (
            <meshStandardMaterial color="#050505" />
          )}
        </mesh>

        {/* Screen Title Plaque */}
        <group position={[0, -height / 2 - 0.25, 0.02]}>
          <Text
            position={[0, 0, 0]}
            fontSize={0.08}
            color={hovered ? '#60a5fa' : '#9ca3af'}
            anchorX="center"
            anchorY="middle"
          >
            ▶ {media.title || 'Video Exhibit'}
          </Text>
        </group>
      </group>
    </group>
  );
};

export default VideoPiece;
