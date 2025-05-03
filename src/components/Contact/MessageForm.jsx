import React, { useRef, useState } from "react";
import emailjs, { send } from "emailjs-com";
import { MdMailOutline } from "react-icons/md";
import Magnet from "./Magnet";

const MessageForm = () => {
	let form = useRef();

	// Refs for inputs
	const nameRef = useRef();
	const emailRef = useRef();
	const subjectRef = useRef();
	const messageRef = useRef();

	// Refs for error messages
	const nameErrorRef = useRef();
	const emailErrorRef = useRef();
	const subjectErrorRef = useRef();
	const messageErrorRef = useRef();

	const [isLoading, setIsLoading] = useState();

	const validateForm = () => {
		const name = form.current.name.value.trim();
		const email = form.current.email.value.trim();
		const subject = form.current.subject.value.trim();
		const message = form.current.message.value.trim();

		let isValidate = true;

		if (!name) {
			nameRef.current.classList.add("border-red-400");
			nameErrorRef.current.textContent = "Please enter your name.";
			isValidate = false;
		} else {
			nameRef.current.classList.remove("border-red-400");
			nameErrorRef.current.textContent = "";
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email || !emailRegex.test(email)) {
			emailRef.current.classList.add("border-red-400");
			if (!email) {
				emailErrorRef.current.textContent = "Please enter your email.";
			} else {
				emailErrorRef.current.textContent =
					"Please enter a valid email address.";
			}
			isValidate = false;
		} else {
			emailRef.current.classList.remove("border-red-400");
			emailErrorRef.current.textContent = "";
		}

		if (!subject) {
			subjectRef.current.classList.add("border-red-400");
			subjectErrorRef.current.textContent = "Please enter a subject.";
			isValidate = false;
		} else {
			subjectRef.current.classList.remove("border-red-400");
			subjectErrorRef.current.textContent = "";
		}

		if (!message) {
			messageRef.current.classList.add("border-red-400");
			messageErrorRef.current.textContent = "Please enter a message.";
			isValidate = false;
		} else {
			messageRef.current.classList.remove("border-red-400");
			messageErrorRef.current.textContent = "";
		}

		return isValidate;
	};

	const sendEmail = (e) => {
		e.preventDefault();

		if (!validateForm()) return;

		setIsLoading(true);

		emailjs
			.sendForm(
				import.meta.env.VITE_EMAILJS_SERVICE_ID,
				import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
				form.current,
				import.meta.env.VITE_EMAILJS_PUBLIC_KEY
			)

			.then(
				(result) => {
					form.current.reset(); // clear the form
				},
				(error) => {
					alert("Failed to send message. Please try again.");
					console.error(error.text);
				}
			)
			.finally(() => setIsLoading(false));
	};

	return (
		<div>
			<div className="pb-24 pt-8">
				<div className="text-5xl font-bold text-background">Contact</div>
			</div>
			<form ref={form} onSubmit={sendEmail} noValidate>
				<div className="flex flex-col gap-y-5 text-xl font-semibold ">
					<input
						ref={nameRef}
						required
						name="name"
						type="text"
						className="border-b-2 outline-0 py-2 "
						placeholder="Your Name "
					/>
					<span
						ref={nameErrorRef}
						className="text-sm -mt-4 text-red-400 font-light"
					></span>
					<input
						ref={emailRef}
						required
						name="email"
						type="email"
						className="border-b-2 outline-0 py-2 "
						placeholder="Your Email"
					/>
					<span
						ref={emailErrorRef}
						className="text-sm -mt-4 text-red-400 font-light"
					></span>
					<input
						ref={subjectRef}
						required
						name="subject"
						type="text"
						className="border-b-2 outline-0 py-2 "
						placeholder="Subject"
					/>
					<span
						ref={subjectErrorRef}
						className="text-sm -mt-4 text-red-400 font-light"
					></span>
					<textarea
						ref={messageRef}
						required
						name="message"
						className="border-b-2 outline-0 pt-5 pb-25  resize-none"
						placeholder="Your Message"
					></textarea>
					<span
						ref={messageErrorRef}
						className="text-sm -mt-4 text-red-400 font-light"
					></span>
				</div>
				<button
					type="submit"
					disabled={isLoading}
					className={`flex justify-center items-center bg-background px-8 py-2 mt-5 rounded-md md:cursor-none active:bg-color-text-hovering ${
						isLoading ? "opacity-60 cursor-not-allowed" : ""
					}`}
				>
					<Magnet magnetStrength={3}>
						<div className="flex flex-row gap-2">
							{isLoading ? (
								<span className="text-primary animate-pulse">Sending...</span>
							) : (
								<>
									<MdMailOutline size={27} className="text-primary" />
									<div className="text-primary">Send</div>
								</>
							)}
						</div>
					</Magnet>
				</button>
			</form>
		</div>
	);
};

export default MessageForm;
