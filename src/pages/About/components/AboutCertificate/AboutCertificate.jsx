import React from "react";
import CertificateLargeComponent from "@pages/About/components/AboutCertificate/CertificateLargeComponent";
import CertificateMobileComponent from "@pages/About/components/AboutCertificate/CertificateMobileComponent";
import HoveredImages from "@components/shared/HoveredImages/HoveredImages";
import PrimaryButton from "@components/ui/Buttons/PrimaryButton";
import { AppContext } from "@/App";
import { AnimateRef } from "@utils/animationUtils";
import { resolveImg } from "@utils/imageUtils";
import { useAboutCertificate } from "./useAboutCertificate";

const Certificate = () => {
	const { handleButtonNavigation } = React.useContext(AppContext);

	const {
		certificates,
		certTitle,
		certDesc,
		imageContainerRef,
		imageHolderRef,
		imageRefs,
		handleHover
	} = useAboutCertificate();

	return (
		<>
			<CertificateMobileComponent certificates={certificates} />
			<CertificateLargeComponent
				certificates={certificates}
				handleHover={handleHover}
				certTitle={certTitle}
				certDesc={certDesc}
			/>
			<HoveredImages
				imageHolderRef={imageHolderRef}
				imageContainerRef={imageContainerRef}
				datas={certificates}
				imageRefs={imageRefs}
			/>

			<div className="flex justify-center py-20">
				<PrimaryButton
					label={"MY PROJECTS"}
					handleOnClick={() => handleButtonNavigation("/projects")}
				/>
			</div>
		</>
	);
};

export default Certificate;
