import React, { useRef, useState } from 'react';

const MobileTouchControls = ({
  onMove,
  onLook,
  onInteract,
  onJump,
  isInteractive = false,
}) => {
  const joystickBaseRef = useRef(null);
  const [joystickActive, setJoystickActive] = useState(false);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const touchIdRef = useRef(null);
  const lookTouchIdRef = useRef(null);
  const lastLookPos = useRef({ x: 0, y: 0 });

  // 🕹️ Joystick Touch Handlers (Bottom-Left)
  const handleJoystickStart = (e) => {
    e.stopPropagation();
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    setJoystickActive(true);
    updateJoystick(touch);
  };

  const handleJoystickMove = (e) => {
    e.stopPropagation();
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        updateJoystick(e.changedTouches[i]);
        break;
      }
    }
  };

  const handleJoystickEnd = (e) => {
    e.stopPropagation();
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        touchIdRef.current = null;
        setJoystickActive(false);
        setKnobPos({ x: 0, y: 0 });
        if (onMove) onMove({ x: 0, y: 0 });
        break;
      }
    }
  };

  const updateJoystick = (touch) => {
    if (!joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxRadius = rect.width / 2 - 12;

    let clampedX = dx;
    let clampedY = dy;
    if (distance > maxRadius) {
      clampedX = (dx / distance) * maxRadius;
      clampedY = (dy / distance) * maxRadius;
    }

    setKnobPos({ x: clampedX, y: clampedY });

    const normX = clampedX / maxRadius;
    const normY = clampedY / maxRadius;
    if (onMove) onMove({ x: normX, y: normY });
  };

  // 👀 Touch Look Handlers (Right side)
  const handleLookStart = (e) => {
    const touch = e.changedTouches[0];
    lookTouchIdRef.current = touch.identifier;
    lastLookPos.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleLookMove = (e) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === lookTouchIdRef.current) {
        const touch = e.changedTouches[i];
        const deltaX = touch.clientX - lastLookPos.current.x;
        const deltaY = touch.clientY - lastLookPos.current.y;
        lastLookPos.current = { x: touch.clientX, y: touch.clientY };

        if (onLook) onLook(deltaX, deltaY);
        break;
      }
    }
  };

  const handleLookEnd = (e) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === lookTouchIdRef.current) {
        lookTouchIdRef.current = null;
        break;
      }
    }
  };

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 20, userSelect: 'none', touchAction: 'none' }}>
      {/* Touch Look Area (Right 60% of screen) */}
      <div
        onTouchStart={handleLookStart}
        onTouchMove={handleLookMove}
        onTouchEnd={handleLookEnd}
        onTouchCancel={handleLookEnd}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '60%',
          height: '100%',
          pointerEvents: 'auto',
          touchAction: 'none',
        }}
      />

      {/* Analog Joystick Container (Bottom-Left) */}
      <div
        ref={joystickBaseRef}
        onTouchStart={handleJoystickStart}
        onTouchMove={handleJoystickMove}
        onTouchEnd={handleJoystickEnd}
        onTouchCancel={handleJoystickEnd}
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.12)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'auto',
          touchAction: 'none',
          boxShadow: joystickActive ? '0 0 20px rgba(59, 130, 246, 0.5)' : '0 4px 12px rgba(0,0,0,0.3)',
          transition: 'box-shadow 0.2s ease',
        }}
      >
        {/* Direction guide arrows */}
        <div style={{ position: 'absolute', top: '6px', fontSize: '9px', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }}>▲</div>
        <div style={{ position: 'absolute', bottom: '6px', fontSize: '9px', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }}>▼</div>
        <div style={{ position: 'absolute', left: '6px', fontSize: '9px', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }}>◀</div>
        <div style={{ position: 'absolute', right: '6px', fontSize: '9px', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }}>▶</div>

        {/* Joystick Knob */}
        <div
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: joystickActive
              ? 'radial-gradient(circle, #60a5fa 0%, #2563eb 100%)'
              : 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(200,200,200,0.75) 100%)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
            transition: joystickActive ? 'none' : 'transform 0.15s ease-out',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Action Buttons (Bottom-Right) */}
      <div style={{ position: 'absolute', bottom: '24px', right: '24px', display: 'flex', gap: '12px', alignItems: 'center', pointerEvents: 'auto' }}>
        {/* Jump Button */}
        <button
          onClick={onJump}
          onTouchStart={(e) => { e.stopPropagation(); onJump(); }}
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: 'rgba(15, 15, 20, 0.85)',
            border: '1.5px solid rgba(255, 255, 255, 0.25)',
            color: '#ffffff',
            fontSize: '0.72rem',
            fontWeight: 800,
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            touchAction: 'manipulation',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          JUMP
        </button>

        {/* Action / Interact Button */}
        <button
          onClick={onInteract}
          onTouchStart={(e) => { e.stopPropagation(); onInteract(); }}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: isInteractive
              ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
              : 'rgba(15, 15, 20, 0.85)',
            border: isInteractive
              ? '2px solid #60a5fa'
              : '1.5px solid rgba(255, 255, 255, 0.25)',
            color: '#ffffff',
            fontSize: '0.8rem',
            fontWeight: 800,
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: isInteractive ? '0 0 18px rgba(59, 130, 246, 0.7)' : '0 4px 12px rgba(0,0,0,0.3)',
            transition: 'all 0.2s ease',
            touchAction: 'manipulation',
          }}
        >
          {isInteractive ? 'ACTION' : 'E'}
        </button>
      </div>
    </div>
  );
};

export default MobileTouchControls;
