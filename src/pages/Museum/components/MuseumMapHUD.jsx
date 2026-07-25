import React, { useState, useEffect } from 'react';

const MuseumMapHUD = ({ categories = [], onNavigate }) => {
  const [fps, setFps] = useState(60);

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

  const getLabel = (slug, defaultLabel) => {
    const found = categories.find((c) => c.slug === slug);
    return found ? found.label : defaultLabel;
  };

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

      {/* ── Center Crosshair Dot & Ring Cursor ── */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: '#ffffff', boxShadow: '0 0 6px rgba(0,0,0,0.8), 0 0 2px #ffffff',
          opacity: 0.9, mixBlendMode: 'difference'
        }} />
      </div>

      {/* ── Top-Right Hall Teleport & Signature Buttons ── */}
      <div style={{ position: 'absolute', top: '16px', right: '16px', pointerEvents: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {[
          { slug: 'lobby', label: '🏠 Lobby' },
          { slug: 'nature', label: getLabel('nature', 'Nature Hall') },
          { slug: 'street', label: getLabel('street', 'Street Hall') },
          { slug: 'travel', label: getLabel('travel', 'Travel Hall') },
          { slug: 'portrait', label: getLabel('portrait', 'Portrait Hall') },
        ].map(({ slug, label }) => (
          <button
            key={slug}
            onClick={() => onNavigate(slug)}
            style={{
              background: slug === 'signature' ? 'rgba(59, 130, 246, 0.85)' : 'rgba(15, 15, 18, 0.85)',
              color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)',
              padding: '6px 14px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
              borderRadius: '6px', backdropFilter: 'blur(8px)', transition: 'all 0.2s ease',
              minWidth: '120px', textAlign: 'center'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = slug === 'signature' ? 'rgba(37, 99, 235, 1)' : 'rgba(255,255,255,0.25)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = slug === 'signature' ? 'rgba(59, 130, 246, 0.85)' : 'rgba(15, 15, 18, 0.85)'; }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Bottom-Left Controls Overlay ── */}
      <div style={{
        position: 'absolute', bottom: '20px', left: '20px',
        background: 'rgba(10, 10, 12, 0.85)', border: '1px solid rgba(255,255,255,0.15)',
        padding: '12px 16px', borderRadius: '8px', color: '#ffffff',
        backdropFilter: 'blur(8px)', width: '160px'
      }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '6px', opacity: 0.9 }}>
          CONTROLS
        </div>
        <div style={{ fontSize: '0.72rem', display: 'flex', flexDirection: 'column', gap: '4px', opacity: 0.8 }}>
          <div>WASD - Walk</div>
          <div>Mouse - Look Around</div>
          <div>Click - Interact</div>
          <div>ESC - Menu</div>
        </div>
      </div>

      {/* ── Bottom-Right Minimap Diagram ── */}
      <div style={{
        position: 'absolute', bottom: '20px', right: '20px',
        width: '140px', height: '90px', background: 'rgba(15, 15, 18, 0.9)',
        border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px',
        padding: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        backdropFilter: 'blur(8px)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', height: '45px' }}>
          <div style={{ background: '#22c55e', opacity: 0.7, borderRadius: '2px' }} title="Nature" />
          <div style={{ background: '#eab308', opacity: 0.7, borderRadius: '2px' }} title="Street" />
          <div style={{ background: '#f97316', opacity: 0.7, borderRadius: '2px' }} title="Travel" />
          <div style={{ background: '#3b82f6', opacity: 0.7, borderRadius: '2px' }} title="Portrait" />
        </div>
        <div style={{ background: '#334155', height: '22px', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#fbbf24', fontSize: '10px' }}>▲ LOBBY</span>
        </div>
      </div>
    </div>
  );
};

export default MuseumMapHUD;
