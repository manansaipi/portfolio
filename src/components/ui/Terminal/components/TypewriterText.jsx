import React, { useState, useEffect, useRef } from 'react';
import { renderMarkdownWithProgress } from '../utils/terminalFormatters';

const TypewriterText = ({ line, delay = 15, setIsStreaming }) => {
    const [spokenCount, setSpokenCount] = useState(line._completed ? line.content.length : 0);
    const containerRef = useRef(null);
    const animationFrameRef = useRef(null);

    useEffect(() => {
        if (line._completed) return;

        const syncData = line.syncData;

        // If we have precise timestamp alignment from ElevenLabs
        if (syncData && syncData.audioRef && syncData.alignment && syncData.alignment.character_start_times_seconds) {
            const audio = syncData.audioRef;
            const alignment = syncData.alignment;
            
            const updateText = () => {
                const currentTime = audio.currentTime;
                
                // Calculate how many characters the voice has spoken so far
                let currentSpokenCount = 0;
                for (let i = 0; i < alignment.character_start_times_seconds.length; i++) {
                    if (currentTime >= alignment.character_start_times_seconds[i]) {
                        currentSpokenCount = i + 1;
                    } else {
                        break;
                    }
                }
                
                // If the user wants word-by-word reveal, we can advance to the next space.
                // It makes it feel like "when the voice says 'the', it prints 'the'".
                while (currentSpokenCount > 0 && currentSpokenCount < alignment.characters.length && !/\s/.test(alignment.characters[currentSpokenCount])) {
                    currentSpokenCount++;
                }

                setSpokenCount(currentSpokenCount);
                
                if (currentSpokenCount >= alignment.character_start_times_seconds.length || audio.ended) {
                    setSpokenCount(line.content.length);
                    line._completed = true;
                    if (setIsStreaming) setIsStreaming(false);
                } else {
                    animationFrameRef.current = requestAnimationFrame(updateText);
                }
            };
            
            animationFrameRef.current = requestAnimationFrame(updateText);
            
            return () => {
                if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            };
        } else {
            // Fallback to original fixed delay if no audio sync data
            let currentIndex = 0;
            const interval = setInterval(() => {
                if (currentIndex < line.content.length) {
                    // For word-by-word fallback
                    while (currentIndex < line.content.length && !/\s/.test(line.content[currentIndex])) {
                        currentIndex++;
                    }
                    currentIndex++; // Include the space
                    if (currentIndex > line.content.length) currentIndex = line.content.length;
                    
                    setSpokenCount(currentIndex);
                } else {
                    line._completed = true;
                    if (setIsStreaming) setIsStreaming(false);
                    clearInterval(interval);
                }
            }, delay * 5); // delay is per character, multiply by 5 roughly for words
            return () => clearInterval(interval);
        }
    }, [line, delay]);

    useEffect(() => {
        if (!line._completed && containerRef.current) {
            const scrollContainer = containerRef.current.closest('.overflow-y-auto');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [spokenCount, line._completed]);

    return (
        <div ref={containerRef} className="flex flex-col gap-1">
            {renderMarkdownWithProgress(line.content, spokenCount)}
        </div>
    );
};

export default TypewriterText;
