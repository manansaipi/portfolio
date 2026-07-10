import React, { useState, useEffect, useRef } from 'react';
import { renderMarkdown } from '../utils/terminalFormatters';

const TypewriterText = ({ line, delay = 15 }) => {
    const [currentText, setCurrentText] = useState(line._completed ? line.content : '');
    const [currentIndex, setCurrentIndex] = useState(line._completed ? line.content.length : 0);
    const containerRef = useRef(null);

    useEffect(() => {
        if (currentIndex < line.content.length) {
            const randomDelay = delay + Math.random() * 20;
            const timeout = setTimeout(() => {
                setCurrentText(prev => prev + line.content[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, randomDelay);
            return () => clearTimeout(timeout);
        } else {
            line._completed = true;
        }
    }, [currentIndex, delay, line]);

    useEffect(() => {
        if (!line._completed && containerRef.current) {
            const scrollContainer = containerRef.current.closest('.overflow-y-auto');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [currentText, line._completed]);

    return <div ref={containerRef} className="flex flex-col gap-1">{renderMarkdown(currentText)}</div>;
};

export default TypewriterText;
