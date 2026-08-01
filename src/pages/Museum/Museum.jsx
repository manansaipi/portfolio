import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, PerformanceMonitor } from '@react-three/drei';
import { Helmet } from 'react-helmet-async';
import { Image as AntdImage, message } from 'antd';
import ErrorBoundary3D from './components/ErrorBoundary3D';
import GalleryRoom from './components/GalleryRoom';
import LobbyDecoration from './components/LobbyDecoration';
import MuseumLighting from './components/MuseumLighting';
import ArtPiece from './components/ArtPiece';
import EmptyWallSlot from './components/EmptyWallSlot';
import VideoPiece from './components/VideoPiece';
import BotAssistantNPC from './components/BotAssistantNPC';
import BotAssistantModal from './components/BotAssistantModal';
import DrawingStudioModal from './components/DrawingStudioModal';
import AdminMediaEditor from './components/AdminMediaEditor';
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
import { getGalleryMedia, getGalleryCategories, updateGalleryMedia } from '@services/gallery';
import { getGuestbookEntries, createGuestbookEntry } from '@services/guestbook';
import { useMultiplayer } from './hooks/useMultiplayer';
import OtherPlayersList from './components/OtherPlayersList';
import LocalPlayerEmoteAvatar from './components/LocalPlayerEmoteAvatar';
import MultiplayerChatModal from './components/MultiplayerChatModal';
import MuseumMiniMap from './components/MuseumMiniMap';

