import { useEffect } from 'react';

export const useTerminalBehaviors = ({
    isOpen,
    setIsOpen,
    isMinimized,
    isMaximized,
    isEmbed,
    containerRef,
    bodyRef,
    inputRef,
    history
}) => {
    // Close terminal on click outside
    useEffect(() => {
        if (!isOpen || isEmbed) return; // Don't close on click outside if in embed mode

        const handleClickOutside = (e) => {
            // Ignore clicks on the toggle button so we don't conflict with toggleOpen
            if (e.target.closest('.terminal-toggle-btn')) return;
            
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, isEmbed, containerRef, setIsOpen]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (!isMinimized && bodyRef.current) {
            bodyRef.current.scrollTo({
                top: bodyRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [history, isOpen, isMinimized, isMaximized, bodyRef]);

    // Focus input on open
    useEffect(() => {
        if (isOpen && !isMinimized) {
            setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 100);
        }
    }, [isOpen, isMinimized, isMaximized, inputRef]);

    // Close terminal if scrolled out of view
    useEffect(() => {
        if (!isOpen || isMaximized || isEmbed) return;

        const handleScroll = () => {
            if (bodyRef.current && bodyRef.current.parentElement) {
                const rect = bodyRef.current.parentElement.getBoundingClientRect();
                // If the terminal is completely above or below the viewport
                if (rect.bottom < 0 || rect.top > window.innerHeight) {
                    setIsOpen(false);
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isOpen, isMaximized, isEmbed, bodyRef, setIsOpen]);

    // Prevent body scrolling when terminal is maximized
    useEffect(() => {
        if (isOpen && isMaximized) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen, isMaximized]);
};
