import React, { useState, useEffect } from 'react';

const LandscapePrompt = () => {
  const [isPortrait, setIsPortrait] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || window.innerWidth <= 1024);
      const portrait = window.innerHeight > window.innerWidth;
      setIsPortrait(isTouch && portrait);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    // Attempt automatic orientation lock if browser supports it
    if (window.screen?.orientation?.lock) {
      window.screen.orientation.lock('landscape').catch(() => {});
    }

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  if (!isPortrait || dismissed) return null;

  const handleRequestLandscape = async () => {
    if (window.screen?.orientation?.lock) {
      try {
        await window.screen.orientation.lock('landscape');
      } catch (err) {
        console.log('Screen orientation lock error:', err);
      }
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(9, 9, 11, 0.96)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        color: '#ffffff',
        textAlign: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Animated Phone Rotation Graphic */}
      <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            fontSize: '3.5rem',
            animation: 'rotatePhone 2.6s infinite ease-in-out',
            display: 'inline-block',
          }}
        >
          📱
        </div>
        <style>{`
          @keyframes rotatePhone {
            0% { transform: rotate(0deg); }
            35% { transform: rotate(-90deg); }
            70% { transform: rotate(-90deg); }
            100% { transform: rotate(0deg); }
          }
        `}</style>
      </div>

      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
        Please Rotate Your Device
      </h2>

      <p style={{ fontSize: '0.88rem', opacity: 0.75, maxWidth: '300px', lineHeight: 1.5, marginBottom: '1.8rem' }}>
        The 3D Virtual Museum requires <strong>Landscape Mode</strong> for widescreen view & analog joystick controls.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '240px' }}>
        <button
          onClick={handleRequestLandscape}
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
          }}
        >
          Rotate to Landscape
        </button>

        <button
          onClick={() => setDismissed(true)}
          style={{
            background: 'transparent',
            color: 'rgba(255, 255, 255, 0.5)',
            border: 'none',
            padding: '8px',
            fontSize: '0.78rem',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Continue in Portrait
        </button>
      </div>
    </div>
  );
};

export default LandscapePrompt;
