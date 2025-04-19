import React, { useEffect, useRef, useState } from "react";
import TogleTheme from "./TogleThemeButton";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const navbarRef = useRef(null);
	const aboutNavRef = useRef();

	const tl = gsap.timeline();

	const handleOpenNavbar = () => {
		setIsOpen(!isOpen);
	};

	useEffect(() => {
		if (isOpen) {
			navbarRef.current.style.display = "flex"; // make it visible
			gsap.fromTo(
				navbarRef.current,
				{ y: -500 },
				{
					y: 0,
					duration: 1,
					ease: "power4.out",
					onComplete: () => {
						navbarRef.current.style.zIndex = "2";
					},
				}
			);
		} else {
			gsap.to(navbarRef.current, {
				y: -500,
				duration: 1,
				ease: "power4.out",
				onComplete: () => {
					navbarRef.current.style.display = "none";
				},
			});
		}
	}, [isOpen]);

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
				<div className="p-5  w-1/2 hidden  md:flex md:flex-col">
					<a className=" font-bold text-background text-xl">
						Abdul Mannan Saip
					</a>
					<a className=" font-bold text-background text-xl">
						Portofolio
					</a>
				</div>
				<div className="flex flex-col  justify-center items-start bg-primary pl-5 pt-14 md:pt-5  ">
					<div className="flex flex-col gap-0 font-bold text-6xl text-background   ">
						<a
							ref={aboutNavRef}
							href="#Home"
							className="hover:text-color-text-hovering "
						>
							HOME
						</a>
						<a
							href="#About"
							className="hover:text-color-text-hovering"
						>
							ABOUT
						</a>
						<a className="hover:text-color-text-hovering">
							GALLERIES
						</a>
						<a className="hover:text-color-text-hovering">
							WRITING
						</a>
					</div>
					<div className="h-15"></div>
					<div className="flex gap-5 mb-10 font-bold text-background text-xl">
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
