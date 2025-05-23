import { useLayoutEffect, useRef } from "react";
import CertificateLargeComponent from "./CertificateLargeComponent";
import CertificateMobileComponent from "./CertificateMobileComponent";
import certificates from "./CertificatesList";
import gsap from "gsap";
import HoveredImages from "../../../components/HoveredImages/HoveredImages";
const Certificate = () => {
	const certTitle = useRef();
	const certDesc = useRef();

	const imageContainerRef = useRef();
	const imageHolderRef = useRef();

	useLayoutEffect(() => {
		if (imageContainerRef.current) {
			gsap.set(imageContainerRef.current, { scale: 0 });
		}
	}, []);

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
			/>
		</>
	);
};

export default Certificate;
