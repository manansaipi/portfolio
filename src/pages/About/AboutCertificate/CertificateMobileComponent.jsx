import { useRef, useState, useEffect } from "react";
import certificates from "./CertificatesList";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import gsap from "gsap";

const CertificateMobileComponent = () => {
	const [visibleCount, setVisibleCount] = useState(2);
	const cardsContainer = useRef();
	const prevVisibleCount = useRef(2);

	function handleLoadMore() {
		if (visibleCount >= certificates.length) {
			setVisibleCount(2); // Reset to 2 when "SHOW LESS" is clicked
		} else {
			const newCount = visibleCount + 2;
			setVisibleCount(
				newCount > certificates.length ? certificates.length : newCount
			);
		}
	}

	useEffect(() => {
		const containerChildren = cardsContainer.current?.children;
		if (!containerChildren) return;

		// Animate only the newly shown cards
		const newItems = Array.from(containerChildren).slice(
			prevVisibleCount.current
		);

		gsap.fromTo(
			newItems,
			{ opacity: 0, y: 30 },
			{
				opacity: 1,
				y: 0,
				duration: 0.6,
				stagger: 0.15,
				ease: "power2.out",
			}
		);

		// Update previous count
		prevVisibleCount.current = visibleCount;
	}, [visibleCount]);

	return (
		<>
			<div
				ref={cardsContainer}
				className="grid grid-cols-1 md:grid-cols-2 w-full  lg:hidden gap-10 px-5 md:px-10"
			>
				{certificates.slice(0, visibleCount).map((cert, index) => (
					<a
						key={index}
						href={cert.link}
						target="_blank"
						data-name="view"
						className="flex flex-col  gap-5 text-white h-full md:cursor-none "
					>
						<div className={`h-[50vh] bg-gray-600 pointer-events-none `}>
							<div className="px-5 w-full h-full flex items-center justify-center">
								<img
									className="max-h-[45vh] shadow-lg shadow-black "
									src={cert.image}
									alt=""
								/>
							</div>
						</div>
						<div className="pointer-events-none">
							<div className="text-3xl">{cert.name} </div>
							<div className=" border-b-1 my-5"></div>
							<div className="flex justify-between gap-15">
								<div className="text-justify">{cert.desc}</div>
								<div>{cert.year}</div>
							</div>
						</div>
					</a>
				))}
			</div>
			<div className="flex justify-center py-10 lg:hidden">
				<PrimaryButton
					label={
						visibleCount >= certificates.length ? "SHOW LESS" : "SHOW MORE"
					}
					handleOnClick={handleLoadMore}
				/>
			</div>
		</>
	);
};

export default CertificateMobileComponent;
