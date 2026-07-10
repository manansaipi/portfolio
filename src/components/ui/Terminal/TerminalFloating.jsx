import React, { useState, useRef, useContext } from 'react';
import { Rnd } from 'react-rnd';
import { useTerminalLogic } from './hooks/useTerminalLogic';
import TerminalHeader from './TerminalHeader';
import TerminalBody from './TerminalBody';
import { AppContext } from '../../../App';

import { useTerminalSimulation } from './hooks/useTerminalSimulation';
import { useTerminalBehaviors } from './hooks/useTerminalBehaviors';
import { useTerminalSizeAndPosition } from './hooks/useTerminalSizeAndPosition';
import TerminalToggleButton from './components/TerminalToggleButton';
import FakeCursor from './components/FakeCursor';

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

    const { size, setSize, position, setPosition, getInitialSize } = useTerminalSizeAndPosition(isEmbed);

    // Custom Hooks
    useTerminalSimulation({ isEmbed, setInput, inputRef });
    useTerminalBehaviors({
        isOpen, setIsOpen,
        isMinimized,
        isMaximized,
        isEmbed,
        containerRef,
        bodyRef,
        inputRef,
        history
    });

    const handleTerminalClick = () => {
        if (!isMinimized) {
            inputRef.current?.focus({ preventScroll: true });
        }
    };

    const toggleOpen = () => {
        if (!isOpen) {
            const currentInitial = getInitialSize();
            const w = parseFloat(size.width) || currentInitial.width;
            const h = parseFloat(size.height) || currentInitial.height;

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
            <TerminalToggleButton isOpen={isOpen} toggleOpen={toggleOpen} isEmbed={isEmbed} />

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
                                isEmbed={isEmbed}
                            />
                        )}
                    </div>
                </Rnd>
            )}

            <FakeCursor isEmbed={isEmbed} />
        </>
    );
};

export default TerminalFloating;
