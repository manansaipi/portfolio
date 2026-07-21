import React, { useState, useEffect } from 'react';

const ThinkingAnimation = ({ text = "Thinking..." }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        setDisplayedText(''); // reset when text changes
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(text.slice(0, i + 1));
                i++;
            } else {
                clearInterval(interval);
            }
        }, 30); // fast typing speed

        return () => clearInterval(interval);
    }, [text]);

    return (
        <span className="text-green-400 opacity-80 animate-pulse">
            {displayedText}
            <span className="opacity-50 inline-block animate-pulse">_</span>
        </span>
    );
};

export default ThinkingAnimation;
