import React from 'react';
import { MdClose, MdMinimize, MdOpenInFull } from 'react-icons/md';

const TerminalHeader = ({ setIsOpen, isMinimized, setIsMinimized, isMaximized, setIsMaximized }) => {
    return (
        <div 
            className="terminal-header relative bg-white/5 border-b border-white/10 p-3 flex items-center justify-between select-none shrink-0"
            onDoubleClick={() => {
                setIsMinimized(false);
                setIsMaximized(!isMaximized);
            }}
        >
            <div className="flex gap-2 relative z-10 shrink-0 py-2 pr-2">
                <button 
                    onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} 
                    onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen(false); }}
                    className="w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center group cursor-none"
                >
                    <MdClose className="text-black/50 opacity-0 group-hover:opacity-100 w-3 h-3" />
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); setIsMaximized(false); setIsMinimized(!isMinimized); }} 
                    onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); setIsMaximized(false); setIsMinimized(!isMinimized); }}
                    className="w-3.5 h-3.5 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center group cursor-none"
                >
                    <MdMinimize className="text-black/50 opacity-0 group-hover:opacity-100 w-3 h-3" />
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); setIsMinimized(false); setIsMaximized(!isMaximized); }} 
                    onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); setIsMinimized(false); setIsMaximized(!isMaximized); }}
                    className="w-3.5 h-3.5 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center group cursor-none"
                >
                    <MdOpenInFull className="text-black/50 opacity-0 group-hover:opacity-100 w-3 h-3" />
                </button>
            </div>
            <div className="text-white/50 text-xs font-mono font-medium tracking-wider pointer-events-none absolute left-1/2 -translate-x-1/2 lg:w-full text-center truncat">guest@manansaipi-portfolio: ~</div>
        </div>
    );
};

export default TerminalHeader;
