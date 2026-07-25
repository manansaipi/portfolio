import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { Helmet } from 'react-helmet-async';
import { Image as AntdImage } from 'antd';
import ErrorBoundary3D from './components/ErrorBoundary3D';
import GalleryRoom from './components/GalleryRoom';
import LobbyDecoration from './components/LobbyDecoration';
import MuseumLighting from './components/MuseumLighting';
import ArtPiece from './components/ArtPiece';
import VideoPiece from './components/VideoPiece';
import BotAssistantNPC from './components/BotAssistantNPC';
import BotAssistantModal from './components/BotAssistantModal';
import DrawingStudioModal from './components/DrawingStudioModal';
import Player from './components/Player';
import MuseumMapHUD from './components/MuseumMapHUD';
import NatureHallDecoration from './components/NatureHallDecoration';
import ProfessionalHallDecoration from './components/ProfessionalHallDecoration';
import AdventureHallDecoration from './components/AdventureHallDecoration';
import FamilyHallDecoration from './components/FamilyHallDecoration';
import { textureCache } from './utils/TextureCache';
import { HALL_CONFIG } from './utils/museumLayoutConfig';
import { resolveImg } from '@utils/imageUtils';
import { getGalleryMedia, getGalleryCategories } from '@services/gallery';
import { getGuestbookEntries, createGuestbookEntry } from '@services/guestbook';

const DEFAULT_WELCOME_SPEECH = "Hello! I am your AI Portfolio Assistant. Ask me anything about Abdul Mannan Saipi, his projects, skills, or this 3D museum!";

