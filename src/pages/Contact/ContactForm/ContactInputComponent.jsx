import React from "react";

const ContactInputComponent = ({
	inputRef,
	errorRef,
	name,
	type = "text",
	placeholder,
	defaultValue,
	className,
	isTextArea = false,
}) => {
	return (
		<div className="flex flex-col">
			{isTextArea ? (
				<textarea
					ref={inputRef}
					required
					name={name}
					className="border-b-1 outline-0 pt-5 pb-18 md:pb-25 cursor-none resize-none placeholder:text-color-text-hovering"
					placeholder={placeholder}
				></textarea>
			) : (
				<input
					ref={inputRef}
					required
					name={name}
					type={type}
                    value={defaultValue}
					className={`${className} border-b-1 outline-0 py-2 cursor-none placeholder:text-color-text-hovering`}
					placeholder={placeholder}
				/>
			)}
			<span
				ref={errorRef}
				className={`${className} text-sm text-red-400 opacity-0 transition-opacity duration-300 font-light`}
			>
				 error
			</span>
		</div>
	);
};

export default ContactInputComponent;
