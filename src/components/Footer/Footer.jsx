import React from "react";
import bgImage from "../../assets/img/bg/noise-transparent.png"; // adjust the path as needed

import { LuGithub } from "react-icons/lu";
import { FaInstagram } from "react-icons/fa";
import { MdMailOutline } from "react-icons/md";
import { PiLinkedinLogoBold } from "react-icons/pi";
import Magnet from "../Magnet";
import TransitionLink from "../Navbar/TransitionLink";

const Footer = ({ preloaderRef }) => {
	return (
		<div
			className="h-[50vh]"
			style={{
				clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)",
			}}
		>
			<div
				className="fixed  w-full h-[50vh]  bottom-0 bg-gray-50 bg-repeat bg-center "
				style={{
					backgroundImage: `url(${bgImage})`,
				}}
			>
				<div className="flex flex-col h-full px-12 md:px-20 lg:px-30">
					<div className="pt-10 h-[40vh] flex flex-col gap-5  justify-center text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold md:text-end ">
						<div>
							<span className="text-background">Got something in mind? </span>
							<span className="text-color-text-hovering border-b-2 border-transparent hover:text-color-text-hovering  hover:border-color-text-hovering transition-all duration-300 cursor-pointer md:cursor-none">
								<TransitionLink
									preloaderRef={preloaderRef}
									href={"/Contact"}
									label={"Let’s talk about it."}
								/>
							</span>
						</div>
						<div className="border px-8 py-1 text-lg flex items-center justify-center rounded-xm cursor-pointer md:cursor-none hover:border-color-text-hovering self-start  md:self-end ">
							<Magnet magnetStrength={4} padding={20}>
								<TransitionLink
									preloaderRef={preloaderRef}
									href={"/Contact"}
									label={"GET IN TOUCH"}
								></TransitionLink>
							</Magnet>
						</div>
					</div>
					<div className="flex  justify-between items-center  h-[10vh]">
						<div className="text-sm md:flex md:gap-5 md:text-md lg:text-lg lg:gap-10">
							<div>Made in Jakarta, Indonesia</div>
							<div>&copy; 2025 Ben</div>
						</div>
						<div className="flex gap-5 md:gap-7 lg:gap-9">
							<Magnet magnetStrength={3} padding={15}>
								<a
									href="https://www.linkedin.com/in/abdulmannansaipi"
									target="_blank"
									className="md:cursor-none hovering"
								>
									<PiLinkedinLogoBold className="text-background hover:text-color-text-hovering size-5 md:size-6 lg:size-7  " />
								</a>
							</Magnet>
							<Magnet magnetStrength={3} padding={20}>
								<a
									href="https://github.com/manansaipi"
									target="_blank"
									className="md:cursor-none"
								>
									<LuGithub className="text-background hover:text-color-text-hovering size-5 md:size-6 lg:size-7 " />
								</a>
							</Magnet>
							<Magnet magnetStrength={3} padding={20}>
								<a
									href="https://www.instagram.com/manansaipi"
									target="_blank"
									className="md:cursor-none"
								>
									<FaInstagram className="text-background hover:text-color-text-hovering size-5 md:size-6 lg:size-7 " />
								</a>
							</Magnet>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Footer;
