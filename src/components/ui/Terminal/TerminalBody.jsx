import React, { useState, useEffect, useRef } from 'react';
import { renderFormattedText } from './utils/terminalFormatters';
import TypewriterText from './components/TypewriterText';
import ThinkingAnimation from './components/ThinkingAnimation';

const TerminalBody = ({ bodyRef, history, inputRef, input, setInput, handleCommand, suggestion, bottomRef, isAiMode, isEmbed }) => {
    const [touchStart, setTouchStart] = useState({ x: null, y: null });
    const [isIdle, setIsIdle] = useState(true);
    const idleTimeoutRef = useRef(null);
    const fakeLayerRef = useRef(null);

    useEffect(() => {
        setIsIdle(false);
        if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
        idleTimeoutRef.current = setTimeout(() => setIsIdle(true), 500);
        return () => clearTimeout(idleTimeoutRef.current);
    }, [input]);

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
                    line.type === 'system' ? 'text-green-400 opacity-80' : 
                    line.type === 'highlight' ? 'font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-red-400 to-green-400 drop-shadow-md animate-gradient' :
                    line.type === 'ai-response' ? 'text-purple-300' : 'text-gray-300'
                }`}>
                    {line.type === 'ai-response' ? (
                        <TypewriterText line={line} />
                    ) : line.content === 'Thinking...' ? (
                        <ThinkingAnimation />
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
                    <span className={`${isAiMode ? 'font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-red-400 to-green-400 animate-gradient drop-shadow-md' : 'text-green-400'} font-semibold mr-2`}>
                        {isAiMode ? 'ai@manansaipi-portfolio:~$' : 'guest@manansaipi-portfolio:~$' }
                    </span>
                    <span className="text-white">{input}</span>
                    {/* Caret */}
                    <span className={`inline-block align-middle w-[2px] h-[1.1em] bg-white rounded-sm -ml-[1px] translate-y-[-1px] transition-opacity duration-300 ${isIdle ? 'animate-ms-caret' : 'opacity-100'}`}></span>
                    <span 
                        className={`pointer-events-auto text-white/30 ml-1 relative z-20 ${isEmbed ? '' : 'cursor-pointer'}`}
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
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleCommand(e);
                        } else {
                            handleCommand(e);
                        }
                    }}
                    className={`absolute inset-0 w-full h-full opacity-0 text-transparent bg-transparent border-none outline-none resize-none z-10 ${isEmbed ? 'pointer-events-none' : 'cursor-text'}`}
                    autoComplete="off"
                    spellCheck="false"
                    readOnly={isEmbed}
                />
            </div>
            <div ref={bottomRef} />
        </div>
    );
};

export default TerminalBody;
