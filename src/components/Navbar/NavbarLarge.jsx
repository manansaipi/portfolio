import React from "react";
import Logo from "./Logo";

const NavbarLarge = ({ logoRef, navbarLargeRef }) => {
	return (
		<div>
			<div id="Home" className="bg-light-dark">
				<div className=" flex text-color-text-hovering h-[20vh]  items-center px-40 xl:px-60  ">
					{/* if sm-md screen size, the position is flex */}
					<div className="w-full flex flex-col">
						<a
							className={`hidden hover:text-primary  lg:block top-3.5 left-5  mix-blend-difference z-4 `}
						>
							Abdul Mannan Saipi
							{/* <Logo></Logo> */}
						</a>
					</div>
					<div
						ref={navbarLargeRef}
						className="hidden lg:flex gap-10 justify-end w-screen  overflow-hidden  "
					>
						<a
							href="#Home"
							className="hover:text-primary text-primary  cursor-none"
						>
							Home
						</a>
						<a href="#About" className="hover:text-primary  cursor-none">
							About
						</a>
						<a className="">Experience</a>
						<a href="#Contact" className="hover:text-primary  cursor-none">
							Contact
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NavbarLarge;
