import React, { useEffect, useRef, useState } from "react";
import TogleTheme from "./TogleThemeButton";

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
gsap.registerEase(CustomEase);

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const navbarRef = useRef();
	const navigationListRef = useRef();
	const socialMediaRef = useRef();
	const leftTextNavbarOpenRef = useRef();

	const logo = useRef();

	const tl = gsap.timeline();

	const handleOpenNavbar = () => {
		setIsOpen(!isOpen);

		if (!isOpen) {
			// open navbar
			navbarRef.current.style.display = "flex";
			gsap.fromTo(
				navbarRef.current,
				{ y: -500 },
				{
					y: 0,
					duration: 1,
					ease: "power4.out",
				}
			);

			// animate navList
			gsap.set(navigationListRef.current.children, { y: 100 });
			gsap.to(navigationListRef.current.children, {
				y: 0,
				duration: 0.5,
				stagger: 0.075,
			});
			// animate left text opened navbar
			gsap.set(leftTextNavbarOpenRef.current.children, { y: 100 });
			gsap.to(leftTextNavbarOpenRef.current.children, {
				y: 0,
				duration: 0.75,
				stagger: 0.075,
			});

			// animate social media
			gsap.set(socialMediaRef.current.children, { y: 50 });
			gsap.to(socialMediaRef.current.children, {
				y: 0,
				duration: 0.5,
				stagger: 0.075,
				delay: 0.3,
			});

			// hiding logo
			gsap.fromTo(
				logo.current,
				{
					opacity: 1,
				},
				{
					opacity: 0,
					duration: 0.3,
					ease: "power1.in",
				}
			);
		} else {
			// close navbar
			gsap.to(navbarRef.current, {
				y: -500,
				duration: 1.2,
				ease: CustomEase.create(
					"custom",
					"M0,0 C0.11,0.494 0.3,0.6 0.33,0.6 0.35,0.6 0.37,0.6 0.38,0.6 0.39,0.6 0.41,0.6 0.43,0.6 0.45,0.6 0.47,0.6 0.49,0.6 0.51,0.6 0.55,0.6 0.58,0.65 0.6 ,0.7 0.65,0.75 0.7,0.85 0.9,0.9 0.9,1 1,1 "
				),
				onComplete: () => {
					// hide the navbar if the navbar completely closed
					if (
						navbarRef.current.style.display ==
						"translate(0px, -500px)"
					) {
						navbarRef.current.style.display = "none";
					}
				},
			});
			gsap.to(logo.current, {
				opacity: 1,
				duration: 0.3,
			});
		}
	};

	return (
		<>
			<a
				onClick={handleOpenNavbar}
				className={`fixed top-3.5 right-3.5  hover:text-zinc-400  text-primary mix-blend-difference text-xl font-bold z-10 `}
			>
				{isOpen ? "Close" : "Menu"}
			</a>
			<div
				ref={navbarRef}
				className={`flex bg-primary w-full fixed  `}
				style={{ display: "none" }}
			>
				<div
					ref={leftTextNavbarOpenRef}
					className="p-5 h-[5rem]  w-1/2 hidden  md:flex md:flex-col overflow-hidden "
				>
					<a className=" font-bold text-background text-xl">
						Abdul Mannan Saip
					</a>
					<a className=" font-bold text-background text-xl">
						Portofolio
					</a>
				</div>
				<div className=" flex flex-col  justify-center items-start bg-primary pl-5 pt-14 mb-8  md:pt-5 md:pl-3  ">
					<div
						ref={navigationListRef}
						className="flex flex-col gap-0 font-bold text-6xl text-background overflow-hidden mb-7 md:mb-8 "
					>
						<a
							href="#Home"
							className="hover:text-color-text-hovering -mb-2 "
						>
							HOME
						</a>
						<a
							href="#About"
							className="hover:text-color-text-hovering -mb-2 "
						>
							ABOUT
						</a>
						<a className="hover:text-color-text-hovering -mb-2 ">
							EXPERIENCE
						</a>
						<a className="hover:text-color-text-hovering -mb-2 ">
							CONTACT
						</a>
					</div>
					<div className="h-15"></div>
					<div
						ref={socialMediaRef}
						className="flex gap-5 font-bold text-background text-xl  overflow-hidden"
					>
						<a className="hover:text-color-text-hovering">
							Instagram
						</a>
						<a className="hover:text-color-text-hovering">
							Threads
						</a>
						<a className="hover:text-color-text-hovering">
							X (Twitter)
						</a>
					</div>
				</div>
			</div>

			<div
				ref={logo}
				className={`fixed top-3.5 left-5 text-primary bg-transparent mix-blend-difference `}
			>
				<a className=" font-luckiestguy tracking-widest italic text-2xl">
					AMS°
				</a>
				<a className=" hover:text-zinc-400 p-3 text-xl font-bold">
					Portofolio
				</a>
				{/* <a className="p-3">
					<TogleTheme />
				</a> */}
			</div>
		</>
	);
};

export default Navbar;
