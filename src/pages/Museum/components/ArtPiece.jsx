import React, { useState, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { textureCache } from '../utils/TextureCache';
import { getLODImageUrls } from '@utils/imageUtils';

const ArtPiece = ({ media, position = [0, 4.5, 0], rotation = [0, 0, 0], width = 4.8, height = 3.5, onClick, onHover, onUnhover }) => {
  const [texture, setTexture] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lodLevel, setLodLevel] = useState('low'); // 'low' or 'high'
  const { camera } = useThree();

  const isHidden = media.is_visible === false;
  const isMobile = typeof window !== 'undefined' && (window.innerWidth <= 1024 || 'ontouchstart' in window);
  const urls = useMemo(() => getLODImageUrls(media.url, isMobile), [media.url, isMobile]);

  useFrame(() => {
    if (isHidden) return;
    
    // Calculate distance squared (faster than Math.sqrt) from camera to artwork's world position
    const dx = camera.position.x - position[0];
    const dz = camera.position.z - position[2];
    const distSq = dx * dx + dz * dz;
    
    if (distSq < 100) { // < 10 meters: Upgrade to HD
      if (lodLevel !== 'high') setLodLevel('high');
    } else if (distSq > 225) { // > 15 meters: Downgrade to Low-Res to save VRAM
      if (lodLevel !== 'low') setLodLevel('low');
    }
  });

  useEffect(() => {
    let isMounted = true;
    
    const targetUrl = lodLevel === 'high' ? urls.highRes : urls.lowRes;

    // If downgrading, nuke the HD texture from GPU memory!
    if (lodLevel === 'low' && urls.highRes) {
      textureCache.unload(urls.highRes);
    }

    const cached = textureCache.get(targetUrl);
    if (cached) {
      setTexture(cached);
      setLoading(false);
      return;
    }

    // Only show loading spinner if it's the high-res loading, keep low-res visible while loading HD
    if (!texture) setLoading(true);

    textureCache.load(targetUrl).then((tex) => {
      if (isMounted) {
        setTexture(tex);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [lodLevel, urls]);

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
      {/* <spotLight
        position={[0, frameH / 2 + 0.8, 1.6]}
        target-position={[0, 0, 0]}
        angle={Math.PI / 4}
        penumbra={0.3}
        intensity={2.2}
        color="#fffcf5"
      /> */}

      {/* Dynamic Picture Frame Group */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          if (typeof document !== 'undefined' && !document.pointerLockElement && !('ontouchstart' in window) && window.innerWidth > 768) return;
          // Proximity Enforcement: Only allow inspecting artwork if player is close (distance <= 8.5m)!
          if (e.distance && e.distance > 8.5) return;
          if (onClick) onClick(media);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (e.distance && e.distance <= 8.5) {
            setHovered(true);
            if (onHover) onHover(media);
          }
        }}
        onPointerOut={() => {
          setHovered(false);
          if (onUnhover) onUnhover();
        }}
      >
        {/* Outer Wooden Picture Frame Bars */}
        <mesh position={[0, frameH / 2 + 0.1, 0]}>
          <boxGeometry args={[frameW + 0.4, 0.2, 0.15]} />
          <meshLambertMaterial color={hovered ? '#452a1a' : '#2a1810'} />
        </mesh>
        <mesh position={[0, -frameH / 2 - 0.1, 0]}>
          <boxGeometry args={[frameW + 0.4, 0.2, 0.15]} />
          <meshLambertMaterial color={hovered ? '#452a1a' : '#2a1810'} />
        </mesh>
        <mesh position={[-frameW / 2 - 0.1, 0, 0]}>
          <boxGeometry args={[0.2, frameH, 0.15]} />
          <meshLambertMaterial color={hovered ? '#452a1a' : '#2a1810'} />
        </mesh>
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

        {/* Artpiece Title & Caption Display Board below frame */}
        {media.title && (
          <group position={[0, -frameH / 2 - 0.45, 0.05]}>
            <mesh position={[0, 0, -0.01]}>
              <planeGeometry args={[Math.min(frameW, 3.8), 0.45]} />
              <meshBasicMaterial color="#09090b" opacity={0.88} transparent />
            </mesh>
            <Text
              position={[0, 0.08, 0.01]}
              fontSize={0.16}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              maxWidth={3.6}
            >
              {media.title}
            </Text>
            {media.caption && (
              <Text
                position={[0, -0.09, 0.01]}
                fontSize={0.11}
                color="#a1a1aa"
                anchorX="center"
                anchorY="middle"
                maxWidth={3.6}
              >
                {media.caption}
              </Text>
            )}
          </group>
        )}

        {/* Hidden Badge for Admins */}
        {isHidden && (
          <Text
            position={[0, frameH / 2 + 0.5, 0.05]}
            fontSize={0.25}
            color="#ef4444"
            anchorX="center"
            anchorY="middle"
          >
            [ HIDDEN ]
          </Text>
        )}
      </group>
    </group>
  );
};

export default ArtPiece;
