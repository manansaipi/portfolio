import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useLocation } from "react-router";

const PreLoader = ({ setAnimationDone, preloaderRef, preloaderTextRef }) => {
	const location = useLocation();
	useEffect(() => {
		const tl = gsap.timeline({
			onComplete: () => {
				setAnimationDone(true); // Show the rest of the components

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
				delay: 7,
			});
		} else {
			tl.to(preloaderRef.current, {
				opacity: 0,
				duration: 1,
				delay: 0,
			});
		}
        
	}, [setAnimationDone]);

	return (
		<div
			id="preloaderId"
			ref={preloaderRef}
			className="section fixed bg-black w-full z-5 scroll-d even pointer-events-none text-primary flex justify-center items-center overflow-hidden"
		>
			<div className="text-4xl overflow-hidden">
				<div ref={preloaderTextRef}>{/* Experience */}</div>
			</div>
		</div>
	);
};

export default PreLoader;
