import gsap from "gsap";

export const AnimatePageTransition = ({
    preloaderRef,
    navbarRef,
    lenis,
    href,
    navigate,
}) => {
    lenis.scrollTo(navbarRef.current, { duration: 1 });
    if (preloaderRef.current) {
        const tl = gsap.timeline();

        tl.to(preloaderRef.current, {
            opacity: 1,
            duration: 1,
            onComplete: () => {
                navigate(href);
            },
        }).to(preloaderRef.current, {
            opacity: 0,
            duration: 1,
            delay: 0.1,
        });
    }
};
