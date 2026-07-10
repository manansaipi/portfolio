import React from 'react';

const FakeCursor = ({ isEmbed }) => {
    if (!isEmbed) return null;
    
    return (
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
    );
};

export default FakeCursor;
