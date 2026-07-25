import React, { useState, useEffect } from 'react';
import { Text } from '@react-three/drei';
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

  // Compute dynamic frame width and height based on the loaded image's actual aspect ratio!
  let frameW = width;
  let frameH = height;

  if (texture && texture.image && texture.image.width && texture.image.height) {
    const aspect = texture.image.width / texture.image.height;
    if (aspect < 0.95) {
      // 📱 Portrait Orientation (e.g. 3:4, 9:16)
      frameH = 4.2;
      frameW = Math.max(2.2, Math.min(4.2 * aspect, 3.6));
    } else {
      // 🖼️ Landscape / Square Orientation (e.g. 4:3, 16:9, 1:1)
      frameW = 4.8;
      frameH = Math.max(2.4, Math.min(4.8 / aspect, 4.2));
    }
  }

  return (
    <group position={position} rotation={rotation}>
      {/* Spotlight Focused on Art Piece */}
      <spotLight
        position={[0, frameH / 2 + 0.8, 1.6]}
        target-position={[0, 0, 0]}
        angle={Math.PI / 4}
        penumbra={0.3}
        intensity={2.2}
        color="#fffcf5"
      />

      {/* Dynamic Picture Frame Group */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          if (onClick) onClick(media);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => {
          setHovered(false);
        }}
      >
        {/* Outer Wooden Picture Frame Bars */}
        {/* Top Frame Bar */}
        <mesh position={[0, frameH / 2 + 0.1, 0]}>
          <boxGeometry args={[frameW + 0.4, 0.2, 0.15]} />
          <meshLambertMaterial color={hovered ? '#452a1a' : '#2a1810'} />
        </mesh>
        {/* Bottom Frame Bar */}
        <mesh position={[0, -frameH / 2 - 0.1, 0]}>
          <boxGeometry args={[frameW + 0.4, 0.2, 0.15]} />
          <meshLambertMaterial color={hovered ? '#452a1a' : '#2a1810'} />
        </mesh>
        {/* Left Frame Bar */}
        <mesh position={[-frameW / 2 - 0.1, 0, 0]}>
          <boxGeometry args={[0.2, frameH, 0.15]} />
          <meshLambertMaterial color={hovered ? '#452a1a' : '#2a1810'} />
        </mesh>
        {/* Right Frame Bar */}
        <mesh position={[frameW / 2 + 0.1, 0, 0]}>
          <boxGeometry args={[0.2, frameH, 0.15]} />
          <meshLambertMaterial color={hovered ? '#452a1a' : '#2a1810'} />
        </mesh>

        {/* Backboard */}
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[frameW + 0.1, frameH + 0.1]} />
          <meshLambertMaterial color="#111111" />
        </mesh>

        {/* Image Canvas Surface */}
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[frameW, frameH]} />
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

        {/* Clean Rectangular Blue Hover Border */}
        {hovered && (
          <group position={[0, 0, 0.02]}>
            <mesh position={[0, frameH / 2 + 0.02, 0]}>
              <planeGeometry args={[frameW + 0.1, 0.04]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
            <mesh position={[0, -frameH / 2 - 0.02, 0]}>
              <planeGeometry args={[frameW + 0.1, 0.04]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
            <mesh position={[-frameW / 2 - 0.02, 0, 0]}>
              <planeGeometry args={[0.04, frameH + 0.1]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
            <mesh position={[frameW / 2 + 0.02, 0, 0]}>
              <planeGeometry args={[0.04, frameH + 0.1]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
          </group>
        )}
      </group>

      {/* Exhibit Label Below Frame */}
      <group position={[0, -frameH / 2 - 0.5, 0.05]}>
        <Text
          fontSize={0.22}
          color="#ffffff"
          anchorX="center"
          anchorY="top"
          maxWidth={frameW}
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
            maxWidth={frameW}
          >
            {media.caption}
          </Text>
        )}
      </group>
    </group>
  );
};

export default ArtPiece;
