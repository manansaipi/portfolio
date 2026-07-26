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
  isLoadingOlder,
  sendChat,
  deleteChat,
  editChat,
  updateProfile,
  isAdmin,
  NEON_COLORS = [],
  isMobile: isMobileProp
}) => {
  const [isMobileDevice, setIsMobileDevice] = useState(() => 
    isMobileProp !== undefined ? isMobileProp : (typeof window !== 'undefined' && (window.innerWidth <= 768 || 'ontouchstart' in window))
  );

  useEffect(() => {
    if (isMobileProp !== undefined) {
      setIsMobileDevice(isMobileProp);
      return;
    }
    const handleResize = () => setIsMobileDevice(window.innerWidth <= 768 || 'ontouchstart' in window);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileProp]);

  const isMobile = isMobileProp !== undefined ? isMobileProp : isMobileDevice;

  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'profile'
  const [inputMsg, setInputMsg] = useState('');
  const [editName, setEditName] = useState(visitorName || '');
  const [editColor, setEditColor] = useState(visitorColor || '#38bdf8');
  const [toasts, setToasts] = useState([]);
  const [editingMsgId, setEditingMsgId] = useState(null);
  const [editText, setEditText] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);
  const chatBottomRef = useRef(null);
  const chatInputRef = useRef(null);
  const modalRef = useRef(null);
  const oldScrollHeightRef = useRef(null);
  const lastMsgIdRef = useRef(null);
  const lastToastedMsgIdRef = useRef(null);

  const startEditing = (msg) => {
    setEditingMsgId(msg.id);
    setEditText(msg.text);
  };

  const saveEditing = (msgId) => {
    if (editText.trim() && editChat) {
      editChat(msgId, editText.trim());
    }
    setEditingMsgId(null);
  };

  // Show incoming live messages as toasts regardless of whether modal is open or closed
  useEffect(() => {
    if (chatMessages.length === 0) return;
    const latestMsg = chatMessages[chatMessages.length - 1];
    // Check if message is a fresh live arrival (within last 2000ms) and hasn't been toasted yet
    if (
      latestMsg &&
      latestMsg.id !== lastToastedMsgIdRef.current &&
      latestMsg.receivedAt &&
      (Date.now() - latestMsg.receivedAt) < 2000
    ) {
      lastToastedMsgIdRef.current = latestMsg.id;
      const toastId = Math.random();
      const newToast = { ...latestMsg, toastId, expiresAt: Date.now() + 5000 };
      setToasts((prev) => [...prev.slice(-4), newToast]);
    }
  }, [chatMessages]);

  // Clean up expired toasts reliably every 500ms without timer cancellation conflicts
  useEffect(() => {
    if (toasts.length === 0) return;
    const interval = setInterval(() => {
      const now = Date.now();
      setToasts((prev) => prev.filter((t) => t.expiresAt > now));
    }, 500);
    return () => clearInterval(interval);
  }, [toasts.length]);

  // Close modal when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    lastMsgIdRef.current = null; // Reset scroll tracker when opening modal
    const handleClickOutside = (e) => {
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

  // Welcome banner visible for 10 seconds when chat opens
  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      setShowWelcome(true);
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 10000);
      return () => clearTimeout(timer);
    } else {
      setShowWelcome(false);
    }
  }, [isOpen, activeTab]);

  useEffect(() => {
    if (chatBottomRef.current && isOpen && activeTab === 'chat') {
      const currentLastMsg = chatMessages[chatMessages.length - 1];
      const currentLastId = currentLastMsg ? currentLastMsg.id : null;
      if (currentLastId !== lastMsgIdRef.current) {
        lastMsgIdRef.current = currentLastId;
        chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [chatMessages, isOpen, activeTab]);

  // Ensure we always scroll to the bottom when the modal first opens
  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      const scrollToBottom = () => {
        const container = document.getElementById('museum-chat-container');
        if (container) {
          container.scrollTop = container.scrollHeight;
        } else if (chatBottomRef.current) {
          chatBottomRef.current.scrollIntoView({ behavior: 'auto' });
        }
      };
      // Try multiple times to catch different phases of modal animation
      setTimeout(scrollToBottom, 50);
      setTimeout(scrollToBottom, 200);
      setTimeout(scrollToBottom, 400);
    }
  }, [isOpen, activeTab]);

  // Preserve scroll position when older messages are prepended to top
  useEffect(() => {
    if (oldScrollHeightRef.current && activeTab === 'chat') {
      const container = document.getElementById('museum-chat-container');
      if (container) {
        const diff = container.scrollHeight - oldScrollHeightRef.current;
        if (diff > 0) {
          container.scrollTop = diff;
        }
      }
      oldScrollHeightRef.current = null;
    }
  }, [chatMessages, activeTab]);

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    sendChat(inputMsg);
    setInputMsg('');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!editName.trim()) return;
    updateProfile(editName.trim(), isAdmin ? undefined : editColor);
    setActiveTab('chat');
  };

  const totalOnline = (activePlayersList?.length || 0) + 1; // Others + Self

  return (
    <>
      <style>{`
        #museum-chat-container::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
      `}</style>
      {/* ── Compact Live HUD Badge ── */}
      <div style={{
        position: 'fixed',
        bottom: isMobile ? 'auto' : '24px',
        top: isMobile ? '60px' : 'auto',
        left: isMobile ? '16px' : 'auto',
        right: isMobile ? 'auto' : '24px',
        zIndex: 100,
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
          <span>{totalOnline} Online</span>
          <span style={{ opacity: 0.6 }}>•</span>
          <span style={{ color: '#38bdf8' }}>Chat</span>
        </button>
      </div>

      {/* ── Glassmorphic Multiplayer Chat & Profile Modal Box ── */}
      {isOpen && (
        <div ref={modalRef} 
             onClick={(e) => e.stopPropagation()}
             onKeyDown={(e) => e.stopPropagation()}
             style={{
          position: 'fixed',
          bottom: isMobile ? 'auto' : '80px',
          top: isMobile ? '64px' : 'auto',
          right: isMobile ? '14px' : '24px',
          width: '360px',
          maxWidth: isMobile ? 'calc(100vw - 28px)' : '90vw',
          height: '440px',
          maxHeight: isMobile ? 'calc(100vh - 80px)' : '75vh',
          background: 'rgba(9, 9, 11, 0.95)',
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
              Room Chat
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
              My Avatar Profile
            </button>
          </div>

          {/* Body */}
          {activeTab === 'chat' ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Messages List */}
              <div 
                id="museum-chat-container"
                style={{
                  flex: 1, padding: '12px 14px', overflowY: 'auto', overflowX: 'hidden', display: 'flex',
                  flexDirection: 'column', gap: '10px', scrollbarWidth: 'none', msOverflowStyle: 'none'
                }}
                onScroll={(e) => {
                  const target = e.target;
                  if (target.scrollTop <= 10 && hasMoreMessages && !isLoadingOlder && loadMoreMessages) {
                    oldScrollHeightRef.current = target.scrollHeight;
                    loadMoreMessages();
                  }
                }}
              >
                {hasMoreMessages && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!isLoadingOlder && loadMoreMessages) {
                        const container = document.getElementById('museum-chat-container');
                        if (container) oldScrollHeightRef.current = container.scrollHeight;
                        loadMoreMessages();
                      }
                    }}
                    disabled={isLoadingOlder}
                    style={{
                      background: 'rgba(56, 189, 248, 0.1)',
                      border: '1px dashed rgba(56, 189, 248, 0.4)',
                      color: '#38bdf8',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      cursor: isLoadingOlder ? 'wait' : 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      textAlign: 'center',
                      width: '100%',
                      transition: 'all 0.2s',
                      opacity: isLoadingOlder ? 0.6 : 1
                    }}
                  >
                    {isLoadingOlder ? '⏳ Loading older messages from database...' : '⬆️ Scroll up or Click here to load older messages...'}
                  </button>
                )}
                {showWelcome && (
                  <div style={{
                    padding: '8px 12px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.2)', color: '#38bdf8', fontSize: '0.78rem',
                    textAlign: 'center', transition: 'opacity 0.5s ease-out', animation: 'fadeIn 0.3s ease-out'
                  }}>
                    Welcome to the Live Museum! Say hello to nearby explorers. Your chat messages also appear as 3D speech bubbles above your avatar!
                  </div>
                )}

                {chatMessages.map((msg) => (
                  <div key={msg.id} style={{
                    fontSize: '0.84rem', lineHeight: 1.4,
                    wordBreak: 'break-word', overflowWrap: 'anywhere'
                  }}>
                    {msg.system ? (
                      <div style={{ color: '#64748b', fontStyle: 'italic', fontSize: '0.78rem', textAlign: 'center', margin: '4px 0' }}>
                        {msg.text}
                      </div>
                    ) : editingMsgId === msg.id ? (
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '4px 0' }}>
                        <input
                          type="text"
                          value={editText}
                          maxLength={200}
                          onChange={(e) => setEditText(e.target.value)}
                          style={{
                            flex: 1, padding: '4px 8px', borderRadius: '6px', background: '#09090b',
                            border: '1px solid #38bdf8', color: '#fff', fontSize: '0.82rem', outline: 'none'
                          }}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEditing(msg.id);
                            if (e.key === 'Escape') setEditingMsgId(null);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => saveEditing(msg.id)}
                          style={{
                            padding: '4px 8px', borderRadius: '6px', background: '#22c55e', border: 'none',
                            color: '#000', fontWeight: 'bold', fontSize: '0.75rem', cursor: 'pointer'
                          }}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingMsgId(null)}
                          style={{
                            padding: '4px 8px', borderRadius: '6px', background: '#71717a', border: 'none',
                            color: '#fff', fontSize: '0.75rem', cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : msg.senderIsAdmin ? (
                      <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '6px 10px', borderRadius: '6px', borderLeft: '3px solid #f59e0b' }}>
                        <span style={{ color: '#f59e0b', fontWeight: 800, marginRight: '6px' }}>
                          {msg.senderName || 'Admin'}:
                        </span>
                        <span style={{ color: '#fef3c7', fontWeight: 500 }}>{msg.text}</span>
                        {msg.timestamp && (
                          <span style={{ color: '#d97706', fontSize: '0.7rem', marginLeft: '6px' }}>
                            {msg.timestamp}
                          </span>
                        )}
                        {isAdmin && (
                          <span style={{ marginLeft: '8px', display: 'inline-flex', gap: '4px', verticalAlign: 'middle' }}>
                            <button
                              type="button"
                              onClick={() => startEditing(msg)}
                              title="Edit message"
                              style={{
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                padding: '0 2px', fontSize: '0.75rem', opacity: 0.7, color: '#93c5fd'
                              }}
                            >
                              ✏️
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteChat && deleteChat(msg.id)}
                              title="Delete message"
                              style={{
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                padding: '0 2px', fontSize: '0.75rem', opacity: 0.7, color: '#fca5a5'
                              }}
                            >
                              🗑️
                            </button>
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
                        {isAdmin && (
                          <span style={{ marginLeft: '8px', display: 'inline-flex', gap: '4px', verticalAlign: 'middle' }}>
                            <button
                              type="button"
                              onClick={() => startEditing(msg)}
                              title="Edit message"
                              style={{
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                padding: '0 2px', fontSize: '0.75rem', opacity: 0.7, color: '#93c5fd'
                              }}
                            >
                              ✏️
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteChat && deleteChat(msg.id)}
                              title="Delete message"
                              style={{
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                padding: '0 2px', fontSize: '0.75rem', opacity: 0.7, color: '#fca5a5'
                              }}
                            >
                              🗑️
                            </button>
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
                <div style={{ position: 'relative', flex: 1, display: 'flex' }}>
                  <input
                    ref={chatInputRef}
                    type="text"
                    maxLength={200}
                    placeholder="Type to chat (max 200 chars)..."
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    style={{
                      flex: 1, padding: '8px 50px 8px 12px', borderRadius: '20px', background: '#09090b',
                      border: '1px solid #27272a', color: '#ffffff', fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                  <span style={{
                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                    fontSize: '0.68rem', color: inputMsg.length >= 180 ? '#ef4444' : '#64748b',
                    pointerEvents: 'none', fontWeight: 600
                  }}>
                    {inputMsg.length}/200
                  </span>
                </div>
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
                {isAdmin ? (
                  <div style={{
                    padding: '12px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)', color: '#f59e0b', fontSize: '0.82rem',
                    textAlign: 'center', fontWeight: 600
                  }}>
                    👑 Avatar Color selection is disabled in Admin mode (VIP Gold is permanently active).
                  </div>
                ) : (
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
                )}
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

      {/* ── Floating Temporary HUD Chat Toasts ── */}
      {toasts.length > 0 && (
        <div style={{
          position: 'fixed',
          left: isMobile ? '16px' : '24px',
          right: 'auto',
          bottom: isMobile ? 'auto' : '210px',
          top: isMobile ? '110px' : 'auto',
          transform: 'none',
          zIndex: 100,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '8px',
          maxWidth: isMobile ? 'calc(100vw - 28px)' : '380px',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}>
          {toasts.map((msg) => (
            <div key={msg.toastId} style={{
              background: 'rgba(9, 9, 11, 0.88)',
              backdropFilter: 'blur(12px)',
              border: '1px solid #27272a',
              borderLeft: msg.senderIsAdmin ? '3px solid #f59e0b' : '1px solid #27272a',
              borderRadius: '12px', padding: '10px 14px',
              boxShadow: '0 8px 20px rgba(0,0,0,0.6)',
              animation: 'fadeIn 0.3s ease-out',
              fontSize: '0.85rem', lineHeight: 1.4,
              wordBreak: 'break-word', overflowWrap: 'anywhere',
              overflow: 'hidden'
            }}>
              {msg.system ? (
                <div style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.8rem' }}>
                  {msg.text}
                </div>
              ) : msg.senderIsAdmin ? (
                <div>
                  <span style={{ color: '#f59e0b', fontWeight: 800, marginRight: '6px' }}>
                    {msg.senderName || 'Admin'}:
                  </span>
                  <span style={{ color: '#fef3c7', fontWeight: 500 }}>{msg.text}</span>
                </div>
              ) : (
                <div>
                  <span style={{ color: msg.senderColor || '#38bdf8', fontWeight: 700, marginRight: '6px' }}>
                    {msg.senderName || 'Visitor'}:
                  </span>
                  <span style={{ color: '#e2e8f0' }}>{msg.text}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default MultiplayerChatModal;
