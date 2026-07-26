import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
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
import MobileTouchControls from './components/MobileTouchControls';
import { textureCache } from './utils/TextureCache';
import { HALL_CONFIG } from './utils/museumLayoutConfig';
import { resolveImg } from '@utils/imageUtils';
import { getGalleryMedia, getGalleryCategories } from '@services/gallery';
import { getGuestbookEntries, createGuestbookEntry } from '@services/guestbook';
import { useMultiplayer } from './hooks/useMultiplayer';
import OtherPlayersList from './components/OtherPlayersList';
import MultiplayerChatModal from './components/MultiplayerChatModal';

const Museum = () => {
  const [loadingState, setLoadingState] = useState('fetching');
  const [progress, setProgress] = useState(0);
  const [mediaItems, setMediaItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [guestbookEntries, setGuestbookEntries] = useState([]);
  const [selectedStudioSlot, setSelectedStudioSlot] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && (window.innerWidth <= 768 || 'ontouchstart' in window));
  const [teleportTarget, setTeleportTarget] = useState(null);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isLookingAtNPC, setIsLookingAtNPC] = useState(false);
  const [isMultiplayerChatOpen, setIsMultiplayerChatOpen] = useState(false);

  // Mobile Analog Touch State (Use Refs for 120 FPS zero-re-render touch swiping!)
  const mobileMoveVectorRef = useRef({ x: 0, y: 0 });
  const mobileLookDeltaRef = useRef({ x: 0, y: 0 });
  const [mobileJumpTrigger, setMobileJumpTrigger] = useState(0);
  const [mobileCrouched, setMobileCrouched] = useState(false);
  const [interactType, setInteractType] = useState(null);
  const [mobileInteractTrigger, setMobileInteractTrigger] = useState(0);

  // 🌐 Real-Time Multiplayer State & Coordinate Syncing Hook
  const {
    visitorName,
    visitorColor,
    isAdmin,
    isConnected,
    activePlayersList,
    playersRef,
    chatMessages,
    sendMovement,
    sendChat,
    deleteChat,
    editChat,
    updateProfile,
    loadMoreMessages,
    hasMoreMessages,
    isLoadingOlder,
    ping,
    NEON_COLORS,
  } = useMultiplayer("default");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
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

        // Always preload textures on both mobile & desktop
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

  // ── 2. Full 3D Virtual Museum Engine (Mobile & Desktop Enabled!) ──
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
              enabled={!selectedStudioSlot && !isAiChatOpen && !isMultiplayerChatOpen}
              onInteractE={() => setIsAiChatOpen(true)}
              onLookingAtNPC={setIsLookingAtNPC}
              placedArtworks={placedArtworks}
              onSelectArt={(media) => setSelectedMedia(media)}
              mobileMoveVectorRef={mobileMoveVectorRef}
              mobileLookDeltaRef={mobileLookDeltaRef}
              mobileJumpTrigger={mobileJumpTrigger}
              mobileInteractTrigger={mobileInteractTrigger}
              mobileCrouched={mobileCrouched}
              onInteractTypeChange={setInteractType}
              isMobile={isMobile}
              onMove={sendMovement}
            />
            {/* 🧑‍🤝‍🧑 Real-Time 3D Avatars of Other Museum Explorers */}
            <OtherPlayersList activePlayersList={activePlayersList} playersRef={playersRef} />
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
        ping={ping}
      />

      {/* 🤖 Interactive AI Bot Assistant Chat Modal */}
      <BotAssistantModal
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        onSpeakingChange={(speaking) => {
          window.dispatchEvent(new CustomEvent('ai-speaking', { detail: speaking }));
        }}
        onSpeechTextChange={(text) => {
          window.dispatchEvent(new CustomEvent('ai-speech-text', { detail: text }));
        }}
      />

      {/* 🌐 Real-Time Multiplayer Chat & Profile HUD */}
      <MultiplayerChatModal
        isOpen={isMultiplayerChatOpen}
        setIsOpen={setIsMultiplayerChatOpen}
        visitorName={visitorName}
        visitorColor={visitorColor}
        isAdmin={isAdmin}
        isConnected={isConnected}
        activePlayersList={activePlayersList}
        chatMessages={chatMessages}
        loadMoreMessages={loadMoreMessages}
        hasMoreMessages={hasMoreMessages}
        isLoadingOlder={isLoadingOlder}
        sendChat={sendChat}
        deleteChat={deleteChat}
        editChat={editChat}
        updateProfile={updateProfile}
        NEON_COLORS={NEON_COLORS}
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

      {/* Touch D-Pad / Analog Joystick & Touch Look Controls for Mobile */}
      {isMobile && (
        <MobileTouchControls
          onMove={(v) => { mobileMoveVectorRef.current = v; }}
          onLook={(dx, dy) => {
            mobileLookDeltaRef.current.x += dx;
            mobileLookDeltaRef.current.y += dy;
          }}
          onInteract={() => setMobileInteractTrigger(Date.now())}
          onJump={() => setMobileJumpTrigger(Date.now())}
          onCrouchToggle={() => setMobileCrouched(prev => !prev)}
          isCrouched={mobileCrouched}
          isInteractive={Boolean(interactType)}
          interactType={interactType}
        />
      )}
    </div>
  );
};

export default Museum;
