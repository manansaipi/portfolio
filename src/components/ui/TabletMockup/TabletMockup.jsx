import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TabletMockup = ({ project }) => {
    const frameRef = useRef();

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo(
                frameRef.current,
                { opacity: 0, y: 60, scale: 0.95 },
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
        <div ref={frameRef} className="w-full max-w-[380px] md:max-w-[460px] mx-auto relative my-8">
            {/* Tablet Bezel */}
            <div className="relative bg-[linear-gradient(145deg,rgba(40,40,40,1)_0%,rgba(28,28,28,1)_50%,rgba(35,35,35,1)_100%)] rounded-[24px] md:rounded-[32px] p-[16px] md:p-[20px] shadow-2xl border border-white/10 ring-1 ring-black/50">
                
                {/* Camera */}
                <div className="absolute top-[8px] md:top-[10px] left-1/2 -translate-x-1/2 w-[4px] h-[4px] md:w-[6px] md:h-[6px] rounded-full bg-[radial-gradient(circle,rgba(60,60,70,1)_0%,rgba(30,30,35,1)_100%)] shadow-[inset_0_0_2px_rgba(255,255,255,0.2)]" />

                {/* Screen */}
                <div className="relative w-full aspect-[4/5] overflow-hidden rounded-[8px] md:rounded-[10px] bg-black">
                    {/* Glass reflection */}
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04)_0%,transparent_40%,transparent_60%,rgba(255,255,255,0.01)_100%)] pointer-events-none z-20" />
                    
                    {/* Iframe wrapper - rendering a larger viewport and scaling down to mimic tablet */}
                    <div className={`absolute top-0 left-0 w-[150%] h-[150%] origin-top-left scale-[0.666] z-10 ${project.autoScrollMode === 'css' ? 'animate-[scrollWebsite_25s_ease-in-out_infinite] [animation-delay:2s] will-change-transform' : ''}`}>
                        <iframe
                            src={project.embedUrl}
                            title={`${project.title} Preview`}
                            loading="lazy"
                            sandbox="allow-same-origin allow-scripts allow-popups"
                            allow="autoplay"
                            className="w-full h-full border-none pointer-events-none block"
                        />
                    </div>
                </div>
            </div>
            
            {/* Side buttons */}
            <div className="absolute top-[60px] md:top-[80px] -right-[2px] w-[2px] h-[30px] md:h-[40px] bg-[#333] rounded-r-[2px]" />
            <div className="absolute top-[110px] md:top-[140px] -right-[2px] w-[2px] h-[40px] md:h-[50px] bg-[#333] rounded-r-[2px]" />
        </div>
    );
};

export default TabletMockup;
