import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Magnet from "../../components/Magnet";
import TransitionLink from "../../components/Navbar/TransitionLink";
import { AppContext } from "../../App";

const Content = () => {
	const { preloaderRef } = React.useContext(AppContext);

	const aboutRef = useRef();
	const imgRef = useRef();

	// useLayoutEffect(() => {
	// 	let ctx = gsap.context(() => {
	// 		// gsap.set(imgRef.current, {opacity:0})
	// 		// gsap.fromTo(
	// 		// 	imgRef.current,
	// 		// 	{
	// 		// 		opacity: 0,
	// 		// 	},
	// 		// 	{
	// 		// 		opacity: 1,
	// 		// 		scrollTrigger: {
	// 		// 			trigger: aboutRef.current,
	// 		// 			start: "20% bottom",
	// 		// 			end: "70% 20%",
	// 		// 			markers: true,
	// 		// 			scrub: 1,
	// 		// 			toggleActions: "play none none none", // optional for better control
	// 		// 		},
	// 		// 	}
	// 		// );
	// 		// gsap.to(aboutRef.current, {
	// 		// 	// maxWidth: "100vh",
	// 		// 	duration: 3,
	// 		// 	scrollTrigger: {
	// 		// 		trigger: aboutRef.current,
	// 		// 		pin: true,
	// 		// 		// markers: true,
	// 		// 		scrub: 1,
	// 		// 		start: "center center",
	// 		// 		pinSpacing: true,
	// 		// 		end: "center 20%", // end after scrolling 500px beyond the start
	// 		// 	},
	// 		// });
	// 	});
	// 	return () => ctx.revert(); // cleanup!
	// }, []);
	return (
		<div className="  bg-light-dark text-primary  transition-all">
			<div className=" flex flex-col  p-5 md:p-15 lg:px-25 xl:pt-20 xl:px-50">
				<div className="text-6xl md:text-7xl lg:text-8xl tracking-widest text-color-text-hovering">
					what
				</div>
				<div className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-widest">
					WE DO?
				</div>
				<div className="flex flex-col md:flex-row gap-15 pt-10 ">
					<div className="w-full text-2xl md:text-3xl lg:text-4xl">
						Build digital things that make the complex feel simple. Clean logic,
						smooth interactions, real impact.
					</div>
					<div className="flex flex-col gap-5 md:gap-10 w-1/2 md:text-lg lg:text-xl">
						<div>
							I turn problems into products. Every line of code is written with
							clarity and purpose.
						</div>
						<div className="border px-8 py-1 text-lg flex items-center justify-center rounded-xm cursor-pointer md:cursor-none hover:border-color-text-hovering self-start ">
							<Magnet magnetStrength={4}>
								<TransitionLink
									preloaderRef={preloaderRef}
									href={"/about"}
									label={"ABOUT ME"}
								></TransitionLink>
							</Magnet>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Content;
