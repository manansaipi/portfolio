import React, { useRef, useLayoutEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "@/constants/projects";
import { AppContext } from "@/App";
import LaptopMockup from "@/components/ui/LaptopMockup/LaptopMockup";
import gsap from "gsap";
import PrimaryButton from "@/components/ui/Buttons/PrimaryButton";

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
		<div ref={showcaseRef} className="relative flex flex-col items-center pt-8 pb-16 px-5 w-full">
			{/* Ambient glow */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[60%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0.015)_30%,transparent_70%)] pointer-events-none z-0 blur-[40px]" />

			{/* Device Frame */}
			<div className="relative z-10 w-full max-w-[900px] lg:max-w-[700px] xl:max-w-[900px] mx-auto">
				<LaptopMockup project={project} />
			</div>

			{/* Project Info */}
			<div ref={infoRef} className="relative z-10 flex flex-col items-center gap-4 mt-10 text-center">
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
							className="px-[0.65rem] py-[0.25rem] xl:px-[0.85rem] xl:py-[0.3rem] text-[0.6rem] xl:text-[0.7rem] font-semibold tracking-[0.1em] uppercase border border-white/10 rounded-full bg-white/5 transition-all duration-300 hover:bg-white/10 hover:border-white/25 hover:-translate-y-[1px]"
						>
							{tech}
						</span>
					))}
				</div>
				{project.url && (
					<a
						href={project.url}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center cursor-none gap-2 mt-2 px-[1.5rem] py-[0.5rem] text-[0.8rem] font-semibold tracking-[0.15em] uppercase border border-white/15 rounded bg-transparent transition-all duration-300 hover:bg-white/5 hover:border-white/30 hover:-translate-y-[2px] text-primary group"
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
				{PROJECTS.map(project => (
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
