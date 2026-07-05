import React, { useState, useEffect, forwardRef } from "react";
import { resolveImg } from "@utils/imageUtils";

const ImageCarousel = forwardRef(({ images, autoSlideInterval = 5000, className = "" }, ref) => {
    const [currentIndex, setCurrentIndex] = useState(0);

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
        <div ref={ref} className={`relative overflow-hidden group ${className}`}>
            {/* Images Container */}
            <div 
                className="w-full h-full flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((img, i) => (
                    <img
                        key={i}
                        src={resolveImg(img)}
                        alt={`Slide ${i}`}
                        className="w-full h-full object-cover shrink-0"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://placehold.co/800x450/333333/FFFFFF?text=Image+Not+Found`;
                        }}
                    />
                ))}
            </div>

            {/* Navigation Buttons */}
            <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 backdrop-blur-sm cursor-none"
            >
                &#10094;
            </button>
            <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 backdrop-blur-sm cursor-none"
            >
                &#10095;
            </button>

            {/* Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {images.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`w-2.5 h-2.5 rounded-full transition-colors ${i === currentIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/80'} cursor-none`}
                    />
                ))}
            </div>
        </div>
    );
});

export default ImageCarousel;
