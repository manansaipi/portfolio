import { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [hovering, setHovering] = useState(false);
	const [hoveringCertif, setHoveringCertif] = useState(false);
	const [isInViewport, setIsInViewport] = useState(true); // <- new state
	const hasMovedRef = useRef(false);

	useEffect(() => {
		const moveCursor = (e) => {
			if (!hasMovedRef.current) hasMovedRef.current = true;
			setPosition({ x: e.clientX, y: e.clientY });

			const isOutside =
				e.clientY <= 0 ||
				e.clientX <= 0 ||
				e.clientX >= window.innerWidth ||
				e.clientY >= window.innerHeight;

			// Update state only when necessary
			setIsInViewport(!isOutside);
		};

		const handleMouseOver = (e) => {
			const target = e.target;
			const tagName = target.tagName;
			const dataName =
				target.getAttribute("data-name") || target.getAttribute("name");

			if (tagName === "A") setHovering(true);
			if (dataName === "view") setHoveringCertif(true);
		};

		const handleMouseOut = (e) => {
			const target = e.target;
			const tagName = target.tagName;
			const dataName =
				target.getAttribute("data-name") || target.getAttribute("name");

			if (tagName === "A") setHovering(false);
			if (dataName === "view") setHoveringCertif(false);
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

	// if the cursor not move(mobile then hide)
	const shouldHide = !hasMovedRef.current || !isInViewport;
	// console.log(shouldHide);
	return (
		<div
			className={`bg-primary fixed pointer-events-none h-5 translate-z-100 mix-blend-difference rounded-full z-4  
				${hovering ? " scale-240" : ""}
				${hoveringCertif ? "scale-200 w-10" : "w-5"}
				${shouldHide ? "hidden" : ""}
				transition-transform duration-500`}
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
