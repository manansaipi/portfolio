import { useState, useEffect, useRef, useLayoutEffect, useContext } from "react";
import gsap from "gsap";
import { AppContext } from "@/App";
import { resolveImg } from "@utils/imageUtils";

export const useAboutCertificate = () => {
	const { entranceAnimationDone } = useContext(AppContext);
	const [certificates, setCertificates] = useState([]);

	const certTitle = useRef();
	const certDesc = useRef();
	const imageContainerRef = useRef();
	const imageHolderRef = useRef();
	const imageRefs = useRef([]);

	useEffect(() => {
		const fetchCerts = async () => {
			try {
				const { getCertificates } = await import("@services/adminService");
				const data = await getCertificates();
				// Map description to desc to be compatible with existing components
				const mappedData = data.map(c => ({
					...c,
					desc: c.description,
					img: resolveImg(c.img)
				}));
				setCertificates(mappedData);
			} catch (e) {
				console.error("Failed to load certificates:", e);
			}
		};
		fetchCerts();
	}, []);

	useLayoutEffect(() => {
		if (imageContainerRef.current) {
			gsap.set(imageContainerRef.current, { scale: 0 });
		}
	}, [entranceAnimationDone, certificates]);

	function handleHover(eventName, index) {
		if (eventName == "enter") {
			certTitle.current.textContent = certificates[index].name;
			certDesc.current.textContent = certificates[index].desc;
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
		certificates,
		certTitle,
		certDesc,
		imageContainerRef,
		imageHolderRef,
		imageRefs,
		handleHover
	};
};
