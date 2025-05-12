import { useEffect, useState } from "react";

export default function CustomCursor() {
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [hovering, setHovering] = useState(false);
	const [hoveringCertif, setHoveringCertif] = useState(false);

	useEffect(() => {
		const moveCursor = (e) => {
			setPosition({ x: e.clientX, y: e.clientY });
			//   console.log(e.target.tagName);
			// console.log(e.target.className);
			//   console.log(e.target.className.includes("navbar"));
		};

		const handleMouseOver = (e) => {
			const target = e.target;

			const tagName = target.tagName;
			const dataName =
				target.getAttribute("data-name") || target.getAttribute("name");

			if (tagName === "A") {
				setHovering(true);
			}
			if (dataName == "view") {
				setHoveringCertif(true);
			}
		};

		const handleMouseOut = (e) => {
			const target = e.target;

			const tagName = target.tagName;
			const dataName =
				target.getAttribute("data-name") || target.getAttribute("name");

			if (tagName === "A") {
				setHovering(false);
			}
			if (dataName == "view") {
				setHoveringCertif(false);
			}
		};

		window.addEventListener("mousemove", moveCursor);
		window.addEventListener("mouseover", handleMouseOver);
		window.addEventListener("mouseout", handleMouseOut);

		return () => {
			window.removeEventListener("mousemove", moveCursor);
			window.removeEventListener("mouseover", handleMouseOver);
			window.removeEventListener("mouseout", handleMouseOut);
		};
	}, []);

	return (
		<div
			className={`bg-primary pointer-events-none fixed  h-5 mix-blend-difference translate-z-100 ${
				hovering ? " scale-240" : ""
			} ${
				hoveringCertif ? "scale-240 w-10  " : "w-5"
			} rounded-full transition-transform duration-200 hidden md:block z-4 `}
			style={{
				left: `${position.x}px`,
				top: `${position.y}px`,
			}}
		>
			{hoveringCertif && (
				<div className="w-full h-full text-[10px] font-semibold flex items-center justify-center">
					VIEW
				</div>
			)}
		</div>
	);
}
