import gsap from "gsap";

export const AnimatePageTransition = ({ preloaderRef, href, navigate }) => {
    window.scrollTo({ top: 0 });
    window.scrollTo({ top: 0 });

    if (preloaderRef.current) {
        const tl = gsap.timeline();
        window.scrollTo({ top: 0 });

        tl.to(preloaderRef.current, {
            opacity: 1,
            duration: 1,
            onStart: () => {
                setTimeout(() => {
                    window.scrollTo({ top: 0 });
                }, 10); // Delay to let DOM update
            },
            onComplete: () => {
                navigate(href);
                setTimeout(() => {
                    window.scrollTo({ top: 0 });
                }, 10); // Delay to let DOM update
            },
        }).to(preloaderRef.current, {
            opacity: 0,
            duration: 1,
        });
    }
};
