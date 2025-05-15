import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaTools } from "react-icons/fa";

const UnderDevelopment = ({ title = "This page", message }) => {
    const containerRef = useRef();

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                containerRef.current,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="h-[80vh] w-full bg-light-dark text-primary flex items-center justify-center px-6">
            <div
                ref={containerRef}
                className="flex flex-col items-center text-center space-y-6 max-w-2xl  z-3"
            >
                <FaTools size={60} className="text-accent animate-pulse" />
                <p className="text-2xl md:text-3xl font-medium text-gray-100">
                    {message ||
                        "I'm crafting something amazing here. Check back soon!"}
                </p>
                <h2 className="text-lg md:text-xl text-gray-500 italic">
                    {title} is under construction
                </h2>
            </div>
        </section>
    );
};

export default UnderDevelopment;
