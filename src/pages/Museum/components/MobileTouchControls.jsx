import React, { useRef, useState } from 'react';

const MobileTouchControls = ({
  onMove,
  onLook,
  onInteract,
  onJump,
  isInteractive = false,
  interactType = null,
  isAdmin = false,
  hoveredPlacementTarget = null,
  heldMedia = null,
  isEditingMedia = false,
  hoveredMedia = null,
  selectedMedia = null,
  onAdminEdit,
  onAdminGrabPlace,
  onAdminUpload,
}) => {
  const joystickBaseRef = useRef(null);
  const [joystickActive, setJoystickActive] = useState(false);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const touchIdRef = useRef(null);
  const lookTouchIdRef = useRef(null);
  const lastLookPos = useRef({ x: 0, y: 0 });
  const lastButtonTouchTimeRef = useRef(0);


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
        if (onLook) onLook(0, 0);
        break;
      }
    }
  };

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 20, userSelect: 'none', touchAction: 'none' }}>
      {/* Touch Look Area (Full screen - joystick & buttons sit on top) */}
      <div
        onTouchStart={handleLookStart}
        onTouchMove={handleLookMove}
        onTouchEnd={handleLookEnd}
        onTouchCancel={handleLookEnd}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'auto',
          touchAction: 'none',
        }}
      />

      {/* Sleek Minimal Analog Joystick Container (Bottom-Left - No Arrows, No Blue Glow) */}
      <div
        ref={joystickBaseRef}
        onTouchStart={handleJoystickStart}
        onTouchMove={handleJoystickMove}
        onTouchEnd={handleJoystickEnd}
        onTouchCancel={handleJoystickEnd}
        style={{
          position: 'absolute',
          bottom: '56px',
          left: '24px',
          width: '116px',
          height: '116px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1.5px solid rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'auto',
          touchAction: 'none',
          boxShadow: '0 4px 14px rgba(0,0,0,0.35)',
        }}
      >
        {/* Joystick Knob (Clean Neutral White/Grey) */}
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: joystickActive
              ? 'radial-gradient(circle, #ffffff 0%, #e2e8f0 100%)'
              : 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(200,200,200,0.7) 100%)',
            boxShadow: '0 3px 10px rgba(0,0,0,0.4)',
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
            transition: joystickActive ? 'none' : 'transform 0.15s ease-out',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Control Buttons Container (Bottom-Right - zIndex: 30) */}
      <div style={{
        position: 'absolute',
        bottom: '72px',
        right: '24px',
        width: '200px',
        height: '170px',
        pointerEvents: 'none',
        zIndex: 30,
      }}>
        {/* Jump Button (Bottom-Right) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (Date.now() - lastButtonTouchTimeRef.current < 500) return;
            if (onJump) onJump();
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            lastButtonTouchTimeRef.current = Date.now();
            if (onJump) onJump();
          }}
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            width: '58px',
            height: '58px',
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
            pointerEvents: 'auto',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          JUMP
        </button>

        {/* --- ADMIN MOBILE BUTTONS --- */}
        {isAdmin && hoveredPlacementTarget?.isEmptySlot && !heldMedia && (
          <button
            onClick={(e) => { e.stopPropagation(); onAdminUpload && onAdminUpload(); }}
            onTouchStart={(e) => { e.stopPropagation(); onAdminUpload && onAdminUpload(); }}
            style={{
              position: 'absolute', bottom: '10px', right: '140px', width: '58px', height: '58px', borderRadius: '50%',
              background: 'rgba(59, 130, 246, 0.85)', border: '1.5px solid #60a5fa', color: '#fff', fontSize: '0.65rem', fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto', backdropFilter: 'blur(8px)'
            }}
          >
            UPLOAD
          </button>
        )}

        {isAdmin && heldMedia && hoveredPlacementTarget && (
          <button
            onClick={(e) => { e.stopPropagation(); onAdminGrabPlace && onAdminGrabPlace(); }}
            onTouchStart={(e) => { e.stopPropagation(); onAdminGrabPlace && onAdminGrabPlace(); }}
            style={{
              position: 'absolute', bottom: '10px', right: '140px', width: '58px', height: '58px', borderRadius: '50%',
              background: 'rgba(34, 197, 94, 0.85)', border: '1.5px solid #4ade80', color: '#fff', fontSize: '0.65rem', fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto', backdropFilter: 'blur(8px)'
            }}
          >
            PLACE
          </button>
        )}

        {isAdmin && !heldMedia && hoveredPlacementTarget && !hoveredPlacementTarget.isEmptySlot && (
          <button
            onClick={(e) => { e.stopPropagation(); onAdminGrabPlace && onAdminGrabPlace(); }}
            onTouchStart={(e) => { e.stopPropagation(); onAdminGrabPlace && onAdminGrabPlace(); }}
            style={{
              position: 'absolute', bottom: '10px', right: '140px', width: '58px', height: '58px', borderRadius: '50%',
              background: 'rgba(249, 115, 22, 0.85)', border: '1.5px solid #fb923c', color: '#fff', fontSize: '0.65rem', fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto', backdropFilter: 'blur(8px)'
            }}
          >
            GRAB
          </button>
        )}

        {isAdmin && (hoveredMedia || selectedMedia) && !isEditingMedia && (
          <button
            onClick={(e) => { e.stopPropagation(); onAdminEdit && onAdminEdit(); }}
            onTouchStart={(e) => { e.stopPropagation(); onAdminEdit && onAdminEdit(); }}
            style={{
              position: 'absolute', bottom: '80px', right: '140px', width: '58px', height: '58px', borderRadius: '50%',
              background: 'rgba(168, 85, 247, 0.85)', border: '1.5px solid #c084fc', color: '#fff', fontSize: '0.72rem', fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto', backdropFilter: 'blur(8px)'
            }}
          >
            EDIT
          </button>
        )}

        {/* Action Button (Centered above Jump) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (Date.now() - lastButtonTouchTimeRef.current < 500) return;
            if (isInteractive && onInteract) onInteract();
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            lastButtonTouchTimeRef.current = Date.now();
            if (isInteractive && onInteract) onInteract();
          }}
          style={{
            position: 'absolute',
            bottom: '84px',
            right: '61px',
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            border: '2px solid #60a5fa',
            color: '#ffffff',
            fontSize: '0.85rem',
            fontWeight: 800,
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.75)',
            touchAction: 'manipulation',
            opacity: isInteractive && interactType !== 'slot' ? 1 : 0,
            pointerEvents: isInteractive && interactType !== 'slot' ? 'auto' : 'none',
            transform: isInteractive && interactType !== 'slot' ? 'scale(1)' : 'scale(0.8)',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
          }}
        >
          {interactType === 'bot' ? 'INTERACT' : 'VIEW'}
        </button>
      </div>
    </div>
  );
};

export default MobileTouchControls;
