import { useEffect } from 'react';

export const useAutoScroll = (isEmbed) => {
    const isAutoScroll = new URLSearchParams(window.location.search).get('autoScroll') === 'true';

    useEffect(() => {
        if (isEmbed && isAutoScroll) {
            let scrollFrame;
            let delayTimeout;
            let isScrolling = true;
            
            const startScroll = () => {
                if (window.disableAutoScroll) {
                    scrollFrame = requestAnimationFrame(startScroll);
                    return;
                }
                const docHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight);
                const winHeight = window.innerHeight;
                
                if (window.scrollY + winHeight >= docHeight - 10) {
                    window.scrollTo(0, 0); // Reset
                    isScrolling = false;
                    delayTimeout = setTimeout(() => { isScrolling = true; }, 2000);
                } else if (isScrolling) {
                    window.scrollBy(0, 3); // Increased speed
                }
                scrollFrame = requestAnimationFrame(startScroll);
            };
            
            // Wait 2 seconds before starting auto-scroll
            delayTimeout = setTimeout(startScroll, 2000);

            return () => {
                if (scrollFrame) cancelAnimationFrame(scrollFrame);
                if (delayTimeout) clearTimeout(delayTimeout);
            };
        }
    }, [isEmbed, isAutoScroll]);
};
