import React, { useRef, useLayoutEffect, useContext } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "@/constants/projects";
import LaptopMockup from "@/components/ui/LaptopMockup/LaptopMockup";
import TabletMockup from "@/components/ui/TabletMockup/TabletMockup";
import MobileMockup from "@/components/ui/MobileMockup/MobileMockup";
import Magnet from "@/components/ui/Magnet/Magnet";
import PrimaryButton from "@/components/ui/Buttons/PrimaryButton";
import { AppContext } from "@/App";

gsap.registerPlugin(ScrollTrigger);

const RichProjectShowcase = ({ project, index }) => {
	const showcaseRef = useRef();
	const detailsRef = useRef();
    const titleRef = useRef();

	useLayoutEffect(() => {
		let ctx = gsap.context(() => {
            // Title Entrance
            gsap.fromTo(
                titleRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1, 
                    y: 0,
                    duration: 1,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: showcaseRef.current,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

			// Details entrance (staggered cards)
			if (detailsRef.current) {
				gsap.fromTo(
					detailsRef.current.children,
					{ opacity: 0, y: 40 },
					{
						opacity: 1,
						y: 0,
						duration: 0.8,
						stagger: 0.1,
						ease: "power3.out",
						scrollTrigger: {
							trigger: detailsRef.current,
							start: "top 85%",
							toggleActions: "play none none reverse",
						},
					}
				);
			}
		});

		return () => ctx.revert();
	}, []);

	return (
		<div ref={showcaseRef} className="relative flex flex-col w-full min-h-screen py-20 lg:py-32 border-t border-primary/5 first:border-none">
            
            {/* Background Ambient Gradient */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0.01)_40%,transparent_70%)] pointer-events-none z-0 blur-[60px]" />

            <div className="container mx-auto px-5 md:px-10 lg:px-20 relative">
                {/* Header */}
                <div ref={titleRef} className="mb-16 md:mb-24 text-center">
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                        {project.title}
                    </h2>
                    <p className="max-w-2xl mx-auto text-base md:text-lg text-color-text-hovering leading-relaxed">
                        {project.description}
                    </p>
                    
                    <div className="flex flex-wrap justify-center gap-4 mt-8">
                        {project.url && (
                            <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold tracking-widest text-primary border border-primary/20 rounded-full hover:bg-primary/10 hover:-translate-y-1 transition-all duration-300 group cursor-none"
                            >
                                VISIT LIVE SITE
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                                </svg>
                            </a>
                        )}
                        {project.githubUrl && (
                            <Magnet magnetStrength={3} padding={5}>
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center cursor-none p-[0.7rem] border border-primary/20 rounded-full hover:bg-primary/10 hover:-translate-y-1 transition-all duration-300 group text-primary"
                                    style={{ aspectRatio: '1 / 1' }}
                                >
                                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" className="w-[20px] h-[20px] pointer-events-none transition-transform duration-300 group-hover:scale-110" xmlns="http://www.w3.org/2000/svg"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>
                                </a>
                            </Magnet>
                        )}
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center lg:items-start">
                    
                    {/* Left side: Interactive Device Frame */}
                    <div className="w-full lg:w-3/5 xl:w-2/3 relative order-2 lg:order-1">
                        <div className="hidden lg:block">
                            <LaptopMockup project={project} />
                        </div>
                        <div className="hidden md:block lg:hidden">
                            <TabletMockup project={project} />
                        </div>
                        <div className="block md:hidden">
                            <MobileMockup project={project} />
                        </div>
                    </div>

                    {/* Right side: Features & Tech Stack */}
                    <div ref={detailsRef} className="w-full lg:w-2/5 xl:w-1/3 flex flex-col gap-8 order-1 lg:order-2">
                        
                        {/* Tech Stack Bento Box */}
                        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8 backdrop-blur-sm">
                            <h3 className="text-sm tracking-[0.2em] text-color-text-hovering mb-6 uppercase">Tech Stack</h3>
                            <div className="flex flex-wrap gap-2">
                                {project.techStack.map((tech) => (
                                    <span 
                                        key={tech} 
                                        className="px-4 py-2 text-xs font-semibold tracking-wider bg-primary/10 text-primary rounded border border-primary/5 transition-colors hover:bg-primary/20 hover:border-primary/20"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Features List Bento Box */}
                        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8 backdrop-blur-sm flex-1">
                            <h3 className="text-sm tracking-[0.2em] text-color-text-hovering mb-6 uppercase">Key Features</h3>
                            <div className="flex flex-col gap-6">
                                {project.features.map((feat, i) => (
                                    <div key={i} className="group">
                                        <h4 className="text-base font-bold text-primary mb-1 transition-colors group-hover:text-white">{feat.title}</h4>
                                        <p className="text-sm text-color-text-hovering leading-relaxed">{feat.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
		</div>
	);
};

const Projects = () => {
    const pageRef = useRef();
    const { handleButtonNavigation } = useContext(AppContext);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo(
                ".page-title",
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1, ease: "power4.out", delay: 0.2 }
            );
        }, pageRef);
        return () => ctx.revert();
    }, []);

	return (
		<div ref={pageRef} className="bg-background text-primary min-h-screen pt-32 pb-20 overflow-x-hidden">
            <div className="container mx-auto px-5 md:px-10 lg:px-20 mb-20 text-center">
                <h1 className="page-title text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter ">
                    Selected <br/><span className="text-color-text-hovering font-light italic">Projects</span>
                </h1>
            </div>

			<div className="flex flex-col">
				{PROJECTS.map((project, index) => (
					<RichProjectShowcase key={project.id} project={project} index={index} />
				))}
			</div>

			<div className="flex justify-center py-20">
				<PrimaryButton
					label={"MY WORK"}
					handleOnClick={() => handleButtonNavigation("/work")}
				/>
			</div>
		</div>
	);
};

export default Projects;
