import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import bobenImg from "../../assets/img/profiles/bobenprofile.jpeg"; // adjust the path as needed

import ComingSoon from "../../components/ComingSoon/ComingSoon";
import { MdOpacity } from "react-icons/md";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
	const aboutRef = useRef();
	const imgRef = useRef();

	useLayoutEffect(() => {
		let ctx = gsap.context(() => {
			// gsap.set(imgRef.current, {opacity:0})

			gsap.fromTo(
				imgRef.current,
				{
					opacity: 0,
				},
				{
					opacity: 1,
					scrollTrigger: {
						trigger: aboutRef.current,
						start: "20% bottom",
						end: "70% 20%",
						markers: true,
						scrub: 1,
						toggleActions: "play none none none", // optional for better control
					},
				}
			);
			gsap.to(aboutRef.current, {
				// maxWidth: "100vh",
				duration: 3,
				scrollTrigger: {
					trigger: aboutRef.current,
					pin: true,
					// markers: true,
					scrub: 1,
					start: "center center",

					pinSpacing: true,
					end: "center 20%", // end after scrolling 500px beyond the start
				},
			});
		});
		return () => ctx.revert(); // cleanup!
	}, []);

	return (
		<section
			id="About"
			className="flex items-center justify-center bg-light-dark md:py-10  h-auto md:px-5 lg:px-10 xl:px-10  "
		>
			{/* <ComingSoon></ComingSoon> */}

			<div
				ref={aboutRef}
				className="relative bg-black w-full h-[50vw]  max-h-[80vh] max-w-[1400px] text-white flex items-center justify-center text-6xl "
			>
				<img
					ref={imgRef}
					src={bobenImg}
					className="w-full h-full object-cover absolute "
					alt=""
				/>
			</div>
		</section>
	);
};

export default About;
// moritz petersen
