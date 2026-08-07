import React, { useState, useEffect, useContext } from "react";
import Logo from "@components/layout/Navbar/Logo";
import { AppContext } from "@/App";

const FloatingNavbar = ({ logoRef, isOpen, handleOpenNavbar, entranceAnimationDone}) => {
	const { handleButtonNavigation } = useContext(AppContext);
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		let lastScrollY = window.scrollY;
		let ticking = false;

		const handleScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(() => {
					const currentScrollY = window.scrollY;
					
					if (currentScrollY > lastScrollY && currentScrollY > 50) {
						setIsVisible(false);
					} else if (currentScrollY < lastScrollY || currentScrollY <= 50) {
						setIsVisible(true);
					}
					
					lastScrollY = currentScrollY;
					ticking = false;
				});
				ticking = true;
			}
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Always show if the navbar is open
	const showNavbar = isVisible || isOpen;
	const transformClass = showNavbar ? "translate-y-0" : "-translate-y-24";

	return (
		<>
			<a
				onClick={() => handleButtonNavigation("/")}
				className={`fixed lg:hidden top-3.5 left-3 ${entranceAnimationDone ? "z-8" : ""} text-cursor mix-blend-difference transition-transform duration-300 ease-in-out ${transformClass}`}
				ref={logoRef}
			>
				<Logo></Logo>
			</a>
			<a
				onClick={handleOpenNavbar}
				className={`open-navbar-button text-cursor ${entranceAnimationDone ? "z-8" : ""} fixed lg:hidden top-3.5 right-3 hover:text-color-text-hovering text-xl font-bold mix-blend-difference transition-transform duration-300 ease-in-out ${transformClass}`}
			>
				{isOpen ? "Close" : "Menu"}
			</a>
		</>
	);
};

export default FloatingNavbar;
