import React, { useEffect, useState, useRef, useLayoutEffect } from "react";

import gsap from "gsap";

import Works from "@constants/works.js";
import PrimaryButton from "@components/ui/Buttons/PrimaryButton";
import ListRecentWorkMobile from "@pages/Home/components/HomeRecentWork/ListRecentWorkMobile";
import ListRecentWorkLarge from "@pages/Home/components/HomeRecentWork/ListRecentWorkLarge";
import HoveredImages from "@components/shared/HoveredImages/HoveredImages";
import { AppContext } from "@/App";
const HomeRecentWork = ({}) => {
	const { handleButtonNavigation } = React.useContext(AppContext);

	const [hoveredIndex, setHoveredIndex] = useState(0);

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
					const backendUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
					const mappedWorks = data.map(w => {
						const imgUrl = w.img ? (w.img.startsWith("/static") ? `${backendUrl}${w.img}` : w.img) : "";
						return {
							id: w.id,
							company: w.company,
							role: w.position,
							startDate: w.start_date,
							endDate: w.end_date,
							desc: w.description,
							img: imgUrl,
							points: w.points ? JSON.parse(w.points) : [],
							iamges: w.images ? JSON.parse(w.images).map(img => img.startsWith("/static") ? `${backendUrl}${img}` : img) : [],
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
			setHoveredIndex(index);
			// animate zoom in
			gsap.to(imageContainerRef.current, {
				scale: 1,
				duration: 0.5,
				ease: "expoScale(0.5,7, none)",
			});

			// animate scroll the image
			gsap.to(imageHolderRef.current, {
				y: index * -350,
				duration: 0.7,
				ease: "expoScale(0.5,7, none)",
			});

		} else {
			// animate zoom out
			gsap.to(imageContainerRef.current, {
				scale: 0,
				duration: 0.5,
				ease: "expoScale(0.5,7, none)",
			});
		}
	}

	return (
		<div className="  bg-light-dark px-5 md:px-10 lg:px-25 xl:px-30 ">
			{/* mobile-medium size */}
			<ListRecentWorkMobile works={recentWorks} />

			{/* large size */}
			<ListRecentWorkLarge
				works={recentWorks}
				handleHover={handleHover}
				imageRefs={imageRefs}
			/>
			{/* 
            <div className="flex justify-center text-primary py-15">
                <PrimaryButton
                    handleOnClick={() => handleButtonNavigation("/work")}
                    label={"WORK"}
                />
            </div> */}

			{/* hovered image */}
			<HoveredImages
				datas={recentWorks}
				imageHolderRef={imageHolderRef}
				imageContainerRef={imageContainerRef}
				imageRefs={imageRefs}
			/>
		</div>
	);
};

export default HomeRecentWork;
