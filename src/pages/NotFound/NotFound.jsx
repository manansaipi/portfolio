import React, { useLayoutEffect,  useState,  useEffect, useRef } from "react";
import { gsap } from "gsap";
import CustomCursor from "@components/ui/CustomCursor/CustomCursor";
const NotFound = () => {
	const [viewportHeight, setViewportHeight] = useState(0);
	useLayoutEffect(() => {
		setViewportHeight(window.innerHeight);
	}, []);

	const containerRef = useRef(null);

	useEffect(() => {
		gsap.fromTo(
			containerRef.current,
			{ opacity: 0, y: 20 },
			{ opacity: 1, y: 0, duration: 1, ease: "power2.out" }
		);
	}, []);

	return (
		<>
			<div
				ref={containerRef}
				className="min-h-[var(--vh-80)] flex flex-col items-center justify-center bg-light-dark  text-primary  "
				style={{
					"--vh-80": viewportHeight ? `${viewportHeight * 0.80}px` : "80vh"
				}}
			>
				<h1 className="text-9xl font-bold mb-4">404</h1>
				<p className="text-2xl mb-6 text-center">
					Sorry, the page you're looking for doesn't exist.
				</p>
				<a href="/" className="cursor-none">
					Go back home
				</a>
			</div>
		</>
	);
};

export default NotFound;
