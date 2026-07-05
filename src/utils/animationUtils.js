import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const AnimateRef = (ref) => {
	if (!ref?.current) return;

	gsap.fromTo(
		ref.current.children,
		{ opacity: 0, y: 150, rotateZ: 0 },
		{
			opacity: 1,
			y: 0,
			duration: 1,
			rotateZ: 0,
			stagger: 0.25,
            ease: "power3.out",
			scrollTrigger: {
				trigger: ref.current,
				start: "top 95%",
				toggleActions: "play none none reset", // onEnter, onLeave, onEnterBack, and onLeaveBack,
				// markers: true,
			},
		}
	);
};

export const animateHoverImageEnter = (imageContainerRef, imageHolderRef, index) => {
	if (!imageContainerRef?.current || !imageHolderRef?.current) return;
	gsap.to(imageContainerRef.current, {
		scale: 1,
		duration: 0.5,
		ease: "expoScale(0.5,7, none)",
	});

	gsap.to(imageHolderRef.current, {
		y: index * -350,
		duration: 0.6,
		ease: "expoScale(0.5,7, none)",
	});
};

export const animateHoverImageLeave = (imageContainerRef) => {
	if (!imageContainerRef?.current) return;
	gsap.to(imageContainerRef.current, {
		scale: 0,
		duration: 0.5,
		ease: "expoScale(0.5,7, none)",
	});
};
