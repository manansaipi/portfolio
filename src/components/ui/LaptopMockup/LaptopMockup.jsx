import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LaptopMockup = ({ project }) => {
    const frameRef = useRef();

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo(
                frameRef.current,
                { opacity: 0, y: 80, scale: 0.95 },
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
        <div ref={frameRef} className="w-full relative z-10">
            {/* Bezel */}
            <div className="relative bg-[linear-gradient(145deg,rgba(40,40,40,1)_0%,rgba(28,28,28,1)_50%,rgba(35,35,35,1)_100%)] rounded-t-[8px] md:rounded-t-[14px] p-[10px_6px_6px] md:p-[18px_10px_10px] xl:p-[24px_14px_14px] shadow-2xl border border-white/5">
                
                {/* Camera */}
                <div className="absolute top-[4px] md:top-[8px] xl:top-[10px] left-1/2 -translate-x-1/2 w-[3px] h-[3px] md:w-[5px] md:h-[5px] rounded-full bg-[radial-gradient(circle,rgba(60,60,70,1)_0%,rgba(30,30,35,1)_100%)] shadow-[inset_0_0_2px_rgba(255,255,255,0.2)]" />

                {/* Screen */}
                <div className="relative w-full aspect-[16/10] overflow-hidden rounded-[4px] bg-black">
                    {/* Glass reflection */}
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.03)_0%,transparent_40%,transparent_60%,rgba(255,255,255,0.01)_100%)] pointer-events-none z-20" />
                    
                    {/* Iframe wrapper */}
                    <div className={`absolute top-0 left-0 w-[250%] h-[250%] origin-top-left scale-[0.4] z-10 ${project.autoScrollMode === 'css' ? 'animate-[scrollWebsite_35s_ease-in-out_infinite] [animation-delay:2s] will-change-transform' : ''}`}>
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

            {/* Laptop Base */}
            <div className="relative w-[104%] -ml-[2%] h-[10px] md:h-[14px] xl:h-[18px] bg-[linear-gradient(180deg,rgba(50,50,50,1)_0%,rgba(38,38,38,1)_40%,rgba(30,30,30,1)_100%)] rounded-b-[6px] xl:rounded-b-[8px] shadow-xl">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60px] xl:w-[90px] h-[3px] xl:h-[5px] bg-[rgba(50,50,50,0.8)] rounded-b-[4px]" />
            </div>
        </div>
    );
};

export default LaptopMockup;
