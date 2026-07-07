import React, { useState, useEffect, useRef, useContext } from 'react';
import { Rnd } from 'react-rnd';
import { MdTerminal } from 'react-icons/md';
import { useTerminalLogic } from './useTerminalLogic';
import TerminalHeader from './TerminalHeader';
import TerminalBody from './TerminalBody';
import { AppContext } from '../../../App';

const TerminalFloating = () => {
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
            if (w < 768) return { width: w - 32, height: Math.min(500, h * 0.7) }; // Mobile
            if (w < 1300) return { width: Math.max(600, w * 0.8), height: h * 0.7 }; // Tablet / Small Desktop
            return { width: 1260, height: 720 }; // Large Desktop
        }
        return { width: 1260, height: 720 };
    };

    const [size, setSize] = useState(getInitialSize());
    
    // We update position whenever it is opened so initial state can just be 0
    const [position, setPosition] = useState({ x: 0, y: 0 });

    // Close terminal on click outside
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e) => {
            // Ignore clicks on the toggle button so we don't conflict with toggleOpen
            if (e.target.closest('.terminal-toggle-btn')) return;
            
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

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

    // Close terminal if scrolled out of view
    useEffect(() => {
        if (!isOpen || isMaximized) return;

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
    }, [isOpen, isMaximized]);

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
        ${isMaximized ? 'fixed inset-0 z-5 rounded-none w-screen h-screen' : 'rounded-lg w-full h-full'}
        ${isMinimized && !isMaximized ? 'h-[44px] !min-h-0' : ''}
    `;

    return ( 
        <>
            {/* Floating Toggle Button */}
            <button 
                onClick={toggleOpen}
                className={`cursor-none terminal-toggle-btn fixed bottom-6 right-6 w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white shadow-xl transition-all z-5 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
                title="Open Terminal"
            >
                <MdTerminal size={28} />
            </button>

            {/* Terminal Window via Rnd */}
            {isOpen && (
                <Rnd
                    ref={rndRef}
                    className={`z-5 ${isMaximized ? '!transform-none' : ''}`}
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
        </>
    );
};

export default TerminalFloating;
