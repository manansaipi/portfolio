import React from "react";
import TogleTheme from "./TogleThemeButton";

const Navbar = () => {
	return (
		<>
			<div className="flex bg-primary">
				<a className="absolute top-3 right-3 bg-none text-background text-xl font-bold hover:text-color-text-hovering ">
					Close
				</a>
				<div className="p-5  w-1/2 hidden  md:block  ">
					<a className="w-30 font-bold text-background text-xl">
						Abdul Mannan Saip
					</a>
				</div>
				<div className="flex flex-col  justify-center items-start bg-primary  pt-10 md:pt-5 ">
					<div className="flex flex-col font-bold text-6xl text-background  ">
						<a className="hover:text-color-text-hovering">HOME</a>
						<a className="hover:text-color-text-hovering">
							GALLERIES
						</a>
						<a className="hover:text-color-text-hovering">
							WRITING
						</a>
						<a className="hover:text-color-text-hovering">ABOUT</a>
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
			<div className="section flex justify-between text-white bg-background ">
				<a className="p-3">
					<TogleTheme />
				</a>

				<a className=" hover:text-zinc-400 p-3 text-primary">
					Abdul Mannan Saipi
				</a>

				<a className="hover:text-zinc-400 p-3 text-primary ">Menu</a>
			</div>
		</>
	);
};

export default Navbar;
