import { useState, useEffect, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import Works from "@constants/works.js";
import { resolveImg } from "@utils/imageUtils";

export const useHomeRecentWork = () => {
	const imageContainerRef = useRef();
	const imageHolderRef = useRef();
	const imageRefs = useRef([]);
	const [recentWorks, setRecentWorks] = useState(Works); // Fallback to hardcoded initially

	useEffect(() => {
		const fetchWorks = async () => {
			try {
				const { getExperiences } = await import("@services/adminService");
				const data = await getExperiences();
				if (data && data.length > 0) {
					// Map backend fields to the frontend expected schema
					const mappedWorks = data.map(w => {
						return {
							id: w.id,
							company: w.company,
							role: w.position,
							startDate: w.start_date,
							endDate: w.end_date,
							desc: w.description,
							img: resolveImg(w.img),
							points: w.points ? JSON.parse(w.points) : [],
							iamges: w.images ? JSON.parse(w.images).map(img => resolveImg(img)) : [],
							bgColor: w.bg_color || "bg-neutral-800",
							url: w.url || ""
						};
					});
					setRecentWorks(mappedWorks);
				}
			} catch (e) {
				console.error("Failed to fetch works, using hardcoded fallback", e);
			}
		};
		fetchWorks();
	}, []);

	useLayoutEffect(() => {
		if (imageContainerRef.current) {
			gsap.set(imageContainerRef.current, { scale: 0 });
		}
	}, []);

	function handleHover(eventName, index) {
		if (eventName == "enter") {
			import("@utils/animationUtils").then(({ animateHoverImageEnter }) => {
				animateHoverImageEnter(imageContainerRef, imageHolderRef, index);
			});
		} else {
			import("@utils/animationUtils").then(({ animateHoverImageLeave }) => {
				animateHoverImageLeave(imageContainerRef);
			});
		}
	}

	return {
		recentWorks,
		imageContainerRef,
		imageHolderRef,
		imageRefs,
		handleHover
	};
};
