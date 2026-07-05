import React from "react";
import ListRecentWorkMobile from "@pages/Home/components/HomeRecentWork/ListRecentWorkMobile";
import ListRecentWorkLarge from "@pages/Home/components/HomeRecentWork/ListRecentWorkLarge";
import HoveredImages from "@components/shared/HoveredImages/HoveredImages";
import { useHomeRecentWork } from "./useHomeRecentWork";

const HomeRecentWork = ({}) => {
	const {
		recentWorks,
		imageContainerRef,
		imageHolderRef,
		imageRefs,
		handleHover
	} = useHomeRecentWork();

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
