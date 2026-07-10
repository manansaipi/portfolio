import { useEffect } from 'react';

export const useTerminalSimulation = ({ isEmbed, setInput, inputRef }) => {
    useEffect(() => {
        // Pause auto-scrolling while terminal sequence happens
        window.disableAutoScroll = true;
        
        if (!isEmbed) return;

        let isCancelled = false;

        const runSimulation = async () => {
            // Wait for initial page load and entrance animation
            await new Promise(r => setTimeout(r, 2000));
            if (isCancelled) return;

            const fakeCursor = document.getElementById('embed-fake-cursor');
            const toggleBtn = document.querySelector('.terminal-toggle-btn');
            
            const isMobile = window.innerWidth < 768;

            if (fakeCursor && toggleBtn) {
                const { default: gsap } = await import('gsap');

                // Helper to get exact body-relative coordinates
                const getCoords = (el) => {
                    const rect = el.getBoundingClientRect();
                    return {
                        x: rect.left + window.scrollX + rect.width / 2,
                        y: rect.top + window.scrollY + rect.height / 2
                    };
                };

                const toggleCoords = getCoords(toggleBtn);

                // 1. Zoom in to the floating terminal button using its exact position as the center
                if (!isMobile) {
                    gsap.to(document.body, { scale: 1.3, transformOrigin: `${toggleCoords.x}px ${toggleCoords.y}px`, duration: 2.5, ease: "power2.inOut" });
                }

                // Move cursor to toggle button starting from the center of the page
                gsap.set(fakeCursor, { 
                    x: window.scrollX + window.innerWidth / 2, 
                    y: window.scrollY + window.innerHeight / 2, 
                    opacity: 1 
                });
                await gsap.to(fakeCursor, { 
                    x: toggleCoords.x, 
                    y: toggleCoords.y,
                    duration: 2.5,
                    ease: "power2.inOut"
                });
                
                await new Promise(r => setTimeout(r, 500));

                // Simulate click on toggle button
                await gsap.to(fakeCursor, { scale: 0.8, duration: 0.15 });
                toggleBtn.click();
                await gsap.to(fakeCursor, { scale: 1, duration: 0.15 });
                
                // 2. Zoom out
                if (!isMobile) {
                    await gsap.to(document.body, { scale: 1, duration: 2.5, ease: "power2.inOut" });
                } else {
                    await new Promise(r => setTimeout(r, 500)); // Just a small pause
                }

                // 3. Zoom in to the full screen button
                const maxBtn = document.getElementById('terminal-maximize-btn');
                if (maxBtn) {
                    const maxCoords = getCoords(maxBtn);
                    
                    // Zoom using the button as origin
                    if (!isMobile) {
                        gsap.to(document.body, { scale: 1.3, transformOrigin: `${maxCoords.x}px ${maxCoords.y}px`, duration: 2.5, ease: "power2.inOut" });
                    }

                    await gsap.to(fakeCursor, { 
                        x: maxCoords.x, 
                        y: maxCoords.y,
                        duration: 2.5,
                        ease: "power2.inOut"
                    });
                    
                    await new Promise(r => setTimeout(r, 500));

                    // Simulate click to maximize
                    await gsap.to(fakeCursor, { scale: 0.8, duration: 0.15 });
                    maxBtn.click();
                    await gsap.to(fakeCursor, { scale: 1, duration: 0.15 });
                    
                }

                // Zoom back out immediately after clicking maximize
                if (!isMobile) {
                    await gsap.to(document.body, { scale: 1, duration: 2.5, ease: "power2.inOut" });
                } else {
                    await new Promise(r => setTimeout(r, 500));
                }
                
                // 4. Zoom to the user who is typing
                let inputCoords;
                if (inputRef.current) {
                    inputCoords = {
                        // The user requested to push the zoom to the absolute maximum top left corner!
                        x: window.scrollX, 
                        y: window.scrollY
                    };
                } else {
                    // Fallback to absolute top-left
                    inputCoords = {
                        x: window.scrollX,
                        y: window.scrollY
                    };
                }
                
                // Do not zoom on mobile because the screen is already narrow/zoomed
                if (!isMobile) {
                    await gsap.to(document.body, { scale: 1.4, transformOrigin: `${inputCoords.x}px ${inputCoords.y}px`, duration: 2.5, ease: "power2.inOut" });
                } else {
                    await new Promise(r => setTimeout(r, 500));
                }
            }

            // Wait a bit before typing starts
            await new Promise(r => setTimeout(r, 500));
            
            const typeAndEnter = async (text, waitAfter = 3000) => {
                const inputEl = inputRef.current;
                if (!inputEl) return;

                // Clear input first
                setInput('');
                await new Promise(r => setTimeout(r, 200));

                let currentText = '';
                for (let i = 0; i < text.length; i++) {
                    if (isCancelled) return;
                    currentText += text[i];
                    setInput(currentText);
                    // Slower typing speed
                    await new Promise(r => setTimeout(r, 100 + Math.random() * 150));
                }
                
                await new Promise(r => setTimeout(r, 800));
                if (isCancelled) return;
                
                // Hack to trigger React's controlled input submission
                const prototype = inputEl.tagName.toLowerCase() === 'textarea' 
                    ? window.HTMLTextAreaElement.prototype 
                    : window.HTMLInputElement.prototype;
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(prototype, "value").set;
                nativeInputValueSetter.call(inputEl, currentText);
                inputEl.dispatchEvent(new Event('input', { bubbles: true }));
                inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
                
                await new Promise(r => setTimeout(r, waitAfter)); // wait before next command
            };

            // Sequence of commands requested by user
            if (!isCancelled) {
                await typeAndEnter("/help", 3500);
                await typeAndEnter("/ask", 2000);
                await typeAndEnter("who is abdul mannan saipi ?", 10000); 
            }

            // 5. Zoom to close the terminal
            if (!isCancelled) {
                const { default: gsap } = await import('gsap');
                const fakeCursor = document.getElementById('embed-fake-cursor');
                const closeBtn = document.getElementById('terminal-close-btn');

                // Get fresh coords (in case scrolling somehow happened, though it shouldn't)
                const getCoords = (el) => {
                    const rect = el.getBoundingClientRect();
                    return {
                        x: rect.left + window.scrollX + rect.width / 2,
                        y: rect.top + window.scrollY + rect.height / 2
                    };
                };

                if (fakeCursor && closeBtn) {
                    const closeCoords = getCoords(closeBtn);
                    
                    await gsap.to(fakeCursor, { 
                        x: closeCoords.x -10, 
                        y: closeCoords.y -15,
                        duration: 2.5,
                        ease: "power2.inOut"
                    });
                    
                    await new Promise(r => setTimeout(r, 500));

                    // Click close
                    await gsap.to(fakeCursor, { scale: 0.8, duration: 0.15 });
                    closeBtn.click();
                    await gsap.to(fakeCursor, { scale: 1, duration: 0.15 });

                    // Hide cursor
                    gsap.to(fakeCursor, { opacity: 0, duration: 1 });
                }

                // Zoom out and resume
                if (!isMobile) {
                    await gsap.to(document.body, { scale: 1, duration: 2.5, ease: "power2.inOut" });
                }
            }

            // Allow auto-scroll to resume
            window.disableAutoScroll = false;
        };

        runSimulation();

        return () => { 
            isCancelled = true; 
            window.disableAutoScroll = false;
        };
    }, [isEmbed, setInput, inputRef]);
};
