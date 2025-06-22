import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router";
import Works from "../../Home/HomeRecentWork/Works.js";
import PrimaryButton from "../../../components/Buttons/PrimaryButton.jsx";
import { AppContext } from "../../../App.jsx";
import { useLenis } from "lenis/react";
import {
	slugify,
	handleImageNavigation,
} from "../../../utils/NavhiagtionImageAnimation.js";
import { AnimateHeader } from "../../../components/PreLoader/AnimatePageTransition.jsx";

const ExperienceDetail = () => {
	// Get the dynamic parameter from the URL
	const { workId } = useParams();

	const { navbarRef } = React.useContext(AppContext);
	const { preloaderRef } = React.useContext(AppContext);
	const lenis = useLenis();
	const navigate = useNavigate();

	const { handleButtonNavigation } = React.useContext(AppContext);
	const location = useLocation();
	const [currentWork, setCurrentWork] = useState(null);

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
		}
	}, [currentWork, location.pathname]);

	const currentIndex = Works.findIndex(
		(work) => slugify(work.company) === workId
	);

	const nextIndex = (currentIndex + 1) % Works.length;
	const nextWork = Works[nextIndex];

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
				{/* Image Header */}
				<div data-name="" className="overflow-hidden w-full  ">
					<img
						ref={imageRef}
						src={currentWork.img}
						className="h-[70vh] absolute w-[100vw] object-cover z-7 shadow-lg shadow-black"
						alt={`Image for ${currentWork.company}`}
						// Fallback for image loading errors
						onError={(e) => {
							e.target.onerror = null;
							e.target.src = `https://placehold.co/800x450/333333/FFFFFF?text=Image+Not+Found`;
						}}
					/>
				</div>

				{/* MAIN CONTENT */}
				<div className="pt-[75vh] flex flex-col gap-5 px-5 md:px-30 lg:px-45 xl:px-70 2xl:px-100 ">
					<div
						ref={headerContainerRef}
						className=" w-full relative font-semibold text-2xl md:text-3xl lg:text-4xl xl:text-5xl mt-5 lg:mt-10 mb-2 lg:mb-5 overflow-hidden"
					>
						<div>{currentWork.company}</div>
					</div>
					<div ref={descRef}>
						<p className="mb-5 lg:text-lg xl:text-xl 2xl:text-2xl">
							{currentWork.desc}
						</p>
					</div>

					{/* DETAIL */}
					<div className="flex flex-col gap-10 mt-10">
						{currentWork.points?.map((point, index) => (
							<div key={index} className="flex flex-col gap-6 items-center">
								{/* Corresponding Image */}
								{currentWork.iamges?.[index] && (
									<div className={` ${index % 2 === 1 ? "order-2" : ""}`}>
										<img
											src={currentWork.iamges[index]}
											alt={`${index + 1}`}
											className="rounded-xl shadow-md  object-cover w-full "
											onError={(e) => {
												e.target.onerror = null;
												e.target.src = `https://placehold.co/600x400/333333/FFFFFF?text=Image+Not+Found`;
											}}
										/>
									</div>
								)}

								{/* Point Text */}
								<div className={`  `}>
									<p className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-medium text-primary">
										{point}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* NEXT WORK */}
				<div className="flex flex-col items-center  py-[15vh] md:py-[30vh] mx-10 md:mx-30 lg:mx-50 xl:mx-65">
					<div className="text-color-text-hovering text-xs md:text-sm lg:text-md  font-semibold">
						NEXT WORK
					</div>
					<div className="text-primary custom-subheading mb-10">
						{nextWork.company}
					</div>
					<div className="group overflow-hidden cursor-none ">
						<img
							data-name="view"
							onClick={(e) =>
								handleImageNavigation(
									`/work/${slugify(nextWork.company)}`,
									e.currentTarget,
									navbarRef,
									preloaderRef,
									lenis,
									navigate
								)
							}
							src={nextWork.img}
							className="max-h-[70vh]  w-full group-hover:scale-105 transition-transform duration-500 ease-in-out object-cover object-center"
							alt={`Next work for ${nextWork.company}`}
						/>
					</div>
				</div>

				{/* <div className="self-center pt-10 pb-20">
                    <PrimaryButton
                        label="Back to All Works"
                        handleOnClick={() => handleButtonNavigation("/work")}
                    />
                </div> */}
			</div>
		</div>
	);
};

export default ExperienceDetail;
