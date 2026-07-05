import React, { useLayoutEffect, useRef } from "react";
import CertificateLargeComponent from "@pages/About/components/AboutCertificate/CertificateLargeComponent";
import CertificateMobileComponent from "@pages/About/components/AboutCertificate/CertificateMobileComponent";
import certificates from "@constants/certificatesList.js";
import gsap from "gsap";
import HoveredImages from "@components/shared/HoveredImages/HoveredImages";
import PrimaryButton from "@components/ui/Buttons/PrimaryButton";
import { AppContext } from "@/App";
import { AnimateRef } from "@utils/animationUtils";

const Certificate = () => {
	const { handleButtonNavigation } = React.useContext(AppContext);
	const { entranceAnimationDone } = React.useContext(AppContext);

	const [certificates, setCertificates] = React.useState([]);

	React.useEffect(() => {
		const fetchCerts = async () => {
			try {
				const { getCertificates } = await import("@services/adminService");
				const data = await getCertificates();
				// Map description to desc to be compatible with existing components
				const mappedData = data.map(c => ({
					...c,
					desc: c.description,
					// resolve backend URL for uploaded images
					img: c.img?.startsWith("/static") ? `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}${c.img}` : c.img
				}));
				setCertificates(mappedData);
			} catch (e) {
				console.error("Failed to load certificates:", e);
			}
		};
		fetchCerts();
	}, []);

	const certTitle = useRef();
	const certDesc = useRef();
	const imageContainerRef = useRef();
	const imageHolderRef = useRef();
	const imageRefs = useRef([]);

	useLayoutEffect(() => {
		if (imageContainerRef.current) {
			gsap.set(imageContainerRef.current, { scale: 0 });
		}
	}, [entranceAnimationDone, certificates]);

	function handleHover(eventName, index) {
		if (eventName == "enter") {
			certTitle.current.textContent = certificates[index].name;
			certDesc.current.textContent = certificates[index].desc;
			gsap.to(imageContainerRef.current, {
				scale: 1,
				duration: 0.5,
				ease: "expoScale(0.5,7, none)",
			});

			gsap.to(imageHolderRef.current, {
				y: index * -350,
				duration: 0.6,
				ease: "expoScale(0.5,7, none)",
			});
		} else {
			gsap.fromTo(
				imageContainerRef.current,
				{
					scale: 1,
				},
				{ scale: 0, duration: 0.5, ease: "expoScale(0.5,7, none)" }
			);
		}
	}

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
					label={"MY WORK"}
					handleOnClick={() => handleButtonNavigation("/work")}
				/>
			</div>
		</>
	);
};

export default Certificate;
