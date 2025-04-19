import React, { useState } from "react";
import TogleTheme from "./TogleThemeButton";

import gsap from "gsap";

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);

	const handleOpenNavbar = () => {
		setIsOpen(!isOpen);
	};

	return (
		<>
			{isOpen ? (
				<div className="flex bg-primary w-full fixed">
					<a
						onClick={handleOpenNavbar}
						className="absolute top-3 right-3 bg-none text-background text-xl font-bold hover:text-color-text-hovering "
					>
						Close
					</a>
					<div className="p-5  w-1/2 hidden  md:flex md:flex-col">
						<a className=" font-bold text-background text-xl">
							Abdul Mannan Saip
						</a>
						<a className=" font-bold text-background text-xl">
							Portofolio
						</a>
					</div>
					<div className="flex flex-col  justify-center items-start bg-primary  pt-10 md:pt-5 ">
						<div className="flex flex-col font-bold text-6xl text-background  ">
							<a
								href="#Home"
								className="hover:text-color-text-hovering"
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
			) : (
				<div className="fixed flex justify-between text-white bg-transparent w-full px-4 pt-1">
					<a className=" hover:text-zinc-400 p-3 text-primary text-xl font-bold">
						<a className="font-luckiestguy tracking-widest italic text-2xl">
							AMS°
						</a>
						&nbsp;&nbsp; Portofolio
					</a>
					{/* <a className="p-3">
						<TogleTheme />
					</a> */}

					<a
						onClick={handleOpenNavbar}
						className="absolute top-3 right-3  hover:text-zinc-400  text-primary text-xl font-bold"
					>
						Menu
					</a>
				</div>
			)}
		</>
	);
};

export default Navbar;
