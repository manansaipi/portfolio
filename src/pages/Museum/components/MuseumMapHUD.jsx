import React, { useState, useEffect } from 'react';

const MuseumMapHUD = ({ isLookingAtNPC = false }) => {
  const [fps, setFps] = useState(60);
  const [showControls, setShowControls] = useState(true);

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
      {/* ── Top-Left FPS Counter Display ── */}
      <div style={{
        position: 'absolute', top: '16px', left: '16px',
        background: 'rgba(10, 10, 12, 0.85)', border: '1px solid rgba(255,255,255,0.15)',
        padding: '6px 12px', borderRadius: '6px', color: '#ffffff',
        backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: '8px'
      }}>
        <div style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: fps >= 50 ? '#22c55e' : fps >= 30 ? '#eab308' : '#ef4444'
        }} />
        <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em' }}>
          {fps} FPS
        </span>
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
            transition: 'opacity 0.25s ease, transform 0.25s ease'
          }}>
            [E] to Interact
          </div>
        )}

        {/* First 10-Seconds Controls Guide (Desktop Only!) */}
        {typeof window !== 'undefined' && !('ontouchstart' in window) && window.innerWidth > 768 && (
          <div style={{
            background: 'rgba(10, 10, 12, 0.85)', border: '1px solid rgba(255,255,255,0.15)',
            padding: '12px 16px', borderRadius: '8px', color: '#ffffff',
            backdropFilter: 'blur(8px)', width: '210px',
            opacity: showControls ? 1 : 0,
            pointerEvents: showControls ? 'auto' : 'none',
            transform: showControls ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '6px', opacity: 0.9 }}>
              CONTROLS
            </div>
            <div style={{ fontSize: '0.72rem', display: 'flex', flexDirection: 'column', gap: '4px', opacity: 0.8 }}>
              <div>WASD - Walk</div>
              <div>Mouse - Look Around</div>
              <div>[E] - Interact</div>
              <div>ESC - Release Pointer</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MuseumMapHUD;
