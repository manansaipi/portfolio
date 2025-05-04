import React, { useEffect, useState, useRef } from "react";
import certificates from "./CertificatesList";

const Certificate = () => {
	const [hoveredIndex, setHoveredIndex] = useState(null);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const certDescContainerRef = useRef();
	const certTitleRef = useRef();
	const certDescRef = useRef();

	const hoveredIndexRef = useRef(null);

	useEffect(() => {
		hoveredIndexRef.current = hoveredIndex;
	}, [hoveredIndex]);

	useEffect(() => {
		const moveCursor = (e) => {
			// set delay to have magnetic effect
			setTimeout(() => {
				const currentIndex = hoveredIndexRef.current;

				if (currentIndex !== null) {
					certTitleRef.current.textContent = certificates[currentIndex].name;
					certDescRef.current.textContent = certificates[currentIndex].desc;
				}

				setPosition({ x: e.clientX, y: e.clientY });
			}, 150);
		};

		window.addEventListener("mousemove", moveCursor);

		return () => {
			window.removeEventListener("mousemove", moveCursor);
		};
	}, []);

	return (
		<div className="flex flex-col lg:flex-row text-primary  h-full">
			{hoveredIndex !== null && (
				<div
					className="fixed bg-gray-700 w-[400px] h-[350px] transition-transform duration-300 ease-out scale-100"
					style={{
						top: `${position.y - 160}px`,
						left: `${position.x - 180}px`,
						pointerEvents: "none",
					}}
				>
					<div className="px-10 w-full h-full flex items-center justify-center">
						<img
							src={certificates[hoveredIndex].image}
							alt="certificate"
							className="shadow-lg shadow-black"
						/>
					</div>
					{/* <div
						className="absolute text-white bg-black opacity-70 px-2 py-1"
						style={{
							top: "50%", // Vertical center
							left: "50%", // Horizontal center
							transform: "translate(-50%, -50%)", // Correct centering
						}}
					>
						VIEW
					</div> */}
				</div>
			)}

			<div ref={certDescContainerRef} className="pt-10 px-10 md:pt-15 md:px-15 lg:px-20 lg:pt-5   h-[25vh] lg:w-[60vw] overflow-hidden text-ellipsis text-lg text-color-text-hovering">
				<span ref={certTitleRef} className="text-xl text-primary"></span>
				<span className="text-xl text-primary">. </span>
				<span ref={certDescRef}></span>
			</div>

			<div className="flex flex-col px-5 md:px-10">
				{certificates.map((cert, index) => (
					<a
						href={cert.link}
						target="_blank"
						data-name="certificate"
						key={index}
						className="flex gap-5 py-2 md:cursor-none"
						onMouseEnter={() => setHoveredIndex(index)}
						onMouseLeave={() => setHoveredIndex(null)}
					>
						<a data-name="certificate" className="text-color-text-hovering">
							{cert.year}
						</a>
						<a data-name="certificate" className="text-3xl font-extrabold">
							{cert.name}
						</a>
					</a>
				))}
			</div>
		</div>
	);
};

export default Certificate;
