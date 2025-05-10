import React, { useRef, useEffect } from "react";
import Home from "../ComingSoon/ComingSoon";
import gsap from "gsap";

const TransitionPage = ({ location }) => {
	const routesMap = {
		"/home": "Home",
		"/experience": "Experience",
		"/about": "About",
	};

	const page = routesMap[location.pathname] || "Page";

	const transitionRef = useRef();
	const textRef = useRef();

	useEffect(() => {
		const tl = gsap.timeline();
		tl.fromTo(
			transitionRef.current,
			{ y: "120vh" },
			{ y: 0, duration: 1, ease: "power4.out" }
		)
			.fromTo(
				textRef.current,
				{
					opacity: 0,
					y: 50,
				},
				{ opacity: 1, y: 0, duration: 1 },
				"-=0.6"
			)
			.to(
				transitionRef.current,
				{
					y: "-100vh",
					duration: 1,
					ease: "power4.in",
				},
				"-=0.4"
			);
	}, []);

	return (
		<div
			ref={transitionRef}
			className="fixed h-full w-full top-0 bg-black z-[9990]"
		>
			<div className="flex items-center justify-center section text-primary text-5xl">
				<p ref={textRef}>{page}</p>
			</div>
		</div>
	);
};

export default TransitionPage;
