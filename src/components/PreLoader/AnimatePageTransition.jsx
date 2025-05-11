import gsap from "gsap";

export const AnimatePageTransition = ({
	preloaderRef,
	preloaderTextRef,
	href,
	navigate,
}) => {
	console.log(preloaderRef);
	if (preloaderRef.current) {
		const tl = gsap.timeline();

		tl.to(preloaderRef.current, {
			opacity: 1,
			duration: 0.5,
			onComplete: () => {
				navigate(href);
			},
		}).to(preloaderRef.current, {
			opacity: 0,
			duration: 0.5,
		});
		// .fromTo(
		// 	preloaderTextRef.current,
		// 	{ y: "50px", opacity: 0 },
		// 	{
		// 		y: 0,
		// 		opacity: 1,
		// 		duration: 0.5,
		// 		onComplete: () => {
		// 			navigate(href);
		// 		},
		// 	},
		// 	"-=0.2"
		// );
	}
};
