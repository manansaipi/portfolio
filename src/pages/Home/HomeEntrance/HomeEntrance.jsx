import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import greetings from "./greetings";
import ImageIntro from "./ImageEntrance";
import { useLocation } from "react-router";
import { EntranceAnimation } from "./EntranceAnimation";
import { AnimateHeader } from "../../../components/PreLoader/AnimatePageTransition";

const Home = ({ entranceAnimationDone }) => {
	const homeContainerRef = useRef();
	const headerContainerRef = useRef();
	const ciaoRef = useRef();
	const imRef = useRef();
	const benRef = useRef();
	const doingRef = useRef();
	const techRef = useRef();
	const softwareRef = useRef();
	const whoRef = useRef();
	const lovesRef = useRef();
	const simpleRef = useRef();
	const aboutRef = useRef();
	const imgRef = useRef();
	const imgContainerRef = useRef();

	const [currentGreeting, setCurrentGreeting] = useState(greetings[0]);

	useLayoutEffect(() => {
		const cleanup = EntranceAnimation({
			refs: {
				homeContainerRef,
				headerContainerRef,
				ciaoRef,
				imRef,
				benRef,
				doingRef,
				techRef,
				softwareRef,
				whoRef,
				lovesRef,
				simpleRef,
				imgContainerRef,
			},
			greetings,
			setCurrentGreeting,
			currentGreeting,
			location,
		});

		return cleanup;
	}, []);

	useEffect(() => {
		if (!entranceAnimationDone) return;
		AnimateHeader({ headerContainerRef });
	}, [location.pathname]);

	return (
		// ->60/80vh
		<div>
			<div ref={homeContainerRef} className="h-[80vh] overflow-hidden">
				<section className="h-[80vh] bg-light-dark flex flex-col  items-start text-2xl text-primary px-10 md:px-20 md:text-3xl lg:px-56 lg:text-4xl xl:px-96 xl:text-5xl transition-all ">
					<div className="h-[23vh]"></div>
					<div className="overflow-hidden w-full">
						<div
							ref={headerContainerRef}
							className="flex relative z-7 flex-col w-full "
						>
							{/* overflow-hidden */}
							<div className="flex gap-2 lg:gap-3 overflow-hidden ">
								<div className="w-15 md:w-18 lg:w-21 xl:w-29" ref={ciaoRef}>
									{currentGreeting},
								</div>
								<div ref={imRef}>I'm </div>
								<div ref={benRef}>Ben.</div>
							</div>
							{/* overflow-hidden */}
							<div className="text-color-text-hovering flex gap-2 lg:gap-3 overflow-hidden xl:h-13 ">
								<div ref={doingRef} className="flex  w-full gap-2 lg:gap-3 ">
									<span>I'm a</span>
									<div className=" ">
										<span className="absolute" ref={techRef}>
											tech enthusiast
										</span>
										<span className="absolute" ref={softwareRef}>
											software engineer
										</span>
									</div>
								</div>
							</div>
							{/* overflow-hidden */}
							<div className="text-color-text-hovering overflow-hidden">
								<div
									ref={whoRef}
									className="flex w-full gap-2 lg:gap-3 xl:h-13  "
								>
									<span>who</span>
									<div className="">
										<span className="absolute" ref={lovesRef}>
											simplifies complexity.
										</span>
										<span className="absolute" ref={simpleRef}>
											loves building things.
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				<ImageIntro imgContainerRef={aboutRef} imgRef={imgRef} className={""} />
			</div>
			{/* this div to prevent text content overflow with the content bellow, later will be  */}
			<ImageIntro
				imgContainerRef={imgContainerRef}
				imgRef={imgRef}
				className={"hidden"}
			/>
		</div>
	);
};

export default Home;
