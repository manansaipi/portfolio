import { useEffect, useState, useRef } from "react";

export const useCustomCursor = () => {
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
			if (dataName === "clickable") setHovering(true);
			if (dataName === "view") setHoveringImage(true);
		};

		const handleMouseOut = (e) => {
			const target = e.target;
			const tagName = target.tagName;
			const dataName =
				target.getAttribute("data-name") || target.getAttribute("name");

			if (tagName !== "A" || tagName === "A" || tagName === null) setHovering(false);
			if (dataName !== "clickable" || dataName === null || dataName === "clickable") setHovering(false);
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

	const shouldHide = isTouchDevice || !hasMovedRef.current || !isInViewport;

	return {
		position,
		hovering,
		hoveringImage,
		shouldHide
	};
};
