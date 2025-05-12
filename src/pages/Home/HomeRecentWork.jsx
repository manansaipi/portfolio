import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import galadinerlgsm from "../../assets/img/profiles/galadinerlgsm.JPEG"; // adjust the path as needed
import mattel from "../../assets/img/profiles/mattel.jpg"; // adjust the path as needed
import dpr from "../../assets/img/profiles/dpr.jpg"; // adjust the path as needed
const HomeRecentWork = () => {
	const works = [
		{
			id: 1,
			company: "LG Sinar Mas",
			role: "Software Engineer",
			startDate: "Dec 2024",
			endDate: "Present",
			img: galadinerlgsm,
			bgColor: "bg-neutral-800",
			url: "",
		},
		{
			id: 2,
			company: "PT. \u00A0Mattel Indonesia",
			role: "Full Stack Developer",
			startDate: "Jan 2024",
			endDate: "Dec 2024",
			img: mattel,
			bgColor: "bg-neutral-400",
			url: "",
		},
		{
			id: 3,
			company: "Sekretariat Jendral DPR RI",
			role: "IT Programmer",
			startDate: "Aug 2023",
			endDate: "Dec 2023",
			img: dpr,
			bgColor: "bg-zinc-700",
			url: "",
		},
	];

	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [showPhoto, setShowPhoto] = useState(false); // new line
	const [hoveredIndex, setHoveredIndex] = useState(0);
	const [isLarge, setIsLarge] = useState(false);
	useEffect(() => {
		const moveCursor = (e) => {
			// set delay to have magnetic effect
			setTimeout(() => {
				setPosition({ x: e.clientX, y: e.clientY });
			}, 150);
		};

		window.addEventListener("mousemove", moveCursor);

		return () => {
			window.removeEventListener("mousemove", moveCursor);
		};
	}, []);

	useEffect(() => {
		const handleResize = () => {
			console.log(window.innerWidth);
			if (window.innerWidth < 1024) {
				setIsLarge(false);
			} else {
				setIsLarge(true);
			}
		};
		handleResize();

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<div className=" pb-100 bg-light-dark px-5 md:px-10 lg:px-25">
			{/* large size */}
			{isLarge ? (
				<div className="text-primary">
					<div className="mx-15 py-10 text-sm text-color-text-hovering">
						RECENT WORK
					</div>
					<div className="flex flex-col text-primary">
						{works.map((work, index) => {
							return (
								<>
									<div className="border-t-1 border-color-text-hovering "></div>
									<div
										key={work.id}
										data-name="view"
										onMouseEnter={() => {
											setShowPhoto(true);
											setHoveredIndex(index);
										}}
										onMouseLeave={() => {
											setShowPhoto(false);
											setHoveredIndex();
										}}
										className="hover:text-color-text-hovering transition-all duration-300 ease-out hover:-translate-y-1"
									>
										<div className="flex flex-row justify-between items-center m-15 pointer-events-none hover:text-color-text-hovering transition-all duration-300 ease-out hover:-translate-y-1">
											<div className="flex flex-col ">
												<div className="text-6xl ">{work.company}</div>
												<div className="text-xl">{work.role}</div>
											</div>
											<div>
												{work.startDate} &nbsp;-&nbsp; {work.endDate}
											</div>
										</div>
									</div>
								</>
							);
						})}
						<div className="border-t-1 border-color-text-hovering "></div>
					</div>
				</div>
			) : (
				<div className="flex flex-col md:flex-row gap-10">
					{/* mobile-medium size */}
					{works.slice(0, 2).map((work, index) => {
						return (
							<div
								key={work.id}
								data-name="view"
								className="flex flex-col gap-5 text-white h-full md:w-1/2 "
							>
								<div
									className={`h-[50vh]  ${work.bgColor} pointer-events-none `}
								>
									<div className="px-5 w-full h-full flex items-center justify-center">
										<img
											className="shadow-lg shadow-black"
											src={work.img}
											alt=""
										/>
									</div>
								</div>
								<div className="pointer-events-none">
									<div className="text-3xl">{work.company} </div>
									<div className=" border-b-1 my-5"></div>
									<div className="flex justify-between">
										<div>{work.role}</div>
										<div>
											{work.startDate} &nbsp;-&nbsp; {work.endDate}
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}

			{/* hovered image */}
			{hoveredIndex !== undefined && showPhoto && (
				<div
					className={`fixed ${works[hoveredIndex].bgColor} w-[400px] h-[350px] transition-transform duration-300 ease-out scale-100`}
					style={{
						top: `${position.y - 160}px`,
						left: `${position.x - 180}px`,
						pointerEvents: "none",
					}}
				>
					<div className="px-10 w-full h-full flex items-center justify-center">
						<img
							src={works[hoveredIndex].img}
							alt="certificate"
							className="shadow-lg shadow-black"
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default HomeRecentWork;
