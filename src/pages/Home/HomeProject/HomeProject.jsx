import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HomeProject = () => {
	const containerProject = useRef();
	useLayoutEffect(() => {
		let ctx = gsap.context(() => {
			gsap.set(containerProject.current, { x: -500 });
			gsap.to(containerProject.current, {
				x: 100,
				scrollTrigger: {
					trigger: containerProject.current,
					start: "top 80%",
					end: "bottom 0%",
					scrub: true,
					markers: true,
				},
			});
		});
		return () => ctx.revert(); // cleanup!
	}, []); // Dependency on windowWidth

	return (
		<div className="bg-light-dark h-[100vh] w-[300vh] pb-500">
			<div className="h-[80vh]"></div>
			<div ref={containerProject} className="flex flex-row  gap-10">
				<div className="bg-gray-200  h-[180px] w-[250px] flex  items-center justify-center">
					<div className="bg-black m-5 h-[150px] w-full"></div>
				</div>
				<div className="bg-gray-200  h-[180px] w-[250px] flex  items-center justify-center">
					<div className="bg-black m-5 h-[150px] w-full"></div>
				</div>
				<div className="bg-gray-200  h-[180px] w-[250px] flex  items-center justify-center">
					<div className="bg-black m-5 h-[150px] w-full"></div>
				</div>
				<div className="bg-gray-200  h-[180px] w-[250px] flex  items-center justify-center">
					<div className="bg-black m-5 h-[150px] w-full"></div>
				</div>
				<div className="bg-gray-200  h-[180px] w-[250px] flex  items-center justify-center">
					<div className="bg-black m-5 h-[150px] w-full"></div>
				</div>
				<div className="bg-gray-200  h-[180px] w-[250px] flex  items-center justify-center">
					<div className="bg-black m-5 h-[150px] w-full"></div>
				</div>
			</div>
		</div>
	);
};

export default HomeProject;
