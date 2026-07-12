import React, { useRef, useLayoutEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "@/constants/projects";
import { AppContext } from "@/App";
import LaptopMockup from "@/components/ui/LaptopMockup/LaptopMockup";
import MobileMockup from "@/components/ui/MobileMockup/MobileMockup";
import gsap from "gsap";
import PrimaryButton from "@/components/ui/Buttons/PrimaryButton";
import Magnet from "@/components/ui/Magnet/Magnet";

gsap.registerPlugin(ScrollTrigger);


const ProjectShowcase = ({ project }) => {
	const showcaseRef = useRef();
	const infoRef = useRef();

	useLayoutEffect(() => {
		let ctx = gsap.context(() => {
			// Info entrance
			if (infoRef.current) {
				gsap.fromTo(
					infoRef.current.children,
					{ opacity: 0, y: 40 },
					{
						opacity: 1,
						y: 0,
						duration: 0.8,
						stagger: 0.15,
						ease: "power3.out",
						scrollTrigger: {
							trigger: infoRef.current,
							start: "top 90%",
							toggleActions: "play none none reset",
						},
					}
				);
			}
		});

		return () => ctx.revert();
	}, []);

	return (
		<div ref={showcaseRef} className="relative flex flex-col items-center md:pt-8 pb-16 px-5 w-full">
			{/* Ambient glow */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[60%] bg-[radial-gradient(ellipse_at_center,rgba(var(--primary),0.03)_0%,rgba(var(--primary),0.015)_30%,transparent_70%)] pointer-events-none z-0 blur-[40px]" />

			{/* Device Frame */}
			<div className="relative w-full max-w-[900px] lg:max-w-[700px] xl:max-w-[900px] mx-auto">
				<div className="hidden md:block">
					<LaptopMockup project={project} />
				</div>
				<div className="block md:hidden">
					<MobileMockup project={project} />
				</div>
			</div>

			{/* Project Info */}
			<div ref={infoRef} className="relative flex flex-col items-center gap-4 md:mt-10 text-center">
				<div className="text-[1.25rem] md:text-[1.5rem] xl:text-[1.75rem] font-bold tracking-[0.05em]">
					{project.title}
				</div>
				<div className="max-w-[500px] text-[0.8rem] md:text-[0.9rem] leading-[1.6] opacity-50 px-4">
					{project.description}
				</div>
				<div className="flex flex-wrap justify-center gap-2 mt-1">
					{project.techStack.map((tech) => (
						<span 
							key={tech} 
							className="px-[0.65rem] py-[0.25rem] xl:px-[0.85rem] xl:py-[0.3rem] text-[0.6rem] xl:text-[0.7rem] font-semibold tracking-[0.1em] uppercase border border-primary/10 rounded-full bg-primary/5 transition-all duration-300 hover:bg-primary/10 hover:border-primary/25 hover:-translate-y-[1px]"
						>
							{tech}
						</span>
					))}
				</div>
				<div className="flex flex-wrap justify-center gap-4 mt-2">
					{project.url && (
						<a
							href={project.url}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center cursor-none gap-2 px-[1.5rem] py-[0.5rem] text-[0.8rem] font-semibold tracking-[0.15em] uppercase border border-primary/15 rounded bg-transparent transition-all duration-300 hover:bg-primary/5 hover:border-primary/30 hover:-translate-y-[2px] text-primary group"
						>
							VISIT LIVE
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={2}
								stroke="currentColor"
								className="w-[14px] h-[14px] transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
							>
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
								className="inline-flex items-center justify-center cursor-none p-3 border border-primary/15 rounded-full bg-transparent transition-all duration-300 hover:bg-primary/5 hover:border-primary/30 hover:-translate-y-[2px] text-primary group"
								style={{ aspectRatio: '1 / 1' }}
							>
								<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" className="w-5 h-5 pointer-events-none transition-transform duration-300 group-hover:scale-110" xmlns="http://www.w3.org/2000/svg"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>
							</a>
						</Magnet>
					)}
				</div>
			</div>
		</div>
	);
};

const HomeRecentProject = () => {
	const { handleButtonNavigation } = React.useContext(AppContext);

	// Prevent infinite iframe recursion
	const isEmbed = new URLSearchParams(window.location.search).get('embed') === 'true';
	
	if (isEmbed) return null;

	return (
		<div className="bg-light-dark text-primary pb-20">
			{/* Section Label */}
			<div className="px-5 md:px-10 lg:px-25 xl:px-30">
				<div className="mx-0 lg:mx-15 xl:mx-25 2xl:mx-35 pb-5 text-xs xl:text-sm text-color-text-hovering tracking-widest">
					RECENT PROJECTS
				</div>
			</div>

			<div className="flex flex-col lg:flex-row  lg:gap-10">
				{PROJECTS.slice(0, 2).map(project => (
					<ProjectShowcase key={project.id} project={project} />
				))}
			</div>

			{/* View All Projects Button */}
			<div className="flex justify-center">
				<PrimaryButton
					handleOnClick={() => handleButtonNavigation("/projects")}
					label={"VIEW ALL PROJECTS"}
				/>
			</div>
		</div>
	);
};

export default HomeRecentProject;
