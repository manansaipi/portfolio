import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StareTooltip = ({ staredMedia }) => {
  if (!staredMedia) return null;

  const isVideo = staredMedia.media_type === 'video';

  return (
    <AnimatePresence>
      {staredMedia && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            position: 'absolute',
            top: '55%', // Slightly below the center crosshair
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(9, 9, 11, 0.75)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '1.25rem',
            borderRadius: '12px',
            color: '#fff',
            minWidth: '280px',
            maxWidth: '350px',
            pointerEvents: 'auto', // So they can click buttons (they'd have to unlock pointer first though)
            zIndex: 50,
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
              {staredMedia.title || "Untitled Artwork"}
            </h3>
            <span style={{ 
              fontSize: '0.7rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em', 
              background: 'rgba(255,255,255,0.1)', 
              padding: '2px 6px', 
              borderRadius: '4px',
              marginLeft: '0.5rem',
              whiteSpace: 'nowrap'
            }}>
              {isVideo ? 'Video' : 'Artwork'}
            </span>
          </div>
          
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#a1a1aa', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {staredMedia.description || "Take a closer look to appreciate the details."}
          </p>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button 
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
                padding: '0.5rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 500,
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.25rem'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
            >
              ❤️ Like
            </button>
            <button 
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
                padding: '0.5rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 500,
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.25rem'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
            >
              🔗 Share
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StareTooltip;
