import { useRef, useState, useEffect, useLayoutEffect } from "react";
import ContactForm from "./ContactForm/ContactForm";
import Magnet from "../../components/Magnet";
import { LuGithub } from "react-icons/lu";
import { FaInstagram } from "react-icons/fa";
import { PiLinkedinLogoBold } from "react-icons/pi";
import { AnimateHeader } from "../../components/PreLoader/AnimatePageTransition";
import FooterSocials from "../../components/Footer/FooterSocials";
import { IoCopyOutline } from "react-icons/io5";

const Contact = () => {
	const headerContainerRef = useRef();
	const [copied, setCopied] = useState(false);

	const handleCopyEmail = () => {
		navigator.clipboard.writeText("AbdulMannan.Saipi@gmail.com").then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000); // reset after 2s
		});
	};

	useLayoutEffect(() => {
		AnimateHeader({ headerContainerRef });
	}, []);

	return (
		<div className="bg-light-dark text-primary ">
			<div className=" p-5 md:px-20 lg:px-35 xl:px-50 2xl:px-75 z-10">
				<div className="custom-heading pb-5 overflow-hidden ">
					<div ref={headerContainerRef} className="relative z-7 ">
						<div>
							Feel free to reach out through the form or my socials below.
						</div>
					</div>
				</div>

				<div className="mb-10">
					<a
						className="text-color-text-hovering mb-10 relative w-full group "
						onClick={handleCopyEmail}
					>
						AbdulMannan.Saipi@gmail.com
						<span className="absolute left-full ml-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full">
							<IoCopyOutline />
							{copied ? "Copied!" : "Click to copy"}
						</span>
					</a>
				</div>

				<div className="text-2xl mb-10">Say hello</div>

				<ContactForm />
			</div>
			<div className="px-5 md:px-20 lg:px-30 mt-10">
				<FooterSocials />
			</div>
		</div>
	);
};

export default Contact;
// contact refference https://dribbble.com/shots/7717624-District2-V2-Contact-Page
// TODO : VALIDASI EMAIL SENDER SPAMMING. CANNOT SEND TWO TIMES OR MORE
