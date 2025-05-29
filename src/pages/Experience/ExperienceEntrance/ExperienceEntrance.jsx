import React, { useRef, useLayoutEffect } from "react";
import { AnimateHeader } from "../../../components/PreLoader/AnimatePageTransition";
import works from "../../Home/HomeRecentWork/Works";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import { AppContext } from "../../../App";
import { useMatch, Link, useNavigate } from "react-router";
import { useAnimations } from "@react-three/drei";
import gsap from "gsap";
import { useLenis } from "lenis/react";
import slugify from "../slugifyHelper";

const ExperienceEntrance = () => {
	const { navbarRef } = React.useContext(AppContext);
	const { preloaderRef } = React.useContext(AppContext);
	const isExperienceDetail = useMatch("/work/:workId");
	const navigate = useNavigate();
	const lenis = useLenis();
	const headerContainerRef = useRef();
	const imageRefs = useRef([]);

	useLayoutEffect(() => {
		if (isExperienceDetail) return;
		AnimateHeader({ headerContainerRef });
	}, []);

	function handleWorkNavigation(path, imageElement) {
		document.body.style.overflow = "hidden"; // standard no-scroll implementation
		document.body.setAttribute("data-lenis-prevent", "true");

		const rect = imageElement.getBoundingClientRect();

		// Clone the image
		const clone = imageElement.cloneNode(true);
		document.body.appendChild(clone);

		// Set initial fixed position based on current position
		Object.assign(clone.style, {
			position: "fixed",
			top: `${rect.top}px`,
			left: `${rect.left}px`,
			width: `${rect.width}px`,
			height: `${rect.height}px`,
			margin: 0,
			pointerEvents: "none", // prevent accidental interaction
		});

		// Animate to top center
		gsap.to(clone, {
			top: 0,
			left: 0,
			width: "100vw",
			height: "70vh",
			duration: 1.2,
			ease: "power3.out",
			onStart: () => {
				imageElement.classList.add("opacity-0");
				if (clone) {
					clone.classList.add("z-7");
				}
				gsap.to(preloaderRef.current, {
					opacity: 1,
					duration: 0.8,
					onComplete: () => {
						lenis.start();
						lenis.scrollTo(navbarRef.current, {
							duration: 0,
						});
					},
				});
			},
			onComplete: () => {
				navigate(path);

				gsap.to(preloaderRef.current, {
					opacity: 0,
					duration: 1,
					delay: 0.5,
				});
				setTimeout(() => {
					clone.remove();
					document.body.style.overflow = ""; // standard no-scroll implementation
				}, 1500);
			},
		});
	}

	return (
		<div className="pt-[20vh] pb-100 bg-light-dark text-primary px-5 md:px-20 lg:px-35 xl:px-50 2xl:px-75">
			{!isExperienceDetail && (
				<div
					ref={headerContainerRef}
					className="flex pt-[10vh] items-center pb-[40vh] relative overflow-hidden"
				>
					<p className="custom-heading">
						I have over 2 years of experience building digital things
					</p>
				</div>
			)}
			<div>
				{works.map((work, index) => (
					<div key={index} className="mb-[15vh] lg:mb-[20vh]  flex flex-col">
						<div
							data-name="view"
							onClick={() =>
								handleWorkNavigation(
									`/work/${slugify(work.company)}`,
									imageRefs.current[index]
								)
							}
							className="group overflow-hidden cursor-none "
						>
							<img
								ref={(el) => (imageRefs.current[index] = el)}
								src={work.img}
								className="w-full max-h-[70vh] pointer-events-none group-hover:scale-105 transition-transform duration-500 ease-in-out object-cover object-center"
								alt=""
							/>
						</div>
						<div className="text-xl md:text-2xl lg:text-3xl xl:text-4xl mt-5 lg:mt-10 mb-2 lg:mb-5  ">
							{work.company}
						</div>
						<p className="mb-5 xl:text-lg 2xl:text-xl">{work.desc}</p>
						<div className="self-start">
							<PrimaryButton
								label={"VIEW MORE"}
								handleOnClick={() =>
									handleWorkNavigation(
										`/work/${slugify(work.company)}`,
										imageRefs.current[index]
									)
								}
							/>
						</div>
					</div>
					// TODO : we can use scroll trigger to expand what i am doing in each work instead of using another route
				))}
			</div>
		</div>
	);
};

export default ExperienceEntrance;
