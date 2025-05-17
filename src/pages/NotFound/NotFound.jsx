import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import CustomCursor from "../../components/CustomCursor";
const NotFound = () => {
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
				className="min-h-[80vh] flex flex-col items-center justify-center bg-light-dark  text-primary  "
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
