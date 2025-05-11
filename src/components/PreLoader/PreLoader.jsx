import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const PreLoader = ({ setAnimationDone, preloaderRef, preloaderTextRef }) => {
	useEffect(() => {
		const tl = gsap.timeline({
			onComplete: () => {
				setAnimationDone(true); // Show the rest of the components

				if (preloaderRef.current) {
					preloaderRef.current.remove();
				}
			},
		});

		// tl.to(preloaderRef.current, {
		// 	opacity: 0,
		// 	duration: 1.5,
		// 	delay: 7,
		// });
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
