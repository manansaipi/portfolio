import React from 'react';
import { MdTerminal } from 'react-icons/md';

const TerminalToggleButton = ({ isOpen, toggleOpen, isEmbed }) => {
    return (
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
    );
};

export default TerminalToggleButton;
