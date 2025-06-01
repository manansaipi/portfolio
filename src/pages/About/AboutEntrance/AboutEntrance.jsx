import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import graduate1 from "../../../assets/img/profiles/graduate1.JPG";
import graduate2 from "../../../assets/img/profiles/graduate2.JPG";
import { AnimateHeader } from "../../../components/PreLoader/AnimatePageTransition";
// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);
const AboutEntrance = () => {
	const headerContainerRef = useRef();

	useLayoutEffect(() => {
		AnimateHeader({ headerContainerRef });
	}, []);

	return (
		<div>
			<div className="p-5 pt-10 px-5 md:px-20 lg:px-35 xl:px-50 2xl:px-75 z-10">
				<div className="custom-heading pb-5 overflow-hidden ">
					<div ref={headerContainerRef} className="relative z-7 ">
						<div>Build digital things that work beautifully and feel easy.</div>
					</div>
				</div>

				<div className="border-t-[1px] my-15 text-color-text-hovering"></div>

				<div className="flex flex-col lg:flex-row gap-10 ">
					<div className="lg:w-[60vh] xl:w-full xl:text-lg 2xl:text-xl">
						<div className=" leading-relaxed z-10">
							Hey there! My name is{" "}
							<span className="font-bold italic">Abdul Mannan Saipi</span>. I
							graduated from{" "}
							<span className="font-semibold">President University</span> with a
							major in <span className="italic">Informatics</span>, earning a{" "}
							<span className="font-bold">GPA of 3.88 (Magna Cum Laude)</span>.
							I'm a <span className="font-medium">software developer</span> with
							experience in{" "}
							<span className="italic">
								web, mobile, and machine learning application development
							</span>
							.
						</div>

						<div className="mt-5 text-color-text-hovering animate-pulse">
							Always exploring...
						</div>
					</div>

					<div className="relative w-full h-[70vh] md:h-[80vh] lg:h-[90vh] overflow-hidden">
						<img
							src={graduate1}
							className="absolute top-0 left-0 w-full h-full object-cover object-[45%]"
						/>
					</div>
				</div>
			</div>
			<div className="flex justify-center min-h-[85vh]">
				<div className="w-[100vw] my-10 ">
					<img
						src={graduate2}
						className=" max-h-[85vh] w-full rounded-xl object-cover object-center"
					/>
				</div>
			</div>
		</div>
	);
};

export default AboutEntrance;
