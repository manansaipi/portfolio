import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router";
import Works from "../../Home/HomeRecentWork/Works.js";
import PrimaryButton from "../../../components/Buttons/PrimaryButton.jsx";
import { AppContext } from "../../../App.jsx";
import { useLenis } from "lenis/react";
import slugify from "../slugifyHelper.js";
import { AnimateHeader } from "../../../components/PreLoader/AnimatePageTransition.jsx";

const ExperienceDetail = () => {
	// Get the dynamic parameter from the URL
	const { workId } = useParams();
	const { navbarRef } = React.useContext(AppContext);
	const { handleButtonNavigation } = React.useContext(AppContext);
	const location = useLocation();
	const [currentWork, setCurrentWork] = useState(null);
	const lenis = useLenis();

	const headerContainerRef = useRef();
	const descRef = useRef();
	const imageRef = useRef();

	useEffect(() => {
		// Find the work that matches the workId (slug) from the URL
		const foundWork = Works.find((work) => slugify(work.company) === workId);
		setCurrentWork(foundWork);
	}, [workId]); // Re-run effect if workId changes

	useLayoutEffect(() => {
		if (currentWork && imageRef.current) {
			imageRef.current.classList.remove("z-7");
			lenis.scrollTo(navbarRef.current, {
				duration: 1,
			});
		}
	}, [currentWork, location.pathname]);

	useEffect(() => {
		// AnimateHeader({ headerContainerRef });
		// AnimateHeader({ descRef });
	});
	if (!currentWork) {
		// Handle case where work is not found
		return (
			<div className="min-h-screen flex items-center justify-center bg-light-dark text-primary px-5 md:px-20 lg:px-35 xl:px-50 2xl:px-75">
				<div className="text-center">
					<p className="text-4xl font-bold mb-4">Work Not Found</p>
					<p className="text-lg mb-8">
						The work you are looking for does not exist.
					</p>
					<PrimaryButton
						label="Back to All Works"
						handleOnClick={() => handleButtonNavigation("/work")}
					/>
				</div>
			</div>
		);
	}

	return (
		<div data-name="" className="min-h-screen bg-light-dark text-primary ">
			<div data-name="" className=" flex flex-col">
				<div data-name="" className="overflow-hidden w-full  ">
					<img
						ref={imageRef}
						src={currentWork.img}
						className="h-[70vh] absolute w-[100vw] object-cover z-7"
						alt={`Image for ${currentWork.company}`}
						// Fallback for image loading errors
						onError={(e) => {
							e.target.onerror = null;
							e.target.src = `https://placehold.co/800x450/333333/FFFFFF?text=Image+Not+Found`;
						}}
					/>
				</div>
				<div className="pt-[75vh] flex flex-col gap-5 px-5 md:px-20 lg:px-35 xl:px-50 2xl:px-75 ">
					<div
						ref={headerContainerRef}
						className=" w-full relative font-semibold text-2xl md:text-3xl lg:text-4xl xl:text-5xl mt-5 lg:mt-10 mb-2 lg:mb-5 overflow-hidden"
					>
						<div>{currentWork.company}</div>
					</div>
					<div ref={descRef}>
						<p className="mb-5 xl:text-lg 2xl:text-xl">{currentWork.desc}</p>
					</div>
				</div>
				{/* You can add more details about the work here, e.g., a full description, technologies used, etc. */}
				<div className="self-center pt-10 pb-20">
					<PrimaryButton
						label="Back to All Works"
						handleOnClick={() => handleButtonNavigation("/work")}
					/>
				</div>
			</div>
		</div>
	);
};

export default ExperienceDetail;
