import React, { useEffect, useState } from "react";
import certificates from "./CertificatesList";

const Certificate = () => {
	const [hoveredIndex, setHoveredIndex] = useState(null);
	const [position, setPosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		console.log(certificates);
		const moveCursor = (e) => {
			setTimeout(() => {
				// set delay to have magnetic effect
				setPosition({ x: e.clientX, y: e.clientY });
			}, 100);
		};

		window.addEventListener("mousemove", moveCursor);

		return () => {
			window.removeEventListener("mousemove", moveCursor);
		};
	}, []);

	return (
		<div className="flex flex-col text-primary">
			{hoveredIndex !== null && (
				<div
					className="fixed bg-color-text-hovering w-[400px] h-[350px] transition-transform duration-300 ease-out scale-100"
					style={{
						top: `${position.y - 175}px`,
						left: `${position.x - 200}px`,
						pointerEvents: "none",
					}}
				>
					<img
						src={certificates[hoveredIndex].image}
						alt="certificate"
						className="px-9 py-18 w-full h-full"
					/>
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

			<div className="p-20 text-lg text-color-text-hovering">
				<span className="text-xl text-primary">Lorem ipsum, dolor </span> sit
				amet consectetur adipisicing elit...
			</div>

			<div className="flex flex-col px-5">
				{certificates.map((cert, index) => (
					<a
						href={cert.link}
						target="_blank"
						data-name="certificate"
						key={index}
						className="flex gap-5 py-2"
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
