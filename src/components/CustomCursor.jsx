import { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [hovering, setHovering] = useState(false);
	const [hoveringImage, setHoveringImage] = useState(false);
	const [isInViewport, setIsInViewport] = useState(true);
	const [isTouchDevice, setIsTouchDevice] = useState(false);
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const hasMovedRef = useRef(false);

	// Update window width state when resizing
	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		// Detect touch devices
		setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);

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
			if (dataName === "view") setHoveringImage(true);
		};

		const handleMouseOut = (e) => {
			const target = e.target;
			const tagName = target.tagName;
			const dataName =
				target.getAttribute("data-name") || target.getAttribute("name");

			if (tagName !== "A" || tagName === "A" || tagName === null) setHovering(false);
			if (dataName !== "view" || dataName === null || dataName === "view") setHoveringImage(false);
		};

		window.addEventListener("mousemove", moveCursor);
		window.addEventListener("mouseover", handleMouseOver);
		window.addEventListener("mouseout", handleMouseOut);

		return () => {
			window.removeEventListener("mousemove", moveCursor);
			window.removeEventListener("mouseover", handleMouseOver);
			window.removeEventListener("mouseout", handleMouseOut);
		};
	}, [windowWidth]);

	useEffect(() => {
	const checkHoverOnScroll = () => {
		const { x, y } = position;

		let hoveringLink = false;
		let hoveringImg = false;

		// Check for <a> tags
		document.querySelectorAll("a").forEach((el) => {
			const rect = el.getBoundingClientRect();
			if (
				x >= rect.left &&
				x <= rect.right &&
				y >= rect.top &&
				y <= rect.bottom
			) {
				hoveringLink = true;
			}
		});

		// Check for elements with data-name="view"
		document.querySelectorAll("[data-name='view']").forEach((el) => {
			const rect = el.getBoundingClientRect();
			// console.log("🚀 ~ document.querySelectorAll ~ rect:", rect)
			if (
				x >= rect.left &&
				x <= rect.right &&
				y >= rect.top &&
				y <= rect.bottom
			) {
				hoveringImg = true;
			}
		});

		setHovering(hoveringLink);
		setHoveringImage(hoveringImg);
	};

	window.addEventListener("scroll", checkHoverOnScroll);

	return () => {
		window.removeEventListener("scroll", checkHoverOnScroll);
	};
}, [position]);


	// if the cursor not move(mobile then hide)
	// const shouldHide = !hasMovedRef.current || !isInViewport;
	const shouldHide = isTouchDevice || !hasMovedRef.current || !isInViewport;

	// console.log(shouldHide);
	return (
		<div
			className={`bg-cursor fixed pointer-events-none h-5 translate-z-100 mix-blend-difference rounded-full z-4  
				${hovering ? " scale-240" : ""}
				${hoveringImage ? "scale-200 w-10" : "w-5"}
				${shouldHide ? "hidden" : ""}
				transition-transform duration-450`}
			style={{
				left: `${position.x}px`,
				top: `${position.y}px`,
			}}
		>
			{hoveringImage && (
				<div className="w-full h-full text-[10px] font-semibold flex items-center justify-center">
					VIEW
				</div>
			)}
		</div>
	);
}
