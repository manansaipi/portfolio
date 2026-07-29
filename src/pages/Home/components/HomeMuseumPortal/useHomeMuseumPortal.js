import { useContext, useRef } from "react";
import gsap from "gsap";
import { AppContext } from "@/App";
import { useNavigate } from "react-router";
import { useLenis } from "lenis/react";

export const useHomeMuseumPortal = () => {
    const { navbarRef, preloaderRef } = useContext(AppContext);
    const lenis = useLenis();
    const navigate = useNavigate();
    const imageRef = useRef(null);

    const handleEnterMuseum = () => {
        if (!imageRef.current) return;
        
        const imageElement = imageRef.current;
        document.body.style.overflow = "hidden";
        document.body.setAttribute("data-lenis-prevent", "true");

        const rect = imageElement.getBoundingClientRect();

        // Clone the image for the animation
        const clone = imageElement.cloneNode(true);
        // Force the clone to use the currently displayed image (from <picture> or srcset)
        clone.src = imageElement.currentSrc || imageElement.src;
        clone.removeAttribute('srcset');
        clone.removeAttribute('sizes');
        document.body.appendChild(clone);

        // Set initial fixed position exactly over the original image
        Object.assign(clone.style, {
            position: "fixed",
            top: `${rect.top}px`,
            left: `${rect.left}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            margin: 0,
            pointerEvents: "none",
            objectFit: "cover",
            zIndex: 9999,
        });

        // Hide the original image
        gsap.set(imageElement, {opacity: 0});

        // Animate the clone to cover 100% of the screen
        gsap.to(clone, {
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            duration: 1.5,
            ease: "power3.out",
            onStart: () => {
                if(preloaderRef) {
                    gsap.to(preloaderRef.current, {
                        opacity: 1,
                        duration: 0.8,
                        onComplete: () => {
                            if (lenis) {
                                lenis.start();
                                lenis.scrollTo(navbarRef.current, { duration: 0 });
                            }
                        },
                    });
                }
            },
            onComplete: () => {
                navigate("/museum");

                // Restore original image opacity in case they navigate back
                gsap.set(imageElement, {opacity: 1});

                gsap.to(preloaderRef.current, {
                    opacity: 0,
                    duration: 1,
                    delay: 0.5,
                    onStart: () => {
                        document.body.style.position = "fixed";
                    }
                });
                
                setTimeout(() => {
                    clone.remove();
                    document.body.style.overflow = "";
                    document.body.style.position = "";
                    document.body.removeAttribute("data-lenis-prevent");
                }, 1500);
            },
        });
    };

    return {
        imageRef,
        handleEnterMuseum
    };
};
