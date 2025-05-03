import React from "react";
import bgImage from "../../assets/img/bg/noise-transparent.png"; // adjust the path as needed
import Lanyard from "./Lanyard";
import MessageForm from "./MessageForm";
import FooterContact from "./FooterContact";

const Contact = () => {
	return (
		<div
			id="Contact"
			className="section bg-gray-50 bg-repeat bg-center"
			style={{ backgroundImage: `url(${bgImage})` }}
		>
			<div className="h-[80vh] hidden">
				<Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
			</div>
			<div className="h-[80vh] p-12">
				<MessageForm />
			</div>
			{/* <div className="h-[80vh] "></div> */}
			<div className="h-[20vh] ">
				<FooterContact />
			</div>
		</div>
	);
};

export default Contact;
// https://aafrzl.my.id/ contact refference
