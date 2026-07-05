import React, { useState, useEffect, forwardRef } from "react";
import { resolveImg } from "@utils/imageUtils";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const ImageCarousel = forwardRef(({ images, autoSlideInterval = 5000, className = "" }, ref) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);

    useEffect(() => {
        if (!images || images.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, autoSlideInterval);
        return () => clearInterval(interval);
    }, [images, autoSlideInterval]);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const handleDragStart = (clientX) => {
        setTouchEnd(null);
        setTouchStart(clientX);
        setIsDragging(true);
        setDragOffset(0);
    };

    const handleDragMove = (clientX) => {
        if (isDragging) {
            setTouchEnd(clientX);
            setDragOffset(clientX - touchStart);
        }
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        if (touchStart === null || touchEnd === null) {
            setDragOffset(0);
            return;
        }
        
        const distance = touchStart - touchEnd;
        const minSwipeDistance = 50;

        if (distance > minSwipeDistance) {
            nextSlide();
        } else if (distance < -minSwipeDistance) {
            prevSlide();
        }
        
        setDragOffset(0);
    };

    if (!images || images.length === 0) return null;

    if (images.length === 1) {
        return (
            <img
                ref={ref}
                src={resolveImg(images[0])}
                alt="Article cover"
                className={`w-full h-full object-cover ${className}`}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/800x450/333333/FFFFFF?text=Image+Not+Found`;
                }}
            />
        );
    }

    return (
        <div 
            ref={ref} 
            className={`relative overflow-hidden group ${className}`}
            onTouchStart={(e) => handleDragStart(e.targetTouches[0].clientX)}
            onTouchMove={(e) => handleDragMove(e.targetTouches[0].clientX)}
            onTouchEnd={handleDragEnd}
            onMouseDown={(e) => {
                e.preventDefault(); // prevents image drag ghost
                handleDragStart(e.clientX);
            }}
            onMouseMove={(e) => handleDragMove(e.clientX)}
            onMouseUp={handleDragEnd}
            onMouseLeave={() => {
                if (isDragging) handleDragEnd();
            }}
        >
            {/* Images Container */}
            <div 
                className={`w-full h-full flex ${!isDragging ? 'transition-transform duration-700 ease-in-out' : ''} ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                style={{ transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))` }}
            >
                {images.map((img, i) => (
                    <img
                        key={i}
                        src={resolveImg(img)}
                        alt={`Slide ${i}`}
                        className="w-full h-full object-cover shrink-0 pointer-events-none"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://placehold.co/800x450/333333/FFFFFF?text=Image+Not+Found`;
                        }}
                    />
                ))}
            </div>

            {/* Navigation Buttons */}
            <button 
                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 backdrop-blur-sm cursor-none"
            >
                <MdChevronLeft size={28} />
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 backdrop-blur-sm cursor-none"
            >
                <MdChevronRight size={28} />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {images.map((_, i) => (
                    <button
                        key={i}
                        onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
                        className={`w-2.5 h-2.5 rounded-full transition-colors ${i === currentIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/80'} cursor-none`}
                    />
                ))}
            </div>
        </div>
    );
});

export default ImageCarousel;
