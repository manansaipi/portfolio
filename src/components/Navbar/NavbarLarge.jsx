import React from "react";
import { Link, useLocation } from "react-router";
import TransitionLink from "./TransitionLink";
import Logo from "./Logo";
import Magnet from "../Magnet";

const NavbarLarge = ({
	preloaderRef,
	preloaderTextRef,
	logoRef,
	navbarLargeRef,
}) => {
	const location = useLocation();
	const pathname = location.pathname;

	// Helper to determine active class
	const getLinkClass = (path) =>
		`${
			pathname.toLowerCase() === path.toLowerCase()
				? "text-primary"
				: "text-color-text-hovering"
		} hover:text-primary cursor-none`;

	return (
		<div>
			<div id="Home" className="bg-light-dark">
				<div className=" flex text-color-text-hovering h-[20vh]  items-center px-40 xl:px-60  ">
					{/* if sm-md screen size, the position is flex */}
					<div className="w-full hidden  lg:flex flex-col ">
						<div className="hover:text-primary cursor-none">
							<TransitionLink
								preloaderRef={preloaderRef}
								preloaderTextRef={preloaderTextRef}
								href={"/"}
								label={"Abdul Mannan Saipi"}
							></TransitionLink>
						</div>
					</div>
					<div
						ref={navbarLargeRef}
						className="hidden lg:flex gap-10 justify-end w-screen  overflow-hidden  "
					>
						{/* <div className={getLinkClass("/")}>
							<Magnet>
								<TransitionLink
									preloaderRef={preloaderRef}
									preloaderTextRef={preloaderTextRef}
									href={"/"}
									label={"Home"}
								></TransitionLink>
							</Magnet>
						</div> */}
						<div className={getLinkClass("/about")}>
							<Magnet>
								<TransitionLink
									preloaderRef={preloaderRef}
									preloaderTextRef={preloaderTextRef}
									href={"/about"}
									label={"About"}
								></TransitionLink>
							</Magnet>
						</div>
						<div className={getLinkClass("/experience")}>
							<Magnet>
								<TransitionLink
									preloaderRef={preloaderRef}
									preloaderTextRef={preloaderTextRef}
									href={"/experience"}
									label={"Experience"}
								></TransitionLink>
							</Magnet>
						</div>
						<div className={getLinkClass("/contact")}>
							<Magnet>
								<TransitionLink
									preloaderRef={preloaderRef}
									preloaderTextRef={preloaderTextRef}
									href={"/contact"}
									label={"Contact"}
								></TransitionLink>
							</Magnet>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NavbarLarge;
