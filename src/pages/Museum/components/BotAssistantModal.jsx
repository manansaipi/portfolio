import React, { useState, useEffect, useRef } from 'react';
import { askAI } from '@services/ai';
import { playAIAudioAndStreamText, stopAIAudio } from '../utils/useAIAudioStream';
import { renderFormattedText } from '@components/ui/Terminal/utils/terminalFormatters';
import { THINKING_MESSAGES, THINKING_MESSAGE_MEDIUM, THINKING_MESSAGE_LONGER } from '@components/ui/Terminal/hooks/consts';

const BotAssistantModal = ({ isOpen, onClose, onSpeakingChange, onSpeechTextChange }) => {
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: "Hello! I'm Abdul Mannan's AI Assistant. I'm here to help you learn more about Abdul's projects, technical expertise, professional experience, achievements, and creative work. Feel free to ask me anything, and I'll be happy to assist you.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentThinkingMsg, setCurrentThinkingMsg] = useState('');
  const [streamingText, setStreamingText] = useState('');
  const chatBottomRef = useRef(null);
  const inputRef = useRef(null);
  const openTimeRef = useRef(Date.now());

  const thinkingIntervalRef = useRef(null);
  const typingIntervalRef = useRef(null);

  // Auto-focus input text box when modal opens!
  useEffect(() => {
    if (isOpen) {
      openTimeRef.current = Date.now();
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, currentThinkingMsg, streamingText]);

  // Terminal-identical character-by-character (30ms per char) streaming thinking animation
  const streamThinkingText = (fullText) => {
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    
    let charIdx = 0;
    setCurrentThinkingMsg('');
    if (onSpeechTextChange) onSpeechTextChange('');

    typingIntervalRef.current = setInterval(() => {
      if (charIdx <= fullText.length) {
        const partial = fullText.slice(0, charIdx);
        setCurrentThinkingMsg(partial);
        if (onSpeechTextChange) onSpeechTextChange(partial);
        charIdx++;
      } else {
        clearInterval(typingIntervalRef.current);
      }
    }, 30); // 30ms per char (terminal typewriter speed!)
  };

  // Terminal-identical cycling thinking animation logic
  const startThinkingCycle = () => {
    let ticks = 0;
    let lastMessage = THINKING_MESSAGES[0];
    
    // Stream first thinking message character by character!
    streamThinkingText(lastMessage);

    if (thinkingIntervalRef.current) clearInterval(thinkingIntervalRef.current);

    thinkingIntervalRef.current = setInterval(() => {
      ticks++;
      let nextArray = ticks < 2 ? THINKING_MESSAGES.slice(1)
                    : ticks < 4 ? THINKING_MESSAGE_MEDIUM
                    : THINKING_MESSAGE_LONGER;

      let randomMsg;
      if (nextArray.length > 1) {
        do {
          randomMsg = nextArray[Math.floor(Math.random() * nextArray.length)];
        } while (randomMsg === lastMessage);
      } else {
        randomMsg = nextArray[0];
      }
      lastMessage = randomMsg;

      // Stream each cycled thinking message character by character!
      streamThinkingText(randomMsg);
    }, 4200);
  };

  const stopThinkingCycle = () => {
    if (thinkingIntervalRef.current) {
      clearInterval(thinkingIntervalRef.current);
      thinkingIntervalRef.current = null;
    }
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
  };

  if (!isOpen) return null;

  const handleSend = async (queryText) => {
    const textToSend = queryText || input.trim();
    if (!textToSend || isLoading) return;

    // Append user message
    const newMsgList = [...messages, { sender: 'user', text: textToSend }];
    setMessages(newMsgList);
    setInput('');
    setIsLoading(true);
    setStreamingText('');

    // Start terminal character streaming thinking cycle!
    startThinkingCycle();
    if (onSpeakingChange) onSpeakingChange(true);

    try {
      const responseObj = await askAI(textToSend);
      const answerText = typeof responseObj === 'string' ? responseObj : (responseObj?.text || "I'm happy to answer any questions about Abdul's portfolio!");
      const audioResult = typeof responseObj === 'object' ? responseObj.audioResult : null;

      stopThinkingCycle();
      setIsLoading(false);

      // Stream audio and text inside modal in 100% perfect 1-to-1 sync!
      playAIAudioAndStreamText(
        answerText,
        audioResult,
        (charCount) => {
          const partial = answerText.slice(0, charCount);
          setStreamingText(partial);
          if (onSpeechTextChange) onSpeechTextChange(partial);
        },
        () => {
          // Synchronous atomic batch update to prevent double-message flicker!
          setStreamingText('');
          setMessages((prev) => [...prev, { sender: 'assistant', text: answerText }]);
          if (onSpeakingChange) onSpeakingChange(false);
        }
      );
    } catch (err) {
      const fallbackMsg = "Abdul Mannan Saipi is a Software Engineer at Samsung R&D Indonesia with expertise in Full-Stack, Flutter, FastAPI, and Cloud Architecture.";
      stopThinkingCycle();
      setIsLoading(false);

      playAIAudioAndStreamText(
        fallbackMsg,
        null,
        (charCount) => {
          const partial = fallbackMsg.slice(0, charCount);
          setStreamingText(partial);
          if (onSpeechTextChange) onSpeechTextChange(partial);
        },
        () => {
          setStreamingText('');
          setMessages((prev) => [...prev, { sender: 'assistant', text: fallbackMsg }]);
          if (onSpeakingChange) onSpeakingChange(false);
        }
      );
    }
  };

  return (
    /* Outer Backdrop: Clicking outside the modal container closes the modal! */
    <div
      onClick={() => {
        if (Date.now() - openTimeRef.current < 400) return;
        if (onClose) onClose();
      }}
      style={{
        position: 'fixed', inset: 0, zIndex: 999, pointerEvents: 'auto',
        background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}
    >
      <style>{`
        .modal-chat-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {/* Inner Modal Container: Prevent backdrop close when clicking inside */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '560px', maxWidth: '92vw', height: '580px', maxHeight: '90vh',
          background: '#09090b', border: '1px solid #27272a', borderRadius: '16px',
          display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.8), 0 0 20px rgba(56, 189, 248, 0.2)',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '16px 20px', background: '#18181b', borderBottom: '1px solid #27272a',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
            }}>
              🤖
            </div>
            <div>
              <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.05rem', fontWeight: 700 }}>AI Assistant</h3>
              <p style={{ margin: 0, color: '#38bdf8', fontSize: '0.75rem', fontWeight: 600 }}>Online • Portfolio Q&A Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.08)', color: '#ffffff', border: 'none',
              width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer',
              fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            ✕
          </button>
        </div>

        {/* Chat History Messages with Hidden Scrollbar */}
        <div
          className="modal-chat-container"
          style={{
            flex: 1, padding: '16px', overflowY: 'auto',
            scrollbarWidth: 'none', msOverflowStyle: 'none',
            display: 'flex', flexDirection: 'column', gap: '12px'
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <div style={{
                maxWidth: '85%', padding: '10px 14px', borderRadius: '12px',
                fontSize: '0.88rem', lineHeight: 1.5,
                background: msg.sender === 'user' ? '#0284c7' : '#18181b',
                color: '#ffffff', border: msg.sender === 'user' ? 'none' : '1px solid #27272a',
                borderTopLeftRadius: msg.sender === 'assistant' ? '2px' : '12px',
                borderTopRightRadius: msg.sender === 'user' ? '2px' : '12px',
              }}>
                {msg.sender === 'assistant' ? (
                  <div className="terminal-chat-formatted">
                    {renderFormattedText(msg.text)}
                  </div>
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}

          {/* Active Audio-Synchronized Character Streaming Assistant Response */}
          {streamingText && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                maxWidth: '85%', padding: '10px 14px', borderRadius: '12px',
                fontSize: '0.88rem', lineHeight: 1.5, background: '#18181b',
                color: '#ffffff', border: '1px solid #38bdf8', borderTopLeftRadius: '2px',
              }}>
                <div className="terminal-chat-formatted">
                  {renderFormattedText(streamingText)}
                </div>
              </div>
            </div>
          )}

          {/* Terminal-Identical Character-Streaming Thinking Animation */}
          {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                padding: '10px 14px', borderRadius: '12px', background: '#18181b',
                border: '1px solid #0284c7', color: '#38bdf8', fontSize: '0.85rem', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                <span className="animate-pulse">🧠</span>
                <span>{currentThinkingMsg}</span>
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Input Text Box (Auto-Focused on open!) */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          style={{ padding: '12px 16px', background: '#18181b', borderTop: '1px solid #27272a', display: 'flex', gap: '10px' }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI Assistant about Abdul's portfolio, skills, projects... (Press Enter)"
            style={{
              flex: 1, background: '#09090b', color: '#ffffff', border: '1px solid #27272a',
              padding: '10px 14px', borderRadius: '8px', fontSize: '0.88rem', outline: 'none'
            }}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            style={{
              background: '#0284c7', color: '#ffffff', border: 'none',
              padding: '0 18px', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 700,
              cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer', opacity: isLoading || !input.trim() ? 0.5 : 1
            }}
          >
            Send (Enter)
          </button>
        </form>
      </div>
    </div>
  );
};

export default BotAssistantModal;
