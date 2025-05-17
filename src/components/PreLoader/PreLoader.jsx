import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useLocation } from "react-router";

const PreLoader = ({
	setEntranceAnimationDone,
	preloaderRef,
	preloaderTextRef,
}) => {
	const location = useLocation();
	useEffect(() => {
		const tl = gsap.timeline({
			onComplete: () => {
				setEntranceAnimationDone(true); // Show the rest of the components

				// if (preloaderRef.current) {
				// 	preloaderRef.current.remove();
				// }
			},
		});
		console.log(location.pathname);

		if (location.pathname === "/") {
			tl.to(preloaderRef.current, {
				opacity: 0,
				duration: 1.5,
				delay: 7, //-> 7
			});
		} else {
			tl.fromTo(
				preloaderRef.current,
				{ opacity: 1 },
				{
					opacity: 0,
					duration: 1,
					delay: 1,
				}
			);
		}
	}, []);

	return (
		<div
			id="preloaderId"
			ref={preloaderRef}
			className="section fixed bg-black w-full z-6 scroll-d even pointer-events-none text-primary flex justify-center items-center overflow-hidden"
		>
			<div className="text-4xl overflow-hidden">
				<div ref={preloaderTextRef}>{/* Experience */}</div>
			</div>
		</div>
	);
};

export default PreLoader;
