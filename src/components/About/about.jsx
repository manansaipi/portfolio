import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ComingSoon from "../ComingSoon/ComingSoon";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
	const aboutRef = useRef();

	useEffect(() => {
		// gsap.to(aboutRef.current, {
		// 	x: -400,
		// 	duration: 3,
		// 	// yes, we can add it to an entire timeline!
		// 	scrollTrigger: {
		// 		pin: true,
		// 		trigger: aboutRef.current,
		// 		markers: true,
		// 		scrub: 2,
		// 		start: "center center",
		// 		end: "center 20%", // end after scrolling 500px beyond the start
		// 		// toggleActions: "restart pause resume reset", // onEnter onLeave onEnterBack onLeaveBakk
		// 	},
		// });
	}, []);

	return (
		<section
			id="About"
			className="flex items-center justify-center bg-light-dark md:py-10  h-auto md:px-5 lg:px-10 xl:px-10  "
		>
			{/* <ComingSoon></ComingSoon> */}

			<div
				ref={aboutRef}
				className="bg-black w-full h-[50vw]  max-h-[80vh] max-w-[1400px]"
			></div>
		</section>
	);
};

export default About;
// moritz petersen
