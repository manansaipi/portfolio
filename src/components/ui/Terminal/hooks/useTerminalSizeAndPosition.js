import { useState } from 'react';

export const useTerminalSizeAndPosition = (isEmbed) => {
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

    return { size, setSize, position, setPosition, getInitialSize };
};
