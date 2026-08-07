import React, { useEffect, useRef, useContext } from "react";
import Logo from "@components/layout/Navbar/Logo";
import { AppContext } from "@/App";

const FloatingNavbar = ({ logoRef, isOpen, handleOpenNavbar, entranceAnimationDone }) => {
	const { handleButtonNavigation } = useContext(AppContext);
	const menuBtnRef = useRef(null);

	useEffect(() => {
		let lastScrollY = window.scrollY;
		let currentY = 0;
		let ticking = false;

		const updateDOM = () => {
			if (logoRef.current && menuBtnRef.current) {
				const opacity = 1 - (Math.abs(currentY) / 80);
				logoRef.current.style.transform = `translateY(${currentY}px)`;
				menuBtnRef.current.style.transform = `translateY(${currentY}px)`;
				
				if (!isOpen) {
					logoRef.current.style.opacity = opacity;
				}
				menuBtnRef.current.style.opacity = opacity;
			}
		};

		if (isOpen) {
			currentY = 0;
			updateDOM();
		}

		const handleScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(() => {
					const scrollY = window.scrollY;
					const dy = scrollY - lastScrollY;
					
					if (isOpen) {
						currentY = 0;
					} else {
						if (scrollY <= 0) {
							currentY = 0;
						} else {
							currentY = Math.max(-80, Math.min(0, currentY - dy));
						}
					}

					lastScrollY = scrollY;
					updateDOM();
					ticking = false;
				});
				ticking = true;
			}
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, [isOpen, logoRef]);

	return (
		<>
			<a
				onClick={() => handleButtonNavigation("/")}
				className={`fixed lg:hidden top-3.5 left-3 ${entranceAnimationDone ? "z-8" : ""} text-cursor mix-blend-difference`}
				ref={logoRef}
			>
				<Logo></Logo>
			</a>
			<a
				onClick={handleOpenNavbar}
				ref={menuBtnRef}
				className={`open-navbar-button text-cursor ${entranceAnimationDone ? "z-8" : ""} fixed lg:hidden top-3.5 right-3 hover:text-color-text-hovering text-xl font-bold mix-blend-difference`}
			>
				{isOpen ? "Close" : "Menu"}
			</a>
		</>
	);
};

export default FloatingNavbar;
