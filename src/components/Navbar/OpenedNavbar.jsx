import React from "react";
import { useLocation } from "react-router";
import { AppContext } from "../../App";

const OpenedNavbar = ({
	navbarRef,
	leftTextNavbarOpenRef,
	navigationListRef,
	socialMediaRef,
	handleOpenNavbar,
}) => {
	const location = useLocation();
	const pathname = location.pathname;
	const { handleButtonNavigation } = React.useContext(AppContext);

	// Add "text-primary" if the current route matches
	const getLinkClass = (path) =>	
		`${
            pathname.toLowerCase().startsWith(path.toLowerCase())
				? "text-color-text-hovering"
				: "text-background"
		} hover:text-color-text-hovering -mb-2 cursor-none`;

	return (
		<div>
			<div
				ref={navbarRef}
				className={`flex bg-primary w-full fixed  z-3`}
				style={{ display: "none" }}
			>
				<div
					ref={leftTextNavbarOpenRef}
					className="p-5 h-[5rem]  w-1/2 hidden  md:flex md:flex-col overflow-hidden "
				>
					<div
						onClick={handleOpenNavbar}
						className="font-bold text-background text-xl"
					>
						<a onClick={() => handleButtonNavigation("/")}>
							Abdul Mannan Saip
						</a>
					</div>
					<div className=" font-bold text-background text-xl ">Portfolio</div>
				</div>
				<div className=" flex flex-col  justify-center items-start bg-primary pl-5 pt-14 mb-8  md:pt-5 md:pl-3  ">
					<div
						ref={navigationListRef}
						className="flex flex-col gap-0 font-bold text-6xl text-background overflow-hidden mb-7 md:mb-8 "
					>
						<div className={getLinkClass("/about")} onClick={handleOpenNavbar}>
							<a onClick={() => handleButtonNavigation("/about")}>ABOUT</a>
						</div>

						<div className={getLinkClass("/work")} onClick={handleOpenNavbar}>
							<a onClick={() => handleButtonNavigation("/work")}>WORK</a>
						</div>
						<div className={getLinkClass("/blog")} onClick={handleOpenNavbar}>
							<a onClick={() => handleButtonNavigation("/blog")}>WRITING</a>
						</div>

						<div
							className={getLinkClass("/contact")}
							onClick={handleOpenNavbar}
						>
							<a onClick={() => handleButtonNavigation("/contact")}>CONTACT</a>
						</div>
					</div>
					<div className="h-15"></div>
					<div
						ref={socialMediaRef}
						className="flex gap-5 font-bold text-background text-xl  overflow-hidden "
					>
						<a
							target="_blank"
							href="https://www.linkedin.com/in/abdulmannansaipi"
							className="hover:text-color-text-hovering cursor-none"
						>
							LinkedIn
						</a>
						<a
							target="_blank"
							href="https://github.com/manansaipi"
							className="hover:text-color-text-hovering cursor-none"
						>
							GitHub
						</a>
						<a
							target="_blank"
							href="https://www.instagram.com/manansaipi"
							className="hover:text-color-text-hovering cursor-none"
						>
							Instagram
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OpenedNavbar;
