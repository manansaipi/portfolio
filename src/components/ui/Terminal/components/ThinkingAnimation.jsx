import React, { useState, useEffect } from 'react';

const ThinkingAnimation = () => {
    const [dots, setDots] = useState('');
    
    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return <span className="animate-pulse">Thinking{dots}</span>;
};

export default ThinkingAnimation;
