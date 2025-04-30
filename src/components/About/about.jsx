import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ComingSoon from "../ComingSoon/ComingSoon";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
	const aboutRef = useRef();

	let tl = gsap.timeline({
		// yes, we can add it to an entire timeline!
		scrollTrigger: {
			// trigger: aboutRef.current,
			// markers: true,
			// pin: true, // pin the trigger element while active
			// start: "top center",
			// end: "top top", // end after scrolling 500px beyond the start
		},
	});
	return (
		<section id="About" className="h-[30vh]">
			{/* <ComingSoon></ComingSoon> */}
			<div ref={aboutRef} className="bg-black w-full h-[30vh]">
				hey
			</div>
		</section>
	);
};

export default About;