const Museum = () => {
  const [loadingState, setLoadingState] = useState('fetching');
  const [progress, setProgress] = useState(0);
  const [mediaItems, setMediaItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [guestbookEntries, setGuestbookEntries] = useState([]);
  const [selectedStudioSlot, setSelectedStudioSlot] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [heldMedia, setHeldMedia] = useState(null); // The media currently being "carried" by the admin

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && (window.innerWidth <= 1024 || 'ontouchstart' in window));
  const [teleportTarget, setTeleportTarget] = useState(null);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isEditingMedia, setIsEditingMedia] = useState(false);
  const [hoveredMedia, setHoveredMedia] = useState(null);
  const [isLookingAtNPC, setIsLookingAtNPC] = useState(false);
  const [isMultiplayerChatOpen, setIsMultiplayerChatOpen] = useState(false);
  const [dpr, setDpr] = useState(1.5); // Performance Monitor DPR scaler

  // Mobile Analog Touch State (Use Refs for 120 FPS zero-re-render touch swiping!)
  const mobileMoveVectorRef = useRef({ x: 0, y: 0 });
  const mobileLookDeltaRef = useRef({ x: 0, y: 0 });
  const [mobileJumpTrigger, setMobileJumpTrigger] = useState(0);
  const [mobileCrouched, setMobileCrouched] = useState(false);
  const [interactType, setInteractType] = useState(null);
  const [mobileInteractTrigger, setMobileInteractTrigger] = useState(0);
  
  // Track hovered empty slot or art piece for admin placement
  const [hoveredPlacementTarget, setHoveredPlacementTarget] = useState(null);
  const [activeEmote, setActiveEmote] = useState(null);
  const playerPosRef = useRef({ x: 0, z: 0, yaw: 0 });

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
    sendEmote,
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
    const handleResize = () => setIsMobile(window.innerWidth <= 1024 || 'ontouchstart' in window);
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
  }, [isMobile]); // Initial load

  // Refetch to include hidden items if user is an admin
  useEffect(() => {
    let isMounted = true;
    if (isAdmin && loadingState === 'ready') {
      getGalleryMedia(true).then(data => {
        if (isMounted) setMediaItems(data);
      }).catch(err => console.error('Failed to refetch hidden items:', err));
    }
    return () => { isMounted = false; };
  }, [isAdmin, loadingState]);

  // Handle Escape key & cursor visibility during image/AI focus
  useEffect(() => {
    if (selectedMedia || isAiChatOpen) {
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
      document.body.style.cursor = 'default';
    }

    const handleKeyDown = async (e) => {
      // Check if user is typing in an input field (like chat)
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName) || document.activeElement?.isContentEditable) {
        return;
      }
      
      if ((e.key === 'q' || e.key === 'Q') && isAdmin && (hoveredMedia || selectedMedia) && !isEditingMedia) {
        setSelectedMedia(hoveredMedia || selectedMedia);
        setIsEditingMedia(true);
      }
      if (e.code === 'KeyF' && isAdmin) {
        // Minecraft placement logic
        if (heldMedia) {
          // PLACE or SWAP
          if (hoveredPlacementTarget) {

            const { media: targetMedia, isEmptySlot, slotIndex, category } = hoveredPlacementTarget;
            
            // Optimistically update frontend
            let updatedItems = [...mediaItems];
            let heldItemIndex = updatedItems.findIndex(m => m.id === heldMedia.id);
            
            const hideLoading = message.loading("Saving placement...", 0);
            
            try {
              if (isEmptySlot) {
                  // Moving to an empty slot
                  updatedItems[heldItemIndex] = { ...heldMedia, category, order: slotIndex };
                  await updateGalleryMedia(heldMedia.id, { category, order: slotIndex });
              } else if (targetMedia && targetMedia.id !== heldMedia.id) {
                  // SWAP with another artwork
                  let targetItemIndex = updatedItems.findIndex(m => m.id === targetMedia.id);
                  
                  const heldOrder = heldMedia.slotIndex !== undefined ? heldMedia.slotIndex : heldItemIndex;
                  const heldCat = heldMedia.category || 'nature-hall';
                  
                  const targetOrder = targetMedia.slotIndex !== undefined ? targetMedia.slotIndex : targetItemIndex;
                  const targetCat = targetMedia.category || 'nature-hall';
                  
                  // Swap their values
                  updatedItems[heldItemIndex] = { ...heldMedia, category: targetCat, order: targetOrder };
                  updatedItems[targetItemIndex] = { ...targetMedia, category: heldCat, order: heldOrder };
                  
                  // Call reorder API
                  await updateGalleryMedia(heldMedia.id, { category: targetCat, order: targetOrder });
                  await updateGalleryMedia(targetMedia.id, { category: heldCat, order: heldOrder });
              }
              
              setMediaItems(updatedItems);
              setHeldMedia(null);
              message.success("Artwork placed!");
            } catch (err) {
              console.error(err);
              message.error("Failed to save placement.");
            } finally {
              hideLoading();
            }
          }
        } else {
          // GRAB
          if (hoveredPlacementTarget && !hoveredPlacementTarget.isEmptySlot && hoveredPlacementTarget.media) {

            setHeldMedia(hoveredPlacementTarget.media);
            message.info("Artwork grabbed! Press F on a wall to place.");
          }
        }
      }
      
      if (e.key === 'Escape') {
        if (selectedMedia) setSelectedMedia(null);
        if (selectedStudioSlot) setSelectedStudioSlot(null);
        if (isAiChatOpen) setIsAiChatOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMedia, hoveredMedia, selectedStudioSlot, isAiChatOpen, isAdmin, isEditingMedia, heldMedia, hoveredPlacementTarget]);

  // Map uploaded artworks to wall slots in the 4 exhibition halls
  const { placedArtworks, emptySlots } = useMemo(() => {
    const placed = [];
    const slots = [];
    
    const categorizedMedia = {};
    Object.keys(HALL_CONFIG).forEach(k => { categorizedMedia[k] = []; });
    
    mediaItems.forEach((media) => {
      const category = media.category?.toLowerCase() || 'nature-hall';
      const catKey = HALL_CONFIG[category] ? category : 'nature-hall';
      categorizedMedia[catKey].push(media);
    });

    Object.keys(HALL_CONFIG).forEach(catKey => {
      const config = HALL_CONFIG[catKey];
      if (!config.walls) return;
      
      const wallsLength = config.walls.length;
      const occupiedIndices = new Set();
      
      // First pass: Place items with valid order
      categorizedMedia[catKey].forEach(media => {
        const order = media.order;
        if (order !== undefined && order !== null && order >= 0 && order < wallsLength && !occupiedIndices.has(order)) {
          occupiedIndices.add(order);
          placed.push({ ...media, pos: config.walls[order].position, rot: config.walls[order].rotation, slotIndex: order, category: catKey });
        }
      });
      
      // Second pass: Place remaining items in first available empty slots
      const unplaced = categorizedMedia[catKey].filter(media => {
        const order = media.order;
        return !(order !== undefined && order !== null && order >= 0 && order < wallsLength && occupiedIndices.has(order) && placed.find(p => p.id === media.id && p.slotIndex === order));
      });
      
      let unplacedIdx = 0;
      for (let i = 0; i < wallsLength; i++) {
        if (!occupiedIndices.has(i)) {
          if (unplacedIdx < unplaced.length) {
            const media = unplaced[unplacedIdx];
            placed.push({ ...media, pos: config.walls[i].position, rot: config.walls[i].rotation, slotIndex: i, category: catKey });
            occupiedIndices.add(i);
            unplacedIdx++;
          } else if (isAdmin) {
            slots.push({ category: catKey, slotIndex: i, pos: config.walls[i].position, rot: config.walls[i].rotation });
          }
        }
      }
    });

    return { placedArtworks: placed, emptySlots: slots };
  }, [mediaItems, isAdmin]);

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

  const handleMediaUpdated = (updatedMedia) => {
    setMediaItems((prev) => prev.map(m => m.id === updatedMedia.id ? updatedMedia : m));
  };

  const handleMediaDeleted = (mediaId) => {
    setMediaItems((prev) => prev.filter(m => m.id !== mediaId));
    setSelectedMedia(null);
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
        <p style={{ marginTop: '0.85rem', fontSize: '0.85rem', opacity: 0.6 }}>assets loading {progress}% </p>
      </div>
    );
  }

  // ── 2. Full 3D Virtual Museum Engine (Mobile & Desktop Enabled!) ──
  return (
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', background: '#000000', zIndex: 0 }}>
      <Helmet><title>3D Virtual Museum | Portfolio</title></Helmet>

      <ErrorBoundary3D>
        <Canvas
          dpr={dpr}
          frameloop={(isAiChatOpen || selectedStudioSlot || isMultiplayerChatOpen) ? "demand" : "always"}
          camera={{ fov: 60, near: 0.01, far: 250, position: [0, 3.8, 0] }}
          gl={{ antialias: dpr <= 1, alpha: false, powerPreference: "high-performance" }}
        >
          <PerformanceMonitor onIncline={() => setDpr(1.5)} onDecline={() => setDpr(1)} />
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
                    onHover={(m) => setHoveredPlacementTarget({ media: m, isEmptySlot: false })}
                    onUnhover={() => setHoveredPlacementTarget(null)}
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
                    onHover={(m) => {
                      setHoveredMedia(m);
                      setHoveredPlacementTarget({ media: m, isEmptySlot: false });
                    }}
                    onUnhover={() => {
                      setHoveredMedia(null);
                      setHoveredPlacementTarget(null);
                    }}
                  />
                )
              ))}
            </group>

            <Player
              teleportTarget={teleportTarget}
              enabled={!selectedStudioSlot && !isAiChatOpen && !isMultiplayerChatOpen}
              disableMovement={Boolean(activeEmote)}
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
              onMove={(pos, euler) => {
                playerPosRef.current.x = pos.x;
                playerPosRef.current.z = pos.z;
                playerPosRef.current.yaw = euler.y;
                sendMovement(pos, euler);
              }}
            />
            {/* 🧑‍🤝‍🧑 Real-Time 3D Avatars of Other Museum Explorers */}
            <OtherPlayersList activePlayersList={activePlayersList} playersRef={playersRef} />
            {activeEmote && (
              <LocalPlayerEmoteAvatar
                activeEmote={activeEmote}
                visitorName={visitorName}
                visitorColor={visitorColor}
                isAdmin={isAdmin}
              />
            )}
            {emptySlots.map((slot, index) => (
              <EmptyWallSlot
                key={`empty-${slot.category}-${index}`}
                position={slot.pos}
                rotation={slot.rot}
                slotIndex={slot.slotIndex}
                category={slot.category}
                onHover={setHoveredPlacementTarget}
                onUnhover={() => setHoveredPlacementTarget(null)}
              />
            ))}
            <Preload all />
          </Suspense>
        </Canvas>
      </ErrorBoundary3D>

      {/* 🗺️ Sleek Mini-Map / Visitor Radar HUD */}
      <MuseumMiniMap
        playersRef={playersRef}
        playerPosRef={playerPosRef}
        isMobile={isMobile}
      />

      {/* HUD Navigation Overlay */}
      <MuseumMapHUD
        categories={categories}
        onNavigate={navigateTo}
        isLookingAtNPC={isLookingAtNPC}
        onOpenAIChat={() => setIsAiChatOpen(true)}
        ping={ping}
        heldMedia={heldMedia}
        onEmote={(emoteId) => {
          setActiveEmote(emoteId);
          sendEmote(emoteId, emoteId === 'dance' ? 10 : 3.5);
        }}
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
        isMobile={isMobile}
      />

      {/* Interactive HTML5 Drawing & Text Studio Modal */}
      <DrawingStudioModal
        isOpen={Boolean(selectedStudioSlot)}
        slotInfo={selectedStudioSlot}
        onClose={() => setSelectedStudioSlot(null)}
        onSubmit={handlePostDrawing}
      />

      {/* Admin Editor Modal */}
      <AdminMediaEditor
        isOpen={isEditingMedia}
        onClose={() => {
          setIsEditingMedia(false);
          setSelectedMedia(null);
        }}
        media={selectedMedia}
        categories={categories}
        onMediaUpdated={handleMediaUpdated}
        onMediaDeleted={handleMediaDeleted}
      />

      {/* Antd Image Fullscreen Lightbox Inspection */}
      <div style={{ display: 'none' }}>
        {selectedMedia && (
          <AntdImage
            src={resolveImg(selectedMedia.url)}
            preview={{
              open: !isEditingMedia,
              src: resolveImg(selectedMedia.url),
              onOpenChange: (open) => {
                if (!open && !isEditingMedia) setSelectedMedia(null);
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
