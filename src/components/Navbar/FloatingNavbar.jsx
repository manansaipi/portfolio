import React from "react";
import Logo from "./Logo";

const FloatingNavbar = ({
	floatingNavbarRef,
	logoRef,
	isOpen,
	handleOpenNavbar,
}) => {
	return (
		<div
			ref={floatingNavbarRef}
			className="fixed lg:hidden w-full z-4 mix-blend-difference text-primary"
		>
			<div className="flex flex-row items-center justify-between  p-3.5    ">
				<div ref={logoRef}>
					<Logo></Logo>
				</div>
				<a
					onClick={handleOpenNavbar}
					className={` open-navbar-button hover:text-color-text-hovering  text-xl font-bold`}
				>
					{isOpen ? "Close" : "Menu"}
				</a>
			</div>
		</div>
	);
};

export default FloatingNavbar;
