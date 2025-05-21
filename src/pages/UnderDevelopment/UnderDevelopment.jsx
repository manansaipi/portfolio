import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaTools } from "react-icons/fa";
import { AnimateHeader } from "../../components/PreLoader/AnimatePageTransition";
const UnderDevelopment = ({ title = "This page", message }) => {
	const headerContainerRef = useRef();

	useLayoutEffect(() => {
		AnimateHeader({  headerContainerRef });
	}, []);

	return (
		<section className=" h-[80vh] w-full bg-light-dark text-primary flex flex-col gap-6 items-center justify-center px-6 overflow-hidden">
			<FaTools size={60} className="text-accent animate-pulse" />
			<div
				ref={headerContainerRef}
				className="flex flex-col items-center text-center  max-w-2xl  z-3"
			>
				<p className="text-2xl md:text-3xl font-medium text-gray-100">
					{message || "I'm crafting something amazing here. Check back soon!"}
				</p>
			</div>
			<h2 className="text-lg md:text-xl text-gray-500 italic">
				{title} is under construction
			</h2>
		</section>
	);
};

export default UnderDevelopment;
