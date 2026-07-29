import { useContext, useRef } from "react";
import gsap from "gsap";
import { AppContext } from "@/App";
import { useNavigate } from "react-router";
import { useLenis } from "lenis/react";
import { textureCache } from "@pages/Museum/utils/TextureCache";
import { getGalleryMedia } from "@services/gallery";
import { resolveImg } from "@utils/imageUtils";

export const useHomeMuseumPortal = () => {
    const { navbarRef, preloaderRef } = useContext(AppContext);
    const lenis = useLenis();
    const navigate = useNavigate();
    const imageRef = useRef(null);

    const triggerHeavyPreload = async () => {
        try {
            // 1. Preload JS bundle
            import("@pages/Museum/Museum.jsx").catch(() => {});
            
            // 2. Fetch the museum data
            const data = await getGalleryMedia();
            
            // 3. Preload all textures into the browser cache
            const urls = data
                .filter(item => item.media_type === 'image')
                .map(item => resolveImg(item.url))
                .filter(Boolean);

            if (urls.length > 0) {
                textureCache.preloadAll(urls, () => {});
            }
        } catch (error) {
            console.error("Background preloading failed", error);
        }
    };

    const handleEnterMuseum = () => {
        if (!imageRef.current) return;
        
        // Start downloading models, textures, and API data instantly in the background!
        triggerHeavyPreload();

        if (lenis) {
            lenis.stop();
        }
        document.body.style.overflow = "hidden";
        document.body.setAttribute("data-lenis-prevent", "true");
        
        const imageElement = imageRef.current;

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

    const preloadMuseum = () => {
        // Preload the heavy 3D Javascript bundle in the background
        import("@pages/Museum/Museum.jsx").catch(() => {});
    };

    return {
        imageRef,
        handleEnterMuseum,
        preloadMuseum
    };
};
