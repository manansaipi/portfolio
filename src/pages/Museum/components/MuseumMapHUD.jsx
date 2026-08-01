import React, { useState, useEffect } from 'react';

const MuseumMapHUD = ({ 
  isLookingAtNPC = false, 
  ping = 0, 
  onEmote = () => {}, 
  heldMedia = null,
  hoveredPlacementTarget = null,
  isAdmin = false,
  onUpload = () => {}
}) => {
  const [fps, setFps] = useState(60);
  const [showControls, setShowControls] = useState(true);
  const [activeEmote, setActiveEmote] = useState(null);

  const triggerEmote = (emoteId) => {
    if (activeEmote === emoteId) {
      setActiveEmote(null);
      onEmote(null);
      return;
    }
    setActiveEmote(emoteId);
    onEmote(emoteId);
    const duration = emoteId === 'dance' ? 10000 : 3500;
    setTimeout(() => {
      setActiveEmote((prev) => {
        if (prev === emoteId) {
          onEmote(null);
          return null;
        }
        return prev;
      });
    }, duration);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName) || document.activeElement?.isContentEditable) {
        return;
      }
      if (e.key === '1') triggerEmote('wave');
      if (e.key === '2') triggerEmote('dance');
      if (e.key === '3') triggerEmote('cheer');
      if (e.key === '4') triggerEmote('clap');
      if (e.key === 'Escape' && activeEmote) {
        setActiveEmote(null);
        onEmote(null);
      }
      if ((e.key === 'u' || e.key === 'U') && isAdmin && hoveredPlacementTarget?.isEmptySlot && !heldMedia) {
        document.getElementById('hidden-upload-input')?.click();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onEmote, activeEmote, isAdmin, hoveredPlacementTarget, heldMedia]);

  // FPS Counter tick
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId;

    const tick = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Show general controls guide ONLY for the first 10 seconds!
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ pointerEvents: 'none', position: 'absolute', inset: 0, zIndex: 10, fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* ── Top-Left FPS & Ping Counter Display ── */}
      <div style={{
        position: 'absolute', top: '16px', left: '16px',
        background: 'rgba(10, 10, 12, 0.85)', border: '1px solid rgba(255,255,255,0.15)',
        padding: '6px 12px', borderRadius: '6px', color: '#ffffff',
        backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: '12px'
      }}>
        {/* FPS Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: fps >= 50 ? '#22c55e' : fps >= 30 ? '#eab308' : '#ef4444'
          }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em' }}>
            {fps} FPS
          </span>
        </div>
        
        {/* Divider */}
        <div style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.2)' }} />

        {/* Ping Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: ping === 0 ? '#64748b' : ping <= 90 ? '#22c55e' : ping <= 200 ? '#eab308' : '#ef4444'
          }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em' }}>
            {ping === 0 ? '--' : `${ping} ms`}
          </span>
        </div>
      </div>

      {/* ── Center Crosshair Dot (Clean White Always) ── */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: '#ffffff',
          boxShadow: '0 0 6px rgba(0,0,0,0.8)'
        }} />
      </div>

      {/* ── Bottom-Left Overlay ── */}
      <div style={{
        position: 'absolute', bottom: '20px', left: '20px',
        display: 'flex', flexDirection: 'column', gap: '8px'
      }}>
        {/* Simple Black & White Interactive Prompt (Desktop Only!) */}
        {/* [E] to Interact Prompt */}
        {typeof window !== 'undefined' && !('ontouchstart' in window) && window.innerWidth > 768 && (
          <div style={{
            background: 'rgba(10, 10, 12, 0.85)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '8px 14px',
            borderRadius: '6px',
            fontSize: '0.78rem',
            fontWeight: 600,
            backdropFilter: 'blur(8px)',
            opacity: isLookingAtNPC ? 0.95 : 0,
            pointerEvents: 'none',
            transform: isLookingAtNPC ? 'translateY(0)' : 'translateY(6px)',
            transition: 'opacity 0.25s ease, transform 0.25s ease',
            marginBottom: isAdmin && hoveredPlacementTarget?.isEmptySlot && !heldMedia ? '4px' : '0'
          }}>
            [E] to Interact
          </div>
        )}

        {/* [U] to Upload Prompt */}
        {typeof window !== 'undefined' && !('ontouchstart' in window) && window.innerWidth > 768 && isAdmin && hoveredPlacementTarget?.isEmptySlot && !heldMedia && (
          <div style={{
            background: 'rgba(10, 10, 12, 0.85)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '8px 14px',
            borderRadius: '6px',
            fontSize: '0.78rem',
            fontWeight: 600,
            backdropFilter: 'blur(8px)',
            pointerEvents: 'none',
            animation: 'fadeIn 0.25s ease'
          }}>
            [U] to Upload Photo
          </div>
        )}

        {/* First 10-Seconds Controls Guide & Emotes (Simple text with no color and styling) */}
        {showControls && (
          <div style={{
            background: 'rgba(10, 10, 12, 0.85)', border: '1px solid rgba(255,255,255,0.15)',
            padding: '12px 16px', borderRadius: '8px', color: '#ffffff',
            backdropFilter: 'blur(8px)', width: '220px',
            pointerEvents: 'none',
            animation: 'fadeIn 0.5s ease'
          }}
            className='hidden lg:block'
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '6px', opacity: 0.9 }}>
              CONTROLS
            </div>
            <div style={{ fontSize: '0.72rem', display: 'flex', flexDirection: 'column', gap: '4px', opacity: 0.8 }}>
              <div>WASD - Walk</div>
              <div>Mouse - Look Around</div>
              <div>[1-4] - Emotes (Wave, Dance, Cheer, Clap)</div>
              <div>[E] - Interact</div>
              <div>[/] - Room Chat</div>
              <div>ESC - Release Pointer</div>
          </div>
          </div>
        )}
      </div>

      {/* ── Held Media Thumbnail (Minecraft-style Grab) ── */}
      {heldMedia && (
        <div style={{
          position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'
        }}>
          <div style={{
            background: 'rgba(10, 10, 12, 0.9)', border: '2px solid #3b82f6',
            padding: '8px', borderRadius: '8px',
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)'
          }}>
            <img 
              src={heldMedia.url} 
              alt="Held Artwork" 
              style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} 
            />
          </div>
          <div style={{
            background: 'rgba(10, 10, 12, 0.85)', padding: '4px 10px',
            borderRadius: '4px', color: '#fff', fontSize: '0.75rem', fontWeight: 600
          }}>
            Holding: {heldMedia.title || "Artwork"} [F to Place]
          </div>
        </div>
      )}

      {/* Hidden File Input for Uploading */}
      <input 
        type="file" 
        id="hidden-upload-input" 
        accept="image/*" 
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onUpload(e.target.files[0], hoveredPlacementTarget);
            e.target.value = null; // reset
          }
        }}
      />
    </div>
  );
};

export default MuseumMapHUD;
