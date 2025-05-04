import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useSeprateAnimation = (sectionRef) => {
	if (!sectionRef.current) return;

	const ctx = gsap.context(() => {
		gsap.to(sectionRef.current, {
			scrollTrigger: {
				trigger: sectionRef.current,
				start: "center center",
				end: "+=100%",
				scrub: true,
				pin: true,
				markers: true, // Remove after debugging
			},
		});
	});
	return () => ctx.revert(); // Cleanup GSAP context when
};