const Museum = () => {
  const [loadingState, setLoadingState] = useState('fetching');
  const [progress, setProgress] = useState(0);
  const [mediaItems, setMediaItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [guestbookEntries, setGuestbookEntries] = useState([]);
  const [selectedStudioSlot, setSelectedStudioSlot] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth <= 768);
  const [teleportTarget, setTeleportTarget] = useState(null);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isLookingAtNPC, setIsLookingAtNPC] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechText, setSpeechText] = useState(DEFAULT_WELCOME_SPEECH);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchGuestbook = async () => {
    try {
      const entries = await getGuestbookEntries(0, 500);
      setGuestbookEntries(entries);
    } catch (err) {
      console.warn('Failed to fetch guestbook:', err);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const [data, catData, gbData] = await Promise.all([
          getGalleryMedia(),
          getGalleryCategories(),
          getGuestbookEntries(0, 500).catch(() => [])
        ]);
        if (!isMounted) return;
        setMediaItems(data);
        setCategories(catData);
        setGuestbookEntries(gbData);

        if (isMobile) {
          setLoadingState('ready');
          return;
        }

        setLoadingState('preloading');
        const urls = data
          .filter(item => item.media_type === 'image')
          .map(item => resolveImg(item.url))
          .filter(Boolean);

        if (urls.length > 0) {
          await textureCache.preloadAll(urls, (loaded, total) => {
            if (isMounted) setProgress(Math.round((loaded / total) * 100));
          });
        }

        if (isMounted) setLoadingState('ready');
      } catch (err) {
        console.error('Error loading museum:', err);
        if (isMounted) setLoadingState('ready');
      }
    };

    init();

    return () => {
      isMounted = false;
      textureCache.dispose();
    };
  }, [isMobile]);

  // Handle Escape key & cursor visibility during image/AI focus
  useEffect(() => {
    if (selectedMedia || isAiChatOpen) {
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
      document.body.style.cursor = 'default';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedMedia) setSelectedMedia(null);
        if (selectedStudioSlot) setSelectedStudioSlot(null);
        if (isAiChatOpen) setIsAiChatOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMedia, selectedStudioSlot, isAiChatOpen]);

  // Map uploaded artworks to wall slots in the 4 exhibition halls
  const placedArtworks = useMemo(() => {
    const placed = [];
    const usedCounts = {};
    Object.keys(HALL_CONFIG).forEach(k => { usedCounts[k] = 0; });

    mediaItems.forEach((media) => {
      const category = media.category?.toLowerCase() || 'nature';
      const config = HALL_CONFIG[category] || HALL_CONFIG.nature;
      const catKey = config.slug;

      if (config.walls && usedCounts[catKey] < config.walls.length) {
        const wall = config.walls[usedCounts[catKey]];
        placed.push({ ...media, pos: wall.position, rot: wall.rotation });
        usedCounts[catKey]++;
      }
    });

    return placed;
  }, [mediaItems]);

  const navigateTo = (slug) => {
    if (slug === 'signature') {
      setTeleportTarget([0, 15.8, 0]); // Level 2 Rooftop Penthouse Signature Room
    } else {
      const config = HALL_CONFIG[slug];
      if (config) {
        setTeleportTarget([config.center[0], 3.8, config.center[2]]);
      } else {
        setTeleportTarget([0, 3.8, 0]); // Main Lobby
      }
    }
    setTimeout(() => setTeleportTarget(null), 150);
  };

  const handlePostDrawing = async (entryData) => {
    await createGuestbookEntry(entryData);
    await fetchGuestbook();
  };

  // ── 1. Loading Screen ──
  if (loadingState !== 'ready') {
    return (
      <div style={{
        position: 'fixed', inset: 0, background: '#09090b',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        color: '#ffffff', fontFamily: 'Inter, system-ui, sans-serif', zIndex: 100,
      }}>
        <Helmet><title>Loading 3D Museum...</title></Helmet>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '1.5rem', opacity: 0.9 }}>
          {loadingState === 'fetching' ? 'Fetching Exhibition Media...' : 'Initializing 3D Museum Environment'}
        </h2>
        <div style={{ width: '320px', height: '6px', background: '#27272a', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{
            width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
            borderRadius: '3px', transition: 'width 0.3s ease',
          }} />
        </div>
        <p style={{ marginTop: '0.85rem', fontSize: '0.85rem', opacity: 0.6 }}>{progress}% assets downloaded</p>
      </div>
    );
  }

  // ── 2. Mobile 2D Fallback ──
  if (isMobile) {
    return (
      <div style={{ background: '#09090b', color: '#ffffff', minHeight: '100vh', padding: '2rem 1rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <Helmet><title>3D Museum | Portfolio</title></Helmet>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Virtual Photography Museum</h1>
        <p style={{ opacity: 0.6, marginBottom: '2rem', fontSize: '0.9rem' }}>3D Museum walkthrough is optimized for desktop browsers. Displaying mobile grid view.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
          {mediaItems.map((item) => (
            <div key={item.id} style={{ borderRadius: '8px', overflow: 'hidden', background: '#18181b', border: '1px solid #27272a' }}>
              {item.media_type === 'video' ? (
                <video src={resolveImg(item.url)} autoPlay loop muted playsInline style={{ width: '100%', display: 'block' }} />
              ) : (
                <img src={resolveImg(item.url)} alt={item.title || ''} style={{ width: '100%', display: 'block' }} />
              )}
              <div style={{ padding: '0.6rem' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>{item.title || 'Untitled'}</p>
                {item.caption && <p style={{ fontSize: '0.75rem', opacity: 0.6, margin: '0.2rem 0 0' }}>{item.caption}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── 3. 3D Virtual Museum Engine (120 FPS High Refresh Rate Support!) ──
  return (
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', background: '#000000', zIndex: 0 }}>
      <Helmet><title>3D Virtual Museum | Portfolio</title></Helmet>

      <ErrorBoundary3D>
        <Canvas dpr={[1, 2]} camera={{ fov: 60, near: 0.01, far: 250, position: [0, 3.8, 0] }} gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}>
          <Suspense fallback={null}>
            <MuseumLighting />
            <group onClick={() => setSelectedMedia(null)}>
              <GalleryRoom categories={categories} />
              <LobbyDecoration categories={categories} onTeleportToLevel2={() => navigateTo('signature')} />
              <NatureHallDecoration />
              <ProfessionalHallDecoration />
              <AdventureHallDecoration />
              <FamilyHallDecoration />

              {/* 🤖 Taller Lobby AI Bot Assistant NPC */}
              <BotAssistantNPC
                onOpenChat={() => setIsAiChatOpen(true)}
                isSpeaking={isSpeaking}
                speechText={speechText}
                isLookingAtNPC={isLookingAtNPC}
              />

              {/* Placed Artworks */}
              {placedArtworks.map((art) => (
                art.media_type === 'video' ? (
                  <VideoPiece
                    key={art.id}
                    media={art}
                    position={art.pos}
                    rotation={art.rot}
                    onClick={(m) => {
                      setSelectedMedia(m);
                    }}
                  />
                ) : (
                  <ArtPiece
                    key={art.id}
                    media={art}
                    position={art.pos}
                    rotation={art.rot}
                    onClick={(m) => {
                      setSelectedMedia(m);
                    }}
                  />
                )
              ))}
            </group>

            <Player
              teleportTarget={teleportTarget}
              enabled={!selectedStudioSlot && !isAiChatOpen}
              onInteractE={() => setIsAiChatOpen(true)}
              onLookingAtNPC={setIsLookingAtNPC}
              placedArtworks={placedArtworks}
              onSelectArt={(media) => setSelectedMedia(media)}
            />
            <Preload all />
          </Suspense>
        </Canvas>
      </ErrorBoundary3D>

      {/* HUD Navigation Overlay */}
      <MuseumMapHUD
        categories={categories}
        onNavigate={navigateTo}
        isLookingAtNPC={isLookingAtNPC}
        onOpenAIChat={() => setIsAiChatOpen(true)}
      />

      {/* 🤖 Interactive AI Bot Assistant Chat Modal */}
      <BotAssistantModal
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        onSpeakingChange={setIsSpeaking}
        onSpeechTextChange={setSpeechText}
      />

      {/* Interactive HTML5 Drawing & Text Studio Modal */}
      <DrawingStudioModal
        isOpen={Boolean(selectedStudioSlot)}
        slotInfo={selectedStudioSlot}
        onClose={() => setSelectedStudioSlot(null)}
        onSubmit={handlePostDrawing}
      />

      {/* Antd Image Fullscreen Lightbox Inspection */}
      <div style={{ display: 'none' }}>
        {selectedMedia && (
          <AntdImage
            src={resolveImg(selectedMedia.url)}
            preview={{
              open: true,
              src: resolveImg(selectedMedia.url),
              onOpenChange: (open) => {
                if (!open) setSelectedMedia(null);
              },
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Museum;
