import React, { useState, useEffect, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { getAllWorks } from '@services/workService';
import { getAllWritings } from '@services/postService';
import { getCertificates } from '@services/adminService';
import { MdClose, MdMinimize, MdOpenInFull, MdTerminal } from 'react-icons/md';

const TerminalFloating = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);

    const [input, setInput] = useState('');
    const [history, setHistory] = useState([
        { type: 'system', content: 'Welcome to Portfolio Terminal v2.0' },
        { type: 'system', content: 'Type /help to see available commands.' },
    ]);

    const bottomRef = useRef(null);
    const bodyRef = useRef(null);
    const inputRef = useRef(null);
    const rndRef = useRef(null);

    // Initial default size and position for Rnd
    const initialSize = { width: 600, height: 400 };
    const [size, setSize] = useState(initialSize);
    const [position, setPosition] = useState({ 
        x: typeof window !== 'undefined' ? window.innerWidth / 2 - 300 : 0, 
        y: typeof window !== 'undefined' ? window.innerHeight / 2 - 200 : 0 
    });

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

    const handleTerminalClick = () => {
        if (!isMinimized) {
            inputRef.current?.focus({ preventScroll: true });
        }
    };

    const toggleOpen = () => {
        if (!isOpen) {
            // Extract numeric values from size string (e.g. "600px" -> 600)
            const w = parseFloat(size.width) || 600;
            const h = parseFloat(size.height) || 400;

            // Reset position to center of the CURRENT viewport (accounting for scroll)
            setPosition({ 
                x: window.scrollX + (window.innerWidth / 2 - w / 2), 
                y: window.scrollY + (window.innerHeight / 2 - h / 2) 
            });
            setIsMinimized(false);
        }
        setIsOpen(!isOpen);
    };

    const handleCommand = async (e) => {
        if (e.key === 'Enter' && input.trim()) {
            const command = input.trim().toLowerCase();
            setInput('');
            setHistory((prev) => [...prev, { type: 'command', content: `guest@portfolio:~$ ${command}` }]);

            switch (command) {
                case '/help':
                    setHistory((prev) => [
                        ...prev,
                        { type: 'output', content: 'Available commands:' },
                        { type: 'output', content: '  /about        - Brief information about me' },
                        { type: 'output', content: '  /experience   - Fetch my latest work experiences' },
                        { type: 'output', content: '  /writings     - Fetch my recent blog posts' },
                        { type: 'output', content: '  /certificates - Fetch my certificates' },
                        { type: 'output', content: '  /clear        - Clear terminal screen' },
                        { type: 'output', content: '  whoami        - Print current user' },
                        { type: 'output', content: '  date          - Print current date and time' }
                    ]);
                    break;
                case '/about':
                    setHistory((prev) => [
                        ...prev,
                        { type: 'output', content: 'I build digital things that make the complex feel simple.' },
                        { type: 'output', content: 'Clean logic, smooth interactions, real impact.' },
                        { type: 'output', content: 'I turn problems into products. Every line of code is written with clarity and purpose.' }
                    ]);
                    break;
                case '/experience':
                    setHistory((prev) => [...prev, { type: 'system', content: 'Fetching experiences from API...' }]);
                    try {
                        const works = await getAllWorks();
                        const worksOutput = works.map((w, index) => ({
                            type: 'output',
                            content: `[${index + 1}] ${w.title} at ${w.company} (${w.duration}) - ${w.type}`
                        }));
                        setHistory((prev) => [...prev, ...worksOutput]);
                    } catch (err) {
                        setHistory((prev) => [...prev, { type: 'error', content: 'Error fetching experiences.' }]);
                    }
                    break;
                case '/writings':
                    setHistory((prev) => [...prev, { type: 'system', content: 'Fetching posts from API...' }]);
                    try {
                        const posts = await getAllWritings();
                        const postsOutput = posts.map((p, index) => ({
                            type: 'output',
                            content: `[${index + 1}] ${p.title} - ${p.category} (${p.date || 'Unknown date'})`
                        }));
                        setHistory((prev) => [...prev, ...postsOutput]);
                    } catch (err) {
                        setHistory((prev) => [...prev, { type: 'error', content: 'Error fetching writings.' }]);
                    }
                    break;
                case '/certificates':
                    setHistory((prev) => [...prev, { type: 'system', content: 'Fetching certificates from API...' }]);
                    try {
                        const certs = await getCertificates();
                        const certsOutput = certs.map((c, index) => ({
                            type: 'output',
                            content: `[${index + 1}] ${c.name} (${c.year})`
                        }));
                        setHistory((prev) => [...prev, ...certsOutput]);
                    } catch (err) {
                        setHistory((prev) => [...prev, { type: 'error', content: 'Error fetching certificates.' }]);
                    }
                    break;
                case '/clear':
                    setHistory([]);
                    break;
                case 'whoami':
                    setHistory((prev) => [...prev, { type: 'output', content: 'guest' }]);
                    break;
                case 'date':
                    setHistory((prev) => [...prev, { type: 'output', content: new Date().toString() }]);
                    break;
                default:
                    setHistory((prev) => [
                        ...prev,
                        { type: 'error', content: `Command not found: ${command}` },
                        { type: 'output', content: 'Type /help for a list of commands.' }
                    ]);
            }
        }
    };

    // If maximized, we bypass Rnd sizing/positioning and use fixed classes
    const terminalClasses = `
        bg-black/75 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col overflow-hidden transition-all duration-300
        ${isMaximized ? 'fixed inset-0 z-[100] rounded-none w-screen h-screen' : 'rounded-lg w-full h-full'}
        ${isMinimized && !isMaximized ? 'h-[44px] !min-h-0' : ''}
    `;

    return (
        <>
            {/* Floating Toggle Button */}
            <button 
                onClick={toggleOpen}
                className={`fixed bottom-6 right-6 w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white shadow-xl transition-all z-[90] ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
                title="Open Terminal"
            >
                <MdTerminal size={28} />
            </button>

            {/* Terminal Window via Rnd */}
            {isOpen && (
                <Rnd
                    ref={rndRef}
                    className={`z-[100] ${isMaximized ? '!transform-none' : ''}`}
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
                    minWidth={300}
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
                    <div className={terminalClasses} onClick={handleTerminalClick}>
                        {/* Mac Terminal Header (Draggable) */}
                        <div className="terminal-header bg-white/5 border-b border-white/10 p-3 flex items-center justify-between select-none cursor-move shrink-0">
                            <div className="flex gap-2">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} 
                                    className="w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center group cursor-pointer"
                                >
                                    <MdClose className="text-black/50 opacity-0 group-hover:opacity-100 w-3 h-3" />
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setIsMaximized(false); setIsMinimized(!isMinimized); }} 
                                    className="w-3.5 h-3.5 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center group cursor-pointer"
                                >
                                    <MdMinimize className="text-black/50 opacity-0 group-hover:opacity-100 w-3 h-3" />
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setIsMinimized(false); setIsMaximized(!isMaximized); }} 
                                    className="w-3.5 h-3.5 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center group cursor-pointer"
                                >
                                    <MdOpenInFull className="text-black/50 opacity-0 group-hover:opacity-100 w-3 h-3" />
                                </button>
                            </div>
                            <div className="text-white/50 text-xs font-mono font-medium tracking-wider pointer-events-none">guest@portfolio: ~</div>
                            <div className="w-16"></div> {/* Spacer for centering */}
                        </div>

                        {/* Terminal Body */}
                        {!isMinimized && (
                            <div ref={bodyRef} className="flex-1 p-4 overflow-y-auto font-mono text-sm md:text-base scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                                {history.map((line, i) => (
                                    <div key={i} className={`mb-1.5 leading-relaxed break-words ${
                                        line.type === 'command' ? 'text-white font-semibold' :
                                        line.type === 'error' ? 'text-red-400' :
                                        line.type === 'system' ? 'text-green-400 opacity-80' : 'text-gray-300'
                                    }`}>
                                        {line.content}
                                    </div>
                                ))}
                                
                                <div className="flex items-center mt-2">
                                    <span className="text-green-400 font-semibold mr-2 shrink-0">guest@portfolio:~$</span>
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={handleCommand}
                                        className="flex-1 bg-transparent border-none outline-none text-white font-mono min-w-0"
                                        autoComplete="off"
                                        spellCheck="false"
                                    />
                                </div>
                                <div ref={bottomRef} />
                            </div>
                        )}
                    </div>
                </Rnd>
            )}
        </>
    );
};

export default TerminalFloating;
