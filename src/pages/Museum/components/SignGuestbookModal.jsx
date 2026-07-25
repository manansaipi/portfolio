import React, { useState } from 'react';

const SignGuestbookModal = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    try {
      setSubmitting(true);
      await onSubmit({ name: name.trim(), message: message.trim() });
      setName('');
      setMessage('');
      onClose();
    } catch (err) {
      console.error('Error submitting signature:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{
        background: '#18181b', border: '1px solid #27272a', borderRadius: '12px',
        width: '100%', maxWidth: '440px', padding: '24px', color: '#ffffff',
        boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            ✍️ Sign Museum Guestbook
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', color: '#a1a1aa', fontSize: '1.5rem',
              cursor: 'pointer', padding: '0 4px', lineHeight: 1
            }}
          >
            ×
          </button>
        </div>

        <p style={{ margin: '0 0 20px', fontSize: '0.85rem', color: '#a1a1aa', lineHeight: 1.4 }}>
          Leave your name and signature message. It will be permanently stored in the database and rendered on the 3D Virtual Museum wall!
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '6px' }}>
              Your Name *
            </label>
            <input
              type="text"
              required
              maxLength={40}
              placeholder="e.g. Sarah Jenkins"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px', background: '#09090b', border: '1px solid #3f3f46',
                borderRadius: '6px', color: '#ffffff', fontSize: '0.9rem', outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '6px' }}>
              Signature / Message *
            </label>
            <textarea
              required
              rows={3}
              maxLength={120}
              placeholder="e.g. Loved the photography exhibits!"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px', background: '#09090b', border: '1px solid #3f3f46',
                borderRadius: '6px', color: '#ffffff', fontSize: '0.9rem', outline: 'none', resize: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1, padding: '10px', background: '#27272a', color: '#ffffff',
                border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                flex: 1, padding: '10px', background: '#3b82f6', color: '#ffffff',
                border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
                opacity: submitting ? 0.6 : 1
              }}
            >
              {submitting ? 'Saving...' : 'Post Signature'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignGuestbookModal;
