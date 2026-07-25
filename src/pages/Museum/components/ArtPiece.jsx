import React, { useState, useEffect } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { textureCache } from '../utils/TextureCache';
import { resolveImg } from '@utils/imageUtils';

const ArtPiece = ({ media, position = [0, 4.5, 0], rotation = [0, 0, 0], width = 4.8, height = 3.5, onClick }) => {
  const [texture, setTexture] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(true);

  const imgUrl = resolveImg(media.url);

  useEffect(() => {
    let isMounted = true;

    const cached = textureCache.get(imgUrl);
    if (cached) {
      setTexture(cached);
      setLoading(false);
      return;
    }

    textureCache.load(imgUrl).then((tex) => {
      if (isMounted) {
        setTexture(tex);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [imgUrl]);

  return (
    <group position={position} rotation={rotation}>
      {/* Light Source Focused on Art Piece */}
      <spotLight
        position={[0, height / 2 + 0.8, 1.6]}
        target-position={[0, 0, 0]}
        angle={Math.PI / 4}
        penumbra={0.3}
        intensity={2.2}
        color="#fffcf5"
      />

      {/* Picture Frame Group */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          // Only trigger inspect lightbox if pointer lock is ALREADY active
          if (document.pointerLockElement) {
            document.exitPointerLock();
            if (onClick) onClick(media);
          }
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => {
          setHovered(false);
        }}
      >
        {/* Outer Wooden Picture Frame (4 Thin Box Bars around the Artwork) */}
        {/* Top Frame Bar */}
        <mesh position={[0, height / 2 + 0.1, 0]}>
          <boxGeometry args={[width + 0.4, 0.2, 0.15]} />
          <meshLambertMaterial color={hovered ? '#452a1a' : '#2a1810'} />
        </mesh>
        {/* Bottom Frame Bar */}
        <mesh position={[0, -height / 2 - 0.1, 0]}>
          <boxGeometry args={[width + 0.4, 0.2, 0.15]} />
          <meshLambertMaterial color={hovered ? '#452a1a' : '#2a1810'} />
        </mesh>
        {/* Left Frame Bar */}
        <mesh position={[-width / 2 - 0.1, 0, 0]}>
          <boxGeometry args={[0.2, height, 0.15]} />
          <meshLambertMaterial color={hovered ? '#452a1a' : '#2a1810'} />
        </mesh>
        {/* Right Frame Bar */}
        <mesh position={[width / 2 + 0.1, 0, 0]}>
          <boxGeometry args={[0.2, height, 0.15]} />
          <meshLambertMaterial color={hovered ? '#452a1a' : '#2a1810'} />
        </mesh>

        {/* Backboard */}
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[width + 0.1, height + 0.1]} />
          <meshLambertMaterial color="#111111" />
        </mesh>

        {/* Actual Image Canvas Surface */}
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[width, height]} />
          {texture ? (
            <meshBasicMaterial map={texture} />
          ) : (
            <meshLambertMaterial color="#222222" />
          )}
        </mesh>

        {/* Loading Indicator */}
        {loading && (
          <Text position={[0, 0, 0.05]} fontSize={0.25} color="#888888" anchorX="center" anchorY="middle">
            Loading Exhibit...
          </Text>
        )}

        {/* Hover Highlight Ring Frame */}
        {hovered && (
          <mesh position={[0, 0, 0.02]}>
            <planeGeometry args={[width + 0.05, height + 0.05]} />
            <meshBasicMaterial color="#38bdf8" wireframe />
          </mesh>
        )}
      </group>

      {/* Exhibit Label Below Frame */}
      <group position={[0, -height / 2 - 0.5, 0.05]}>
        <Text
          fontSize={0.22}
          color="#ffffff"
          anchorX="center"
          anchorY="top"
          maxWidth={width}
        >
          {media.title || 'Untitled Work'}
        </Text>
        {media.caption && (
          <Text
            position={[0, -0.3, 0]}
            fontSize={0.14}
            color="#a1a1aa"
            anchorX="center"
            anchorY="top"
            maxWidth={width}
          >
            {media.caption}
          </Text>
        )}
      </group>
    </group>
  );
};

export default ArtPiece;
