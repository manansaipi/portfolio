import gsap from "gsap";

export const AnimatePageTransition = ({
	preloaderRef,
	navbarRef,
	lenis,
	href,
	navigate,
}) => {
	document.body.style.overflow = "hidden";
	document.body.setAttribute("data-lenis-prevent", "true");

	lenis.scrollTo(navbarRef.current, { duration: 1 });

	if (preloaderRef.current) {
		const tl = gsap.timeline();
		tl.to(preloaderRef.current, {
			opacity: 1,
			duration: 0.8,
			onComplete: () => {
				navigate(href);
			},
		}).to(preloaderRef.current, {
			opacity: 0,
			duration: 1,
			delay: 1.5, // -> 1.5
			onComplete: () => (document.body.style.overflow = ""),
		});
	}
};
// TODO : ANIMATE HEADER IN PAGE TRANSITION USING GLOBAL STATE 
export const AnimateHeader = ({ headerContainerRef }) => {
	if (!headerContainerRef?.current) return; // add safety check

	gsap.fromTo(
		headerContainerRef.current.children,
		{ opacity: 0, y: 100, rotateZ: 0 },
		{
			opacity: 1,
			y: 0,
			duration: 1,
			rotateZ: 0,
			stagger: 0.25,
			onStart: () => {
				if (headerContainerRef.current) {
					headerContainerRef.current.classList.add("z-7");
				}
			},
			onComplete: () => {
				if (headerContainerRef.current) {
					setTimeout(() => {
						headerContainerRef.current.classList.remove("z-7");
					}, 2000);
				}
			},
		}
	);
};
