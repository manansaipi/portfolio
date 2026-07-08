import React, { useEffect, useState, useRef } from "react";
import { GrBold, GrItalic, GrUnderline } from "react-icons/gr";
import gsap from "gsap";

const InputComment = ({
	comment,
	setComment,
	handleSubmit,
	onCancel,
	isSubmitting,
	autoFocus = false
}) => {
	const inputCommentRef = useRef();
	const inputCommentContainer = useRef();
	const commentActionsRef = useRef();
	const [isOpen, setIsOpen] = useState(false);

	function handleClickComment(toggle) {
		if (toggle === "open") {
			setIsOpen(true);
			gsap.to(inputCommentContainer.current, { minHeight: "18vh", duration: 0.4 });
			gsap.to(commentActionsRef.current, { opacity: 1, duration: 0.4 });
		} else {
			setIsOpen(false);
			gsap.to(commentActionsRef.current, { opacity: 0, duration: 0.4 });
			gsap.to(inputCommentContainer.current, { 
				minHeight: "6vh", 
				duration: 0.4,
				onComplete: () => {
					if (onCancel) onCancel();
				}
			});
		}
	}
	const [isBold, setIsBold] = useState(false);
	const [isItalic, setIsItalic] = useState(false);
	const [isUnderLine, setIsUnderLine] = useState(false);

	useEffect(() => {
		const handleSelectionChange = () => {
			const selection = window.getSelection();
			if (selection && selection.rangeCount > 0) {
				if (inputCommentRef.current && inputCommentRef.current.contains(selection.anchorNode)) {
					setIsBold(document.queryCommandState("bold"));
					setIsItalic(document.queryCommandState("italic"));
					setIsUnderLine(document.queryCommandState("underline"));
				}
			}
		};

		document.addEventListener("selectionchange", handleSelectionChange);
		return () => {
			document.removeEventListener("selectionchange", handleSelectionChange);
		};
	}, []);

	useEffect(() => {
		if (autoFocus && inputCommentRef.current) {
			handleClickComment("open");
			// Add a slight delay to allow the animation to start before focusing
			setTimeout(() => {
				if (inputCommentRef.current) {
					inputCommentRef.current.focus();
					// Move cursor to end if there's content, otherwise just focus
					const range = document.createRange();
					const sel = window.getSelection();
					range.selectNodeContents(inputCommentRef.current);
					range.collapse(false);
					sel.removeAllRanges();
					sel.addRange(range);
				}
			}, 100);
		}
	}, [autoFocus]);

	function resetInput() {
		if (comment.length > 0) {
			setComment("<br>"); // Reset state
			inputCommentRef.current.innerHTML = ""; // Reset visual
			setIsBold(false);
			setIsItalic(false);
			setIsUnderLine(false);
		}
	}

	return (
		<div
			ref={inputCommentContainer}
			className={`w-full mt-2 pt-1 pb-5 px-5 flex flex-col justify-between rounded-md bg-light-dark ${isOpen ? 'min-h-[6vh]' : 'h-[6vh]'}`}
		>
			<div className=" relative w-full">
				<div
					ref={inputCommentRef}
					contentEditable
					onInput={(e) => setComment(e.currentTarget.innerHTML)}
					onMouseDown={() => handleClickComment("open")}
					onKeyDown={(e) => {
						
						if (isSubmitting) return;

						if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
							e.preventDefault();
							document.execCommand("bold");
							setIsBold((prev) => !prev);
						}
						if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "i") {
							e.preventDefault();
							document.execCommand("italic");
							setIsItalic((prev) => !prev);
						}
						if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "u") {
							e.preventDefault();
							document.execCommand("underline");
							setIsUnderLine((prev) => !prev);
						}
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault(); // Prevent default form submission or newline
							if (!isSubmitting && comment.trim().length > 0) {
								handleSubmit();
								resetInput();
							}
						}
					}}
					className={`w-full resize-none scroll- py-2 cursor-none placeholder:text-color-text-hovering ${
						isBold ? "placeholder:font-semibold" : ""
					} ${
						isItalic ? "placeholder:italic" : ""
					} text-sm border border-light-dark rounded-sm outline-none focus:heigh-50 transition-all`}
					suppressContentEditableWarning={true}
				/>

				{(comment.length === 0 || comment === "<br>") && (
					<span
						className={`absolute top-2 left-0 text-color-text-hovering pointer-events-none select-none 
							${isItalic ? "italic" : ""} 
							${isBold ? "font-semibold" : ""} 
							${isUnderLine ? "underline" : ""}
							`}
					>
						What are your thoughts?
					</span>
				)}
				{isSubmitting && (
					<div className="absolute inset-0 bg-light-dark/50 z-10 flex items-center justify-center pointer-events-none rounded-sm"></div>
				)}
			</div>
			<div ref={commentActionsRef} className="flex justify-between opacity-0">
				<div className="flex gap-4 items-center">
					<div
						onMouseDown={(e) => {
							e.preventDefault(); // Prevent losing focus
							document.execCommand("bold");
							setIsBold(document.queryCommandState("bold"));
						}}
						className={`border rounded-sm p-1 transition-all duration-300  ${
							isBold
								? "border-primary"
								: "border-transparent hover:border-color-text-hovering "
						}`}
					>
						<GrBold size={22} />
					</div>
					<div
						onMouseDown={(e) => {
							e.preventDefault(); // Prevent losing focus
							document.execCommand("italic");
							setIsItalic(document.queryCommandState("italic"));
						}}
						className={`border rounded-sm p-1 transition-all duration-300 ${
							isItalic
								? "border-primary"
								: "border-transparent hover:border-color-text-hovering"
						}`}
					>
						<GrItalic size={22} />
					</div>
					<div
						onMouseDown={(e) => {
							e.preventDefault(); // Prevent losing focus
							document.execCommand("underline");
							setIsUnderLine(document.queryCommandState("underline"));
						}}
						className={`border rounded-sm p-1 transition-all duration-300 ${
							isUnderLine
								? "border-primary"
								: "border-transparent hover:border-color-text-hovering"
						}`}
					>
						<GrUnderline size={22} />
					</div>
				</div>
				<div className="flex gap-5 items-center text-sm">
					<div
						className="text-sm"
						onClick={() => {
							handleClickComment("close");
							resetInput();
						}}
					>
						Cancel
					</div>
					<button
						disabled={comment.length === 0 || isSubmitting}
						onClick={() => {
							handleSubmit();
							resetInput();
						}}
						className={`border px-3 p-1 disabled: rounded-2xl ${
							comment.length === 0 || isSubmitting
								? "border-[#36393b] text-[#36393b] pointer-events-none"
								: "border-color-text-hovering text-primary"
						}`}
					>
						{isSubmitting ? (
							<span className="flex items-center gap-2">
								<svg className="animate-spin h-4 w-4 text-[#36393b]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Posting...
							</span>
						) : (
							"Respond"
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default InputComment;
