import React, { useState, useRef, useEffect } from 'react';

const MultiplayerChatModal = ({
  isOpen,
  setIsOpen,
  visitorName,
  visitorColor,
  isConnected,
  activePlayersList = [],
  chatMessages = [],
  loadMoreMessages,
  hasMoreMessages,
  sendChat,
  updateProfile,
  NEON_COLORS = []
}) => {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'profile'
  const [inputMsg, setInputMsg] = useState('');
  const [editName, setEditName] = useState(visitorName || '');
  const [editColor, setEditColor] = useState(visitorColor || '#38bdf8');
  const chatBottomRef = useRef(null);
  const chatInputRef = useRef(null);
  const modalRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      // Don't close if they clicked inside the modal or on the toggle button
      if (modalRef.current && !modalRef.current.contains(e.target) && !e.target.closest('button')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setIsOpen]);

  // Listen for '/' keyboard shortcut event dispatched from Player.jsx
  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
      setActiveTab('chat');
      // Small delay to let the panel render before focusing
      setTimeout(() => {
        if (chatInputRef.current) chatInputRef.current.focus();
      }, 100);
    };
    window.addEventListener('open-multiplayer-chat', handleOpenChat);
    return () => window.removeEventListener('open-multiplayer-chat', handleOpenChat);
  }, [setIsOpen]);

  useEffect(() => {
    setEditName(visitorName || '');
    setEditColor(visitorColor || '#38bdf8');
  }, [visitorName, visitorColor]);

  useEffect(() => {
    if (chatBottomRef.current && isOpen && activeTab === 'chat') {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isOpen, activeTab]);

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    sendChat(inputMsg);
    setInputMsg('');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!editName.trim()) return;
    updateProfile(editName.trim(), editColor);
    setActiveTab('chat');
  };

  const totalOnline = (activePlayersList?.length || 0) + 1; // Others + Self

  return (
    <>
      {/* ── Compact Live HUD Badge (Bottom-Right corner above mobile controls) ── */}
      <div style={{
        position: 'fixed', bottom: '24px', right: '24px', zIndex: 100,
        display: 'flex', alignItems: 'center', gap: '8px'
      }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'rgba(15, 23, 42, 0.88)', backdropFilter: 'blur(10px)',
            border: '1px solid #38bdf8', borderRadius: '30px', padding: '8px 16px',
            color: '#ffffff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5), 0 0 10px rgba(56, 189, 248, 0.3)',
            transition: 'all 0.2s ease'
          }}
        >
          <span style={{
            width: '10px', height: '10px', borderRadius: '50%',
            background: isConnected ? '#10b981' : '#f43f5e',
            boxShadow: isConnected ? '0 0 8px #10b981' : 'none',
            display: 'inline-block'
          }} />
          <span>{totalOnline} {totalOnline === 1 ? 'Explorer' : 'Explorers'} Online</span>
          <span style={{ opacity: 0.6 }}>•</span>
          <span style={{ color: '#38bdf8' }}>💬 Chat</span>
        </button>
      </div>

      {/* ── Glassmorphic Multiplayer Chat & Profile Modal Box ── */}
      {isOpen && (
        <div ref={modalRef} 
             onClick={(e) => e.stopPropagation()}
             onKeyDown={(e) => e.stopPropagation()}
             style={{
          position: 'fixed', bottom: '80px', right: '24px', width: '360px', maxWidth: '90vw',
          height: '440px', maxHeight: '75vh', background: 'rgba(9, 9, 11, 0.95)',
          backdropFilter: 'blur(16px)', border: '1px solid #27272a', borderRadius: '16px',
          zIndex: 101, display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.8), 0 0 20px rgba(56, 189, 248, 0.2)',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}>
          {/* Header */}
          <div style={{
            padding: '14px 18px', background: '#18181b', borderBottom: '1px solid #27272a',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.1rem' }}>🌐</span>
              <h4 style={{ margin: 0, color: '#ffffff', fontSize: '0.95rem', fontWeight: 700 }}>
                Live Museum Metaverse
              </h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent', border: 'none', color: '#9ca3af',
                fontSize: '16px', cursor: 'pointer', padding: '4px'
              }}
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', borderBottom: '1px solid #27272a', background: 'rgba(24, 24, 27, 0.5)'
          }}>
            <button
              onClick={() => setActiveTab('chat')}
              style={{
                flex: 1, padding: '10px', background: activeTab === 'chat' ? 'transparent' : 'rgba(0,0,0,0.2)',
                border: 'none', borderBottom: activeTab === 'chat' ? '2px solid #38bdf8' : 'none',
                color: activeTab === 'chat' ? '#38bdf8' : '#9ca3af', fontSize: '0.85rem',
                fontWeight: 600, cursor: 'pointer'
              }}
            >
              💬 Room Chat
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              style={{
                flex: 1, padding: '10px', background: activeTab === 'profile' ? 'transparent' : 'rgba(0,0,0,0.2)',
                border: 'none', borderBottom: activeTab === 'profile' ? '2px solid #38bdf8' : 'none',
                color: activeTab === 'profile' ? '#38bdf8' : '#9ca3af', fontSize: '0.85rem',
                fontWeight: 600, cursor: 'pointer'
              }}
            >
              ⚙️ My Avatar Profile
            </button>
          </div>

          {/* Body */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Messages List */}
              <div 
                id="museum-chat-container"
                style={{
                  flex: 1, padding: '12px 14px', overflowY: 'auto', display: 'flex',
                  flexDirection: 'column', gap: '10px'
                }}
                onScroll={(e) => {
                  const target = e.target;
                  if (target.scrollTop === 0 && hasMoreMessages) {
                    const oldScrollHeight = target.scrollHeight;
                    loadMoreMessages().then(() => {
                      // After React renders new messages prepended at top,
                      // the scrollHeight will increase. We need to maintain the visual scroll position
                      // by setting scrollTop to the difference in scrollHeight!
                      setTimeout(() => {
                        target.scrollTop = target.scrollHeight - oldScrollHeight;
                      }, 10);
                    });
                  }
                }}
              >
                {hasMoreMessages && (
                  <div style={{ textAlign: 'center', padding: '10px', color: '#38bdf8', fontSize: '0.8rem' }}>
                    Scrolling up to load older messages...
                  </div>
                )}
                <div style={{
                  padding: '8px 12px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid rgba(56, 189, 248, 0.2)', color: '#38bdf8', fontSize: '0.78rem',
                  textAlign: 'center'
                }}>
                  Welcome to the Live Museum! Say hello to nearby explorers. Your chat messages also appear as 3D speech bubbles above your avatar!
                </div>

                {chatMessages.map((msg) => (
                  <div key={msg.id} style={{
                    fontSize: '0.84rem', lineHeight: 1.4
                  }}>
                    {msg.system ? (
                      <div style={{ color: '#64748b', fontStyle: 'italic', fontSize: '0.78rem', textAlign: 'center', margin: '4px 0' }}>
                        {msg.text}
                      </div>
                    ) : msg.senderIsAdmin ? (
                      <div style={{ background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.15) 0%, transparent 100%)', padding: '6px 10px', borderRadius: '6px', borderLeft: '3px solid #f59e0b' }}>
                        <span style={{ color: '#f59e0b', fontWeight: 800, marginRight: '6px', textShadow: '0 0 10px rgba(245, 158, 11, 0.6)' }}>
                          {msg.senderName || 'Admin'}:
                        </span>
                        <span style={{ color: '#fef3c7', fontWeight: 500 }}>{msg.text}</span>
                        {msg.timestamp && (
                          <span style={{ color: '#d97706', fontSize: '0.7rem', marginLeft: '6px' }}>
                            {msg.timestamp}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div style={{ padding: '2px 0' }}>
                        <span style={{ color: msg.senderColor || '#38bdf8', fontWeight: 700, marginRight: '6px' }}>
                          {msg.senderName || 'Visitor'}:
                        </span>
                        <span style={{ color: '#e2e8f0' }}>{msg.text}</span>
                        {msg.timestamp && (
                          <span style={{ color: '#64748b', fontSize: '0.7rem', marginLeft: '6px' }}>
                            {msg.timestamp}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChat} style={{
                padding: '12px', borderTop: '1px solid #27272a', display: 'flex', gap: '8px',
                background: '#18181b'
              }}>
                <input
                  ref={chatInputRef}
                  type="text"
                  placeholder="Type to chat..."
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  style={{
                    flex: 1, padding: '8px 12px', borderRadius: '20px', background: '#09090b',
                    border: '1px solid #27272a', color: '#ffffff', fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '8px 16px', borderRadius: '20px', background: '#38bdf8',
                    border: 'none', color: '#09090b', fontWeight: 700, fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Send
                </button>
              </form>
            </div>
          ) : (
            /* Profile Settings Tab */
            <form onSubmit={handleSaveProfile} style={{
              flex: 1, padding: '18px', display: 'flex', flexDirection: 'column', gap: '16px',
              overflowY: 'auto'
            }}>
              <div>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.8rem', marginBottom: '6px', fontWeight: 600 }}>
                  YOUR NICKNAME (FLOATS ABOVE YOUR AVATAR)
                </label>
                <input
                  type="text"
                  maxLength={20}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter custom nickname..."
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#09090b',
                    border: '1px solid #38bdf8', color: '#ffffff', fontSize: '0.9rem',
                    outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.8rem', marginBottom: '8px', fontWeight: 600 }}>
                  CHOOSE YOUR AVATAR NEON COLOR
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  {NEON_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setEditColor(color)}
                      style={{
                        height: '42px', borderRadius: '8px', background: color,
                        border: editColor === color ? '3px solid #ffffff' : '1px solid transparent',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: editColor === color ? `0 0 12px ${color}` : 'none'
                      }}
                    >
                      {editColor === color && <span style={{ color: '#000', fontWeight: 'bold' }}>✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
                <button
                  type="submit"
                  style={{
                    width: '100%', padding: '12px', borderRadius: '8px', background: '#38bdf8',
                    border: 'none', color: '#09090b', fontSize: '0.95rem', fontWeight: 700,
                    cursor: 'pointer', boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)'
                  }}
                >
                  Save Profile & Update 3D Avatar
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </>
  );
};

export default MultiplayerChatModal;
