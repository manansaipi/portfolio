import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MobileMockup = ({ project }) => {
    const frameRef = useRef();

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo(
                frameRef.current,
                { opacity: 0, y: 50, scale: 0.95 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: frameRef.current,
                        start: "top 80%",
                        toggleActions: "play none none reverse",
                    },
                }
            );
        });
        return () => ctx.revert();
    }, []);

    return (
        <div ref={frameRef} className="w-full max-w-[280px] sm:max-w-[320px] mx-auto relative my-8">
            {/* Phone Bezel */}
            <div className="relative bg-[linear-gradient(145deg,rgba(40,40,40,1)_0%,rgba(28,28,28,1)_50%,rgba(35,35,35,1)_100%)] rounded-[32px] md:rounded-[40px] p-[8px] md:p-[12px] shadow-2xl border border-white/10 ring-1 ring-black/50">
                
                {/* Screen */}

                {/* Screen */}
                <div className="relative w-full aspect-[9/19.5] overflow-hidden rounded-[24px] md:rounded-[30px] bg-black">
                    {/* Glass reflection */}
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04)_0%,transparent_40%,transparent_60%,rgba(255,255,255,0.01)_100%)] pointer-events-none z-20" />
                    
                    {/* Iframe wrapper - for mobile we scale the iframe slightly so it acts as a ~375px mobile device */}
                    <div className={`absolute top-0 left-0 w-[125%] h-[125%] origin-top-left scale-[0.8] z-10 ${project.autoScrollMode === 'css' ? 'animate-[scrollWebsite_35s_ease-in-out_infinite] [animation-delay:2s] will-change-transform' : ''}`}>
                        <iframe
                            src={project.embedUrl}
                            title={`${project.title} Preview`}
                            loading="lazy"
                            sandbox="allow-same-origin allow-scripts"
                            className="w-full h-full border-none pointer-events-none block"
                        />
                    </div>
                </div>
            </div>
            
            {/* Side buttons */}
            <div className="absolute top-[80px] md:top-[100px] -left-[2px] w-[2px] h-[25px] md:h-[30px] bg-[#333] rounded-l-[2px]" />
            <div className="absolute top-[120px] md:top-[140px] -left-[2px] w-[2px] h-[40px] md:h-[50px] bg-[#333] rounded-l-[2px]" />
            <div className="absolute top-[170px] md:top-[200px] -left-[2px] w-[2px] h-[40px] md:h-[50px] bg-[#333] rounded-l-[2px]" />
            <div className="absolute top-[100px] md:top-[120px] -right-[2px] w-[2px] h-[50px] md:h-[60px] bg-[#333] rounded-r-[2px]" />
        </div>
    );
};

export default MobileMockup;
