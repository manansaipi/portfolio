
import gsap from "gsap";

// Helper function to create a URL-friendly slug from a string
const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^\w-]+/g, "") // Remove all non-word chars
        .replace(/--+/g, "-"); // Replace multiple - with single -
};

function handleImageNavigation(path, imageElement, navbarRef, preloaderRef, lenis, navigate) {
    document.body.style.overflow = "hidden"; // standard no-scroll implementation
    document.body.setAttribute("data-lenis-prevent", "true");

    const rect = imageElement.getBoundingClientRect();

    // Clone the image
    const clone = imageElement.cloneNode(true);
    document.body.appendChild(clone);
    // if(lenis) lenis.stop(); // Stop Lenis scrolling during animation

    // Set initial fixed position based on current position
    Object.assign(clone.style, {
        position: "fixed",
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        margin: 0,
        pointerEvents: "none", // prevent accidental interaction
    });

    // set the image element's opacity to 0 to hide it while animation
    gsap.set(imageElement, {opacity: 0})

    // Animate to top center
    gsap.to(clone, {
        top: 0,
        left: 0,
        width: "100vw",
        height: "70vh",
        duration: 1.5,
        ease: "power3.out",
        onStart: () => {
            // imageElement.classList.add("opacity-0");
            clone.classList.add("z-7");
            if(preloaderRef) {
                gsap.to(preloaderRef.current, {
                    opacity: 1,
                    duration: 0.8,
                    onComplete: () => {
                        lenis.start();
                        lenis.scrollTo(navbarRef.current, {
                            duration: 0,
                        });
                    },
                });
            }
        },
        onComplete: () => {
            navigate(path);

            // set the image element's opacity back to 100
            gsap.set(imageElement, {opacity: 1})

            gsap.to(preloaderRef.current, {
                opacity: 0,
                duration: 1,
                delay: 0.5,
                onStart: () => {
                    document.body.style.position = "fixed"; // standard no-scroll implementation
                }
            });
            setTimeout(() => {
                clone.remove();
                document.body.style.overflow = ""; // standard no-scroll implementation
                document.body.style.position = ""; // standard no-scroll implementation
            }, 1500);
        },
    });
}

export { slugify, handleImageNavigation };
