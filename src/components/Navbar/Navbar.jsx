import React, { useState, useEffect, useRef } from "react";
import TogleTheme from "./TogleThemeButton";
import gsap from "gsap";

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const navbarRef = useRef();

	const handleOpenNavbar = () => {
		setIsOpen((prev) => !prev);
	};

	// Animate navbar open/close
	useEffect(() => {
		if (isOpen) {
			gsap.fromTo(
				navbarRef.current,
				{ y: "-100%", opacity: 0 },
				{ y: "0%", opacity: 1, duration: 0.5, ease: "power3.out" }
			);
		} else {
			gsap.to(navbarRef.current, {
				y: "-100%",
				opacity: 0,
				duration: 0.5,
				ease: "power3.in",
			});
		}
	}, [isOpen]);

	return (
		<>
			{isOpen ? (
				<div
					ref={navbarRef}
					className="flex bg-primary w-full fixed top-0 left-0 z-50"
				>
					<a
						onClick={handleOpenNavbar}
						className="absolute top-3 right-3 bg-none text-background text-xl font-bold hover:text-color-text-hovering cursor-pointer"
					>
						Close
					</a>
					<div className="p-5 w-1/2 hidden md:flex md:flex-col">
						<a className="font-bold text-background text-xl">
							Abdul Mannan Saip
						</a>
						<a className="font-bold text-background text-xl">
							Portofolio
						</a>
					</div>
					<div className="flex flex-col justify-center items-start bg-primary pt-10 md:pt-5">
						<div className="flex flex-col font-bold text-6xl text-background">
							<a href="#Home" className="hover:text-color-text-hovering">
								HOME
							</a>
							<a href="#About" className="hover:text-color-text-hovering">
								ABOUT
							</a>
							<a className="hover:text-color-text-hovering">GALLERIES</a>
							<a className="hover:text-color-text-hovering">WRITING</a>
						</div>
						<div className="h-15"></div>
						<div className="flex gap-5 mb-10 font-bold text-background text-xl">
							<a className="hover:text-color-text-hovering">Instagram</a>
							<a className="hover:text-color-text-hovering">Threads</a>
							<a className="hover:text-color-text-hovering">X (Twitter)</a>
						</div>
					</div>
				</div>
			) : (
				<div className="fixed flex justify-between text-white bg-transparent w-full px-4 pt-1 z-50">
					<a className="hover:text-zinc-400 p-3 text-primary text-xl font-bold">
						<a className="font-luckiestguy tracking-widest italic text-2xl">
							AMS°
						</a>
						&nbsp;&nbsp; Portofolio
					</a>

					<a
						onClick={handleOpenNavbar}
						className="absolute top-3 right-3 hover:text-zinc-400 text-primary text-xl font-bold cursor-pointer"
					>
						Menu
					</a>
				</div>
			)}
		</>
	);
};

export default Navbar;
