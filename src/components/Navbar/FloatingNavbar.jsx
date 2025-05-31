import React from "react";
import Logo from "./Logo";
import { AppContext } from "../../App";

const FloatingNavbar = ({ logoRef, isOpen, handleOpenNavbar, entranceAnimationDone}) => {
	return (
		<>
			<div
				className={`fixed lg:hidden top-3.5 left-3 ${entranceAnimationDone? "z-8" : ""} text-cursor mix-blend-difference`}
				ref={logoRef}
			>
				<Logo></Logo>
			</div>
			<a
				onClick={handleOpenNavbar}
				className={` open-navbar-button text-cursor ${entranceAnimationDone? "z-8" : ""} fixed lg:hidden top-3.5 right-3 hover:text-color-text-hovering  text-xl font-bold  mix-blend-difference`}
			>
				{isOpen ? "Close" : "Menu"}
			</a>
		</>
	);
};

export default FloatingNavbar;
