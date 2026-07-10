import React, { useState, useEffect, useRef, useContext } from 'react';
import { Rnd } from 'react-rnd';
import { MdTerminal } from 'react-icons/md';
import { useTerminalLogic } from './useTerminalLogic';
import TerminalHeader from './TerminalHeader';
import TerminalBody from './TerminalBody';
import { AppContext } from '../../../App';

const TerminalFloating = ({ isEmbed = false }) => {
    // Start closed even in embed mode, because the animated cursor will click it open
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);

    const { input, setInput, history, suggestion, handleCommand, isAiMode } = useTerminalLogic();
    const { headerContainerRef } = useContext(AppContext);

    const bottomRef = useRef(null);
    const bodyRef = useRef(null);
    const inputRef = useRef(null);
    const rndRef = useRef(null);
    const containerRef = useRef(null);

    // Initial default size and position for Rnd
    const getInitialSize = () => {
        if (typeof window !== 'undefined') {
            const w = window.innerWidth;
            const h = window.innerHeight;
            if (w < 768) return { width: w - 32, height: Math.min(850, h * 0.9) }; // Mobile
            if (w < 1300) return { width: Math.max(600, w * 0.8), height: h * 0.7 }; // Tablet / Small Desktop
            return { width: 1260, height: 720 }; // Large Desktop
        }
        return { width: 1260, height: 720 };
    };

    const [size, setSize] = useState(getInitialSize());
    
    // We update position whenever it is opened so initial state can just be 0
    const [position, setPosition] = useState(() => {
        if (isEmbed && typeof window !== 'undefined') {
            const initialSize = getInitialSize();
            return {
                x: (window.innerWidth / 2) - (initialSize.width / 2),
                y: (window.innerHeight / 2) - (initialSize.height / 2)
            };
        }
        return { x: 0, y: 0 };
    });

    // Close terminal on click outside
    useEffect(() => {
        if (!isOpen || isEmbed) return; // Don't close on click outside if in embed mode

        const handleClickOutside = (e) => {
            // Ignore clicks on the toggle button so we don't conflict with toggleOpen
            if (e.target.closest('.terminal-toggle-btn')) return;
            
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, isEmbed]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (!isMinimized && bodyRef.current) {
            bodyRef.current.scrollTo({
                top: bodyRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [history, isOpen, isMinimized, isMaximized]);

    // Focus input on open
    useEffect(() => {
        if (isOpen && !isMinimized) {
            setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 100);
        }
    }, [isOpen, isMinimized, isMaximized]);

    // Auto-typing simulation and cursor animation for embed mode
    useEffect(() => {
        // Pause auto-scrolling while terminal sequence happens
        window.disableAutoScroll = true;
        
        if (!isEmbed) return;

        let isCancelled = false;

        const runSimulation = async () => {
            // Wait for initial page load and entrance animation
            await new Promise(r => setTimeout(r, 2000));
            if (isCancelled) return;



            const fakeCursor = document.getElementById('embed-fake-cursor');
            const toggleBtn = document.querySelector('.terminal-toggle-btn');
            
            if (fakeCursor && toggleBtn) {
                const { default: gsap } = await import('gsap');

                // Helper to get exact body-relative coordinates
                const getCoords = (el) => {
                    const rect = el.getBoundingClientRect();
                    return {
                        x: rect.left + window.scrollX + rect.width / 2,
                        y: rect.top + window.scrollY + rect.height / 2
                    };
                };

                const toggleCoords = getCoords(toggleBtn);

                // 1. Zoom in to the floating terminal button using its exact position as the center
                gsap.to(document.body, { scale: 1.3, transformOrigin: `${toggleCoords.x}px ${toggleCoords.y}px`, duration: 2.5, ease: "power2.inOut" });

                // Move cursor to toggle button starting from the center of the page
                gsap.set(fakeCursor, { 
                    x: window.scrollX + window.innerWidth / 2, 
                    y: window.scrollY + window.innerHeight / 2, 
                    opacity: 1 
                });
                await gsap.to(fakeCursor, { 
                    x: toggleCoords.x, 
                    y: toggleCoords.y,
                    duration: 2.5,
                    ease: "power2.inOut"
                });
                
                await new Promise(r => setTimeout(r, 500));

                // Simulate click on toggle button
                await gsap.to(fakeCursor, { scale: 0.8, duration: 0.15 });
                toggleBtn.click();
                await gsap.to(fakeCursor, { scale: 1, duration: 0.15 });
                
                // 2. Zoom out
                await gsap.to(document.body, { scale: 1, duration: 2.5, ease: "power2.inOut" });

                // 3. Zoom in to the full screen button
                const maxBtn = document.getElementById('terminal-maximize-btn');
                if (maxBtn) {
                    const maxCoords = getCoords(maxBtn);
                    
                    // Zoom using the button as origin
                    gsap.to(document.body, { scale: 1.3, transformOrigin: `${maxCoords.x}px ${maxCoords.y}px`, duration: 2.5, ease: "power2.inOut" });

                    await gsap.to(fakeCursor, { 
                        x: maxCoords.x, 
                        y: maxCoords.y,
                        duration: 2.5,
                        ease: "power2.inOut"
                    });
                    
                    await new Promise(r => setTimeout(r, 500));

                    // Simulate click to maximize
                    await gsap.to(fakeCursor, { scale: 0.8, duration: 0.15 });
                    maxBtn.click();
                    await gsap.to(fakeCursor, { scale: 1, duration: 0.15 });
                }

                // Zoom back out immediately after clicking maximize
                await gsap.to(document.body, { scale: 1, duration: 2.5, ease: "power2.inOut" });
                
                // 4. Zoom to the user who is typing
                let inputCoords;
                if (inputRef.current) {
                    inputCoords = {
                        // The user requested to push the zoom to the absolute maximum top left corner!
                        x: window.scrollX, 
                        y: window.scrollY
                    };
                } else {
                    // Fallback to absolute top-left
                    inputCoords = {
                        x: window.scrollX,
                        y: window.scrollY
                    };
                }
                await gsap.to(document.body, { scale: 1.4, transformOrigin: `${inputCoords.x}px ${inputCoords.y}px`, duration: 2.5, ease: "power2.inOut" });
            }

            // Wait a bit before typing starts
            await new Promise(r => setTimeout(r, 500));
            
            const typeAndEnter = async (text, waitAfter = 3000) => {
                const inputEl = inputRef.current;
                if (!inputEl) return;

                // Clear input first
                setInput('');
                await new Promise(r => setTimeout(r, 200));

                let currentText = '';
                for (let i = 0; i < text.length; i++) {
                    if (isCancelled) return;
                    currentText += text[i];
                    setInput(currentText);
                    // Slower typing speed
                    await new Promise(r => setTimeout(r, 100 + Math.random() * 150));
                }
                
                await new Promise(r => setTimeout(r, 800));
                if (isCancelled) return;
                
                // Hack to trigger React's controlled input submission
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                nativeInputValueSetter.call(inputEl, currentText);
                inputEl.dispatchEvent(new Event('input', { bubbles: true }));
                inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
                
                await new Promise(r => setTimeout(r, waitAfter)); // wait before next command
            };

            // Sequence of commands requested by user
            if (!isCancelled) {
                await typeAndEnter("/help", 3500);
                await typeAndEnter("/ask", 2000);
                await typeAndEnter("who is abdul mannan saipi ?", 7000); 
            }

            // 5. Zoom to close the terminal
            if (!isCancelled) {
                const { default: gsap } = await import('gsap');
                const fakeCursor = document.getElementById('embed-fake-cursor');
                const closeBtn = document.getElementById('terminal-close-btn');

                // Get fresh coords (in case scrolling somehow happened, though it shouldn't)
                const getCoords = (el) => {
                    const rect = el.getBoundingClientRect();
                    return {
                        x: rect.left + window.scrollX + rect.width / 2,
                        y: rect.top + window.scrollY + rect.height / 2
                    };
                };

                if (fakeCursor && closeBtn) {
                    const closeCoords = getCoords(closeBtn);
                    
                    await gsap.to(fakeCursor, { 
                        x: closeCoords.x -10, 
                        y: closeCoords.y -15,
                        duration: 2.5,
                        ease: "power2.inOut"
                    });
                    
                    await new Promise(r => setTimeout(r, 500));

                    // Click close
                    await gsap.to(fakeCursor, { scale: 0.8, duration: 0.15 });
                    closeBtn.click();
                    await gsap.to(fakeCursor, { scale: 1, duration: 0.15 });

                    // Hide cursor
                    gsap.to(fakeCursor, { opacity: 0, duration: 1 });
                }

                // Zoom out and resume
                await gsap.to(document.body, { scale: 1, duration: 2.5, ease: "power2.inOut" });
            }

            // Allow auto-scroll to resume
            window.disableAutoScroll = false;
        };

        runSimulation();

        return () => { 
            isCancelled = true; 
            window.disableAutoScroll = false;
        };
    }, [isEmbed, setInput]);

    // Close terminal if scrolled out of view
    useEffect(() => {
        if (!isOpen || isMaximized || isEmbed) return;

        const handleScroll = () => {
            if (bodyRef.current && bodyRef.current.parentElement) {
                const rect = bodyRef.current.parentElement.getBoundingClientRect();
                // If the terminal is completely above or below the viewport
                if (rect.bottom < 0 || rect.top > window.innerHeight) {
                    setIsOpen(false);
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isOpen, isMaximized, isEmbed]);

    // Prevent body scrolling when terminal is maximized
    useEffect(() => {
        if (isOpen && isMaximized) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen, isMaximized]);

    const handleTerminalClick = () => {
        if (!isMinimized) {
            inputRef.current?.focus({ preventScroll: true });
        }
    };

    const toggleOpen = () => {
        if (!isOpen) {
            // Extract numeric values from size string (e.g. "600px" -> 600)
            const currentInitial = getInitialSize();
            const w = parseFloat(size.width) || currentInitial.width;
            const h = parseFloat(size.height) || currentInitial.height;

            // Reset position to center of the CURRENT viewport (accounting for scroll)
            setPosition({ 
                x: window.scrollX + (window.innerWidth / 2 - w / 2), 
                y: window.scrollY + (window.innerHeight / 2 - h / 2) 
            });
            setIsMinimized(false);
            
            if (headerContainerRef?.current) {
                headerContainerRef.current.classList.remove("z-7");
            }
        }
        setIsOpen(!isOpen);
    };

    const terminalClasses = `
        cursor-none bg-black/75 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col overflow-hidden transition-all duration-300
        ${isMaximized ? (isEmbed ? 'absolute top-0 left-0 z-50 rounded-none w-screen h-screen' : 'fixed inset-0 z-50 rounded-none w-screen h-screen') : 'rounded-lg w-full h-full'}
        ${isMinimized && !isMaximized ? 'h-[44px] !min-h-0' : ''}
    `;

    return ( 
        <>
            {/* Floating Toggle Button */}
            <button 
                onClick={toggleOpen}
                className={`cursor-none terminal-toggle-btn ${isEmbed ? 'absolute' : 'fixed'} w-14 h-14 bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-white shadow-2xl transition-all z-5 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
                style={isEmbed ? { 
                    top: 'calc(100vh - 80px)', 
                    left: 'calc(100vw - 80px)' 
                } : { bottom: '1.5rem', right: '1.5rem' }}
                title="Open Terminal"
            >
                <MdTerminal size={28} />
            </button>

            {/* Terminal Window via Rnd */}
            {isOpen && (
                <Rnd
                    ref={rndRef}
                    className={`z-50 ${isMaximized ? '!transform-none' : ''}`}
                    size={isMaximized ? { width: '100%', height: '100%' } : isMinimized ? { width: size.width, height: 44 } : size}
                    position={isMaximized ? { x: 0, y: 0 } : position}
                    onDrag={(e, d) => {
                        if (!isMaximized) setPosition({ x: d.x, y: d.y });
                    }}
                    onDragStop={(e, d) => {
                        if (!isMaximized) setPosition({ x: d.x, y: d.y });
                    }}
                    onResize={(e, direction, ref, delta, position) => {
                        if (!isMaximized) {
                            setSize({
                                width: ref.style.width,
                                height: ref.style.height,
                            });
                            setPosition(position);
                        }
                    }}
                    onResizeStop={(e, direction, ref, delta, position) => {
                        if (!isMaximized) {
                            setSize({
                                width: ref.style.width,
                                height: ref.style.height,
                            });
                            setPosition(position);
                        }
                    }}
                    minWidth={280}
                    minHeight={isMinimized ? 44 : 200}
                    dragHandleClassName="terminal-header"
                    cancel="button"
                    disableDragging={isMaximized}
                    enableResizing={
                        !isMaximized && !isMinimized
                            ? { top: true, right: true, bottom: true, left: true, topRight: true, bottomRight: true, bottomLeft: true, topLeft: true }
                            : { top: false, right: false, bottom: false, left: false, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }
                    }
                    style={{
                        pointerEvents: isOpen ? 'auto' : 'none',
                        visibility: isOpen ? 'visible' : 'hidden'
                    }}
                >
                    <div ref={containerRef} className={terminalClasses} onClick={handleTerminalClick}>
                        <TerminalHeader 
                            setIsOpen={setIsOpen}
                            isMinimized={isMinimized}
                            setIsMinimized={setIsMinimized}
                            isMaximized={isMaximized}
                            setIsMaximized={setIsMaximized}
                        />

                        {!isMinimized && (
                            <TerminalBody 
                                bodyRef={bodyRef}
                                history={history}
                                inputRef={inputRef}
                                input={input}
                                setInput={setInput}
                                handleCommand={handleCommand}
                                suggestion={suggestion}
                                bottomRef={bottomRef}
                                isAiMode={isAiMode}
                            />
                        )}
                    </div>
                </Rnd>
            )}

            {/* Fake Cursor for Embed Animation */}
            {isEmbed && (
                <div 
                    id="embed-fake-cursor" 
                    className="absolute top-0 left-0 w-8 h-8 z-[9999] pointer-events-none opacity-0 drop-shadow-lg"
                    style={{
                        transformOrigin: '0 0'
                    }}
                >
                    <svg viewBox="0 0 24 24" fill="white" stroke="black" strokeWidth="1.5" className="w-6 h-6">
                        <path d="M4 4l5.5 17.5 3-7.5 7.5-3z" />
                    </svg>
                </div>
            )}
        </>
    );
};

export default TerminalFloating;
