import React, { useRef, useLayoutEffect, useState } from "react";
import { AnimateHeader } from "@components/layout/PreLoader/AnimatePageTransition";
import PrimaryButton from "@components/ui/Buttons/PrimaryButton";
import { AppContext } from "@/App";
import { useMatch, Link, useNavigate } from "react-router";
import { useAnimations } from "@react-three/drei";
import gsap from "gsap";
import { useLenis } from "lenis/react";
import {
	slugify,
	handleImageNavigation,
} from "@utils/navigationImageAnimation";
import Works from "@constants/works";

const ExperienceEntrance = () => {
	const { navbarRef, preloaderRef, handleButtonNavigation } = React.useContext(AppContext);
	const lenis = useLenis();
	const navigate = useNavigate();

	const isExperienceDetail = useMatch("/work/:workId");
	const headerContainerRef = useRef();
	const imageRefs = useRef([]);

	useLayoutEffect(() => {
		if (isExperienceDetail) return;
		AnimateHeader({ headerContainerRef });
	}, []);

	const [viewportHeight, setViewportHeight] = useState(0);
	useLayoutEffect(() => {
		setViewportHeight(window.innerHeight);
	}, []);

	return (
		<div 
			className="bg-light-dark text-primary px-5 md:px-20 lg:px-35 xl:px-50 2xl:px-75 pt-[var(--vh-20)]"
			style={{
				"--vh-10": viewportHeight ? `${viewportHeight * 0.10}px` : "10vh",
				"--vh-15": viewportHeight ? `${viewportHeight * 0.15}px` : "15vh",
				"--vh-20": viewportHeight ? `${viewportHeight * 0.20}px` : "20vh",
				"--vh-40": viewportHeight ? `${viewportHeight * 0.40}px` : "40vh",
				"--vh-70": viewportHeight ? `${viewportHeight * 0.70}px` : "70vh"
			}}
		>
			{!isExperienceDetail && (
				<div
					ref={headerContainerRef}
					className="flex pt-[var(--vh-10)] items-center pb-[var(--vh-40)] relative overflow-hidden"
				>
					<p className="custom-heading">
						I have over 2 years of experience building digital things
					</p>
				</div>
			)}
			<div>
				{Works.map((work, index) => (
					<div
						key={index}
						className="mb-[var(--vh-15)] lg:mb-[var(--vh-20)]  flex flex-col"
					>
						<div
							data-name="view"
							onClick={() =>
								handleImageNavigation(
									`/work/${slugify(work.company)}`,
									imageRefs.current[index],
									navbarRef,
									preloaderRef,
									lenis,
									navigate
								)
							}
							className="group overflow-hidden cursor-none "
						>
							<img
								ref={(el) => (imageRefs.current[index] = el)}
								src={work.img}
								className="w-full max-h-[var(--vh-70)] pointer-events-none group-hover:scale-105 transition-transform duration-500 ease-in-out object-cover object-center"
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
									handleImageNavigation(
										`/work/${slugify(work.company)}`,
										imageRefs.current[index],
										navbarRef,
										preloaderRef,
										lenis,
										navigate
									)
								}
							/>
						</div>
					</div>
					// TODO : we can use scroll trigger to expand what i am doing in each work instead of using another route
				))}
			</div>
			
			{!isExperienceDetail && (
				<div className="flex justify-center pb-20">
					<PrimaryButton
						label={"MY BLOG"}
						handleOnClick={() => handleButtonNavigation("/blog")}
					/>
				</div>
			)}
		</div>
	);
};

export default ExperienceEntrance;
