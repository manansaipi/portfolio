import React, { useState, useEffect, useRef } from 'react';
import { renderFormattedText } from './utils/terminalFormatters';
import TypewriterText from './components/TypewriterText';
import ThinkingAnimation from './components/ThinkingAnimation';
import MatrixRain from './components/MatrixRain';

const TerminalBody = ({ bodyRef, history, inputRef, input, setInput, handleCommand, suggestion, bottomRef, isAiMode, isEmbed, isProcessing, isStreaming, setIsStreaming }) => {
    const [touchStart, setTouchStart] = useState({ x: null, y: null });
    const [isIdle, setIsIdle] = useState(true);
    const [cursorPosition, setCursorPosition] = useState(0);
    const idleTimeoutRef = useRef(null);
    const fakeLayerRef = useRef(null);

    useEffect(() => {
        setIsIdle(false);
        if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
        idleTimeoutRef.current = setTimeout(() => setIsIdle(true), 500);
        
        if (inputRef.current) {
            setCursorPosition(inputRef.current.selectionStart);
        }
        
        return () => clearTimeout(idleTimeoutRef.current);
    }, [input]);

    const updateCursorPosition = () => {
        // Use setTimeout to ensure we read the selectionStart AFTER the browser
        // has processed the default keystroke action (like moving the cursor).
        setTimeout(() => {
            if (inputRef.current) {
                setCursorPosition(inputRef.current.selectionStart);
            }
        }, 0);
    };

    const handleTouchStart = (e) => {
        setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    };

    const handleTouchEnd = (e) => {
        if (touchStart.x === null) return;
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const diffX = touchEndX - touchStart.x;
        const diffY = touchEndY - touchStart.y;

        // If swipe distance is > 40px horizontally and more horizontal than vertical
        if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
            if (suggestion) {
                setInput(suggestion);
                inputRef.current?.focus();
            }
        }
        setTouchStart({ x: null, y: null });
    };

    return (
        <div 
            ref={bodyRef} 
            className="flex-1 p-4 overflow-y-auto font-mono text-sm md:text-base [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            data-lenis-prevent="true"
        >
            {history.map((line, i) => (
                <div key={i} className={`mb-1.5 leading-relaxed break-words ${
                    line.type === 'command' ? 'text-white font-semibold' :
                    line.type === 'error' ? 'text-red-400' :
                    line.type === 'system' || line.type === 'loading' ? 'text-green-400 opacity-80' : 
                    line.type === 'highlight' ? 'font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-red-400 to-green-400 drop-shadow-md animate-gradient' :
                    line.type === 'ai-response' ? 'text-purple-300' : 'text-gray-300'
                }`}>
                    {line.type === 'matrix' ? (
                        <MatrixRain />
                    ) : line.type === 'ai-response' ? (
                        <TypewriterText line={line} setIsStreaming={setIsStreaming} />
                    ) : line.type === 'loading' ? (
                        <ThinkingAnimation text={line.content} />
                    ) : line.type === 'command' && line.content.startsWith('ai@manansaipi-portfolio:~$') ? (
                        <>
                            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-red-400 to-green-400 animate-gradient">
                                ai@manansaipi-portfolio:~$
                            </span>
                            <span className="ml-2">{line.content.replace('ai@manansaipi-portfolio:~$ ', '')}</span>
                        </>
                    ) : line.type === 'command' && line.content.startsWith('guest@manansaipi-portfolio:~$') ? (
                        <>
                            <span className="text-green-400">
                                guest@manansaipi-portfolio:~$
                            </span>
                            <span className="ml-2">{line.content.replace('guest@manansaipi-portfolio:~$ ', '')}</span>
                        </>
                    ) : (
                        renderFormattedText(line.content)
                    )}
                </div>
            ))}
            
            <div className="relative mt-2 w-full">
                {/* Visible Fake Layer */}
                <div className="pointer-events-none font-mono whitespace-pre-wrap break-all leading-relaxed w-full">
                    <span className={`${isAiMode ? 'font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-red-400 to-green-400 animate-gradient drop-shadow-md' : 'text-green-400'} font-semibold`}>
                        {isAiMode ? 'ai@manansaipi-portfolio:~$ ' : 'guest@manansaipi-portfolio:~$ ' }
                    </span>
                    <span className="text-white">{input.slice(0, cursorPosition)}</span>
                    {/* Caret */}
                    <span className={`inline-block align-middle w-[2px] h-[1.1em] bg-white rounded-sm -ml-[1px] translate-y-[-1px] transition-opacity duration-300 ${(!isProcessing && !isStreaming && isIdle) ? 'animate-ms-caret' : 'opacity-0'}`}></span>
                    <span className="text-white">{input.slice(cursorPosition)}</span>
                    <span 
                        className={`text-white/30 relative z-20 ${isEmbed ? '' : 'cursor-pointer'}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            if(suggestion && !isEmbed) {
                                setInput(suggestion);
                                inputRef.current?.focus();
                            }
                        }}
                        onTouchEnd={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if(suggestion && !isEmbed) {
                                setInput(suggestion);
                                inputRef.current?.focus();
                            }
                        }}
                    >
                        {suggestion ? suggestion.slice(input.length) : ''}
                    </span>
                </div>

                {/* Hidden interactive textarea */}
                <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                        updateCursorPosition();
                    }}
                    onSelect={updateCursorPosition}
                    onClick={updateCursorPosition}
                    onKeyUp={updateCursorPosition}
                    onKeyDown={(e) => {
                        updateCursorPosition();
                        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Home' || e.key === 'End') {
                            // Let the browser handle the cursor movement, update position in the next tick
                            setTimeout(updateCursorPosition, 0);
                        }
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleCommand(e);
                        } else {
                            handleCommand(e);
                        }
                    }}
                    className={`absolute inset-0 w-full h-full opacity-0 text-transparent bg-transparent border-none outline-none resize-none z-10 p-0 m-0 font-mono text-sm md:text-base leading-relaxed whitespace-pre-wrap break-all ${(isEmbed || isProcessing || isStreaming) ? 'pointer-events-none' : 'cursor-text'}`}
                    style={{ textIndent: isAiMode ? '27ch' : '30ch' }}
                    autoComplete="off"
                    spellCheck="false"
                    readOnly={isEmbed || isProcessing || isStreaming}
                    tabIndex={isEmbed ? -1 : 0}
                />
            </div>
            <div ref={bottomRef} />
        </div>
    );
};

export default TerminalBody;
