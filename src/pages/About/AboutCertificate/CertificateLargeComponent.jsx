import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CertificateLargeComponent = ({
	certificates,
	certTitle,
	certDesc,
	handleHover,	
}) => {
	const certDescContainerRef = useRef();
	const certListRef = useRef();

	useLayoutEffect(() => {
		let ctx = gsap.context(() => {
			ScrollTrigger.create({
				trigger: certDescContainerRef.current,
				start: "top center",
				endTrigger: certListRef.current,
				end: "bottom center",
				pin: true,
				pinSpacing: false,
				onLeaveBack: () => {
					if (certTitle.current && certDesc.current) {
						certTitle.current.textContent = defaultTitle;
						certDesc.current.textContent = defaultDesc;
					}
				},
			});

			const children = certListRef.current.children;
			gsap.set(children, { color: "#6a6a6a" });

			// Set default text once when mounted
			const defaultTitle = "Certifications & Achievements:";
			const defaultDesc =
				"I’ve turned a collection of online lessons into a foundation of real-world capability.";

			[...children].forEach((child, index) => {
				gsap.to(child, {
					color: "#ffffff",
					duration: 0.00001,
					scrollTrigger: {
						trigger: child,
						start: "top center",
						end: "bottom center",
						toggleActions: "play reset play reset",
						// markers: true,
					},
					onStart: () => {
						certTitle.current.textContent = certificates[index].name;
						certDesc.current.textContent = certificates[index].desc;
					},
				});
			});
		});
		return () => ctx.revert();
	}, []);

	useEffect(() => {
		let mouseX = 0;
		let mouseY = 0;
		let lastElement = null;

		// Track mouse position
		const handleMouseMove = (e) => {
			mouseX = e.clientX;
			mouseY = e.clientY;
		};

		// On scroll, detect the element under cursor
		const handleScroll = () => {
			const currentElement = document.elementFromPoint(mouseX, mouseY);
			if (!currentElement) return;

			// Check if the hovered element is one of the certificate items
			const isCertItem = currentElement.closest("[data-name='view']");

			// Prevent repeated triggers for the same element
			if (isCertItem && isCertItem !== lastElement) {
				lastElement = isCertItem;

				// Find index based on text content
				const index = certificates.findIndex((cert) =>
					isCertItem.textContent.includes(cert.name)
				);

				if (index !== -1) {
					handleHover("enter", index);
				}
			}

			// If no cert is under the cursor, consider it a hover out
			if (!isCertItem && lastElement) {
				lastElement = null;
				handleHover("out");
			}
		};

		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("scroll", handleScroll);
		};
	}, [certificates, handleHover]);

	return (
		<div className="hidden lg:flex lg:flex-row text-primary h-full mx-10 xl:mx-20 2xl:mx-30 ">
			<div className="w-[50vw] xl:w-[100vh] mt-10 overflow-hidden ">
				<div ref={certDescContainerRef} className=" text-xl xl:text-2xl ">
					<span ref={certTitle} className="text-primary">
						Certifications & Achievements:
					</span>
					<span className=" text-primary">. </span>
					<span ref={certDesc} className="text-color-text-hovering">
						I’ve turned a collection of online lessons into a foundation of
						real-world capability.
					</span>
				</div>
			</div>

			<div className="flex flex-col px-10">
				<span className="text-4xl xl:text-5xl font-extrabold text-primary ">
					MY CERTIFICATES
				</span>
				<div
					onMouseLeave={() => {
						handleHover("out");
					}}
					ref={certListRef}
					className="flex flex-col "
				>
					{certificates.map((cert, index) => (
						<a
							href={cert.link}
							target="_blank"
							data-name="view"
							key={index}
							className="flex gap-5 py-2 cursor-none group"
							onMouseEnter={() => {
								handleHover("enter", index);
							}}
						>
							<span
								data-name="view"
								className="text-md xl:text-lg group-hover:text-primary"
							>
								{cert.year}
							</span>
							<span
								data-name="view"
								className="text-2xl xl:text-3xl font-bold group-hover:text-primary -mt-2"
							>
								{cert.name}
							</span>
						</a>
					))}
				</div>
			</div>
		</div>
	);
};

export default CertificateLargeComponent;
