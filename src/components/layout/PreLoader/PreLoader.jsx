import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useLocation } from "react-router";
import { useLenis } from "lenis/react";

const PreLoader = ({
	setEntranceAnimationDone,
	preloaderRef,
	preloaderTextRef,
}) => {
	const location = useLocation();
	const lenis = useLenis();
    const lenisRef = useRef(lenis);
    const isPreloadingRef = useRef(true);

    useEffect(() => {
        lenisRef.current = lenis;
        if (lenis && isPreloadingRef.current) {
            lenis.scrollTo(0, {immediate: true});
            lenis.stop();
            window.scrollTo(0, 0);
        }
    }, [lenis]);

	useEffect(() => {
		document.body.style.overflow = "hidden";
        document.body.removeAttribute("data-lenis-prevent");

		const tl = gsap.timeline({
			onComplete: () => {
                isPreloadingRef.current = false;
				setEntranceAnimationDone(true); // Show the rest of the components
				document.body.style.overflow = "";
				if (lenisRef.current) lenisRef.current.start();
			},
		});

		if (location.pathname === "/") {
			tl.to(preloaderRef.current, {
				opacity: 0,
				duration: 1.5,
				delay: import.meta.env.DEV ? 7 : 7, //-> 7
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
			className="section fixed bg-background w-full z-6 scroll-d even pointer-events-none text-primary flex justify-center items-center overflow-hidden"
		>
			<div className="text-4xl overflow-hidden">
				<div ref={preloaderTextRef}>{/* Experience */}</div>
			</div>
		</div>
	);
};

export default PreLoader;
