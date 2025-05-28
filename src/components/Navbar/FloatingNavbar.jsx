import React from "react";
import Logo from "./Logo";

const FloatingNavbar = ({ logoRef, isOpen, handleOpenNavbar }) => {
	return (
		<>
			<div
				className="fixed lg:hidden top-3.5 left-3 z-4 text-cursor mix-blend-difference"
				ref={logoRef}
			>
				<Logo></Logo>
			</div>
			<a
				onClick={handleOpenNavbar}
				className={` open-navbar-button text-cursor fixed lg:hidden top-3.5 right-3 hover:text-color-text-hovering  text-xl font-bold z-4 mix-blend-difference`}
			>
				{isOpen ? "Close" : "Menu"}
			</a>
		</>
	);
};

export default FloatingNavbar;
