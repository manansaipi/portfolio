import React, { useRef } from "react";
import emailjs, { send } from "emailjs-com";
import { MdMailOutline } from "react-icons/md";
import Magnet from "./Magnet";

const MessageForm = () => {
	let form = useRef();

	const sendEmail = (e) => {
		e.preventDefault();

		emailjs
			.sendForm(
				import.meta.env.VITE_EMAILJS_SERVICE_ID,
				import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
				form.current,
				import.meta.env.VITE_EMAILJS_PUBLIC_KEY
			)

			.then(
				(result) => {
					alert("Message sent successfully!");
					form.current.reset(); // clear the form
				},
				(error) => {
					alert("Failed to send message. Please try again.");
					console.error(error.text);
				}
			);
	};

	return (
		<div>
			<div className="pb-24 pt-8">
				<div className="text-5xl font-bold text-background">Contact</div>
			</div>
			<form ref={form} onSubmit={sendEmail}>
				<div className="flex flex-col gap-y-5 text-xl font-semibold ">
					<input
						name="name"
						type="text"
						className="border-b-2 outline-0 py-2"
						placeholder="Your Name "
					/>
					<input
						name="email"
						type="email"
						className="border-b-2 outline-0 py-2"
						placeholder="Your Email"
					/>
					<input
						name="subject"
						type="text"
						className="border-b-2 outline-0 py-2"
						placeholder="Subject"
					/>
					<textarea
						name="message"
						className="border-b-2 outline-0 pt-5 pb-25 resize-none"
						placeholder="Your Message"
					></textarea>
				</div>
				<button
					type="submit"
					className=" justify-center items-center bg-background px-8 py-2 mt-10 rounded-md"
				>
					<Magnet magnetStrength={3}>
						<div className="flex flex-row gap-2">
							<MdMailOutline size={27} className="text-primary" />
							<div className="text-primary">Send</div>
						</div>
					</Magnet>
				</button>
			</form>
		</div>
	);
};

export default MessageForm;
