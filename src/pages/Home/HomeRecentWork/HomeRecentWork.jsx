import React, { useEffect, useState, useRef, useLayoutEffect } from "react";

import gsap from "gsap";

import Works from "./Works";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import ListRecentWorkMobile from "./ListRecentWorkMobile";
import ListRecentWorkLarge from "./ListRecentWorkLarge";
import HoveredImages from "../../../components/HoveredImages/HoveredImages";
import { AppContext } from "../../../App";
const HomeRecentWork = ({}) => {
	const { handleButtonNavigation } = React.useContext(AppContext);

	const [hoveredIndex, setHoveredIndex] = useState(0);

	const imageContainerRef = useRef();
	const imageHolderRef = useRef();
	const imageRefs = useRef([]);

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
			<ListRecentWorkMobile works={Works} />

			{/* large size */}
			<ListRecentWorkLarge
				works={Works}
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
				datas={Works}
				imageHolderRef={imageHolderRef}
				imageContainerRef={imageContainerRef}
				imageRefs={imageRefs}
			/>
		</div>
	);
};

export default HomeRecentWork;
