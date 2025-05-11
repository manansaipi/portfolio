import React from "react";
import { LuGithub } from "react-icons/lu";
import { FaInstagram } from "react-icons/fa";
import { MdMailOutline } from "react-icons/md";
import { PiLinkedinLogoBold } from "react-icons/pi";
import Magnet from "../../components/Magnet";

const Footer = () => {
	return (
		<div className="p-12 pb-5 h-full w-full flex justify-between items-center hovering">
			<div>
				<div className="mb-4 text-xl font-semibold text-background">Github</div>
				<Magnet magnetStrength={3}>
					<a
						href="https://github.com/manansaipi"
						target="_blank"
						className="md:cursor-none"
					>
						<LuGithub
							className="text-background hover:text-color-text-hovering "
							size={32}
						/>
					</a>
				</Magnet>
			</div>
			<div>
				<div className="mb-4 text-xl font-semibold text-background ">
					Social Media
				</div>
				<div className="flex gap-x-2 items-center justify-between">
					<Magnet>
						<a
							href="https://www.instagram.com/manansaipi"
							target="_blank"
							className="md:cursor-none"
						>
							<FaInstagram size={25} />
						</a>
					</Magnet>
					<Magnet>
						<a
							href="mailto:abdulmannan.saipi@gmail.com"
							target="_blank"
							className="md:cursor-none"
						>
							<MdMailOutline size={25} />
						</a>
					</Magnet>
					<Magnet className="hovering">
						<a
							href="https://www.linkedin.com/in/abdulmannansaipi"
							target="_blank"
							className="md:cursor-none hovering"
						>
							<PiLinkedinLogoBold size={25} />
						</a>
					</Magnet>
				</div>
			</div>
		</div>
	);
};

export default Footer;
