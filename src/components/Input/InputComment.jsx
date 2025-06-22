import React, { useEffect, useState } from "react";
import { GrBold, GrItalic, GrUnderline } from "react-icons/gr";

const InputComment = ({
	comment,
	setComment,
	handleClickComment,
	inputCommentRef,
	inputCommentContainer,
	commentActionsRef,
	handleSubmit,
}) => {
	const [isBold, setIsBold] = useState(false);
	const [isItalic, setIsItalic] = useState(false);
	const [isUnderLine, setIsUnderLine] = useState(false);

	useEffect(() => {
		const handleSelectionChange = () => {
			const selection = window.getSelection();
			if (selection && selection.rangeCount > 0) {
				setIsBold(document.queryCommandState("bold"));
				setIsItalic(document.queryCommandState("italic"));
				setIsUnderLine(document.queryCommandState("underline"));
			}
		};

		document.addEventListener("selectionchange", handleSelectionChange);
		return () => {
			document.removeEventListener("selectionchange", handleSelectionChange);
		};
	}, []);

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
			className="w-full h-[6vh] mt-2 pt-1 pb-5 px-5 flex flex-col justify-between rounded-sm bg-[#282828]"
		>
			<div className=" relative w-full">
				<div
					ref={inputCommentRef}
					contentEditable
					onInput={(e) => setComment(e.currentTarget.innerHTML)}
					onMouseDown={() => handleClickComment("open")}
					onKeyDown={(e) => {
						console.log(comment);

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
							handleSubmit();
							resetInput();
						}
					}}
					className={`w-full resize-none scroll- py-2 cursor-none placeholder:text-color-text-hovering ${
						isBold ? "placeholder:font-semibold" : ""
					} ${
						isItalic ? "placeholder:italic" : ""
					} text-sm border border-[#282828] rounded-sm outline-none focus:heigh-50 transition-all`}
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
			</div>
			<div ref={commentActionsRef} className="flex justify-between opacity-0">
				<div className="flex gap-4 items-center">
					<div
						onClick={() => {
							inputCommentRef.current.focus();
							document.execCommand("bold");
							setIsBold(!isBold);
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
						onClick={() => {
							inputCommentRef.current.focus();
							document.execCommand("italic");
							setIsItalic(!isItalic);
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
						onClick={() => {
							inputCommentRef.current.focus();
							document.execCommand("underline");
							setIsUnderLine(!isUnderLine);
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
						disabled={comment.length === 0}
						onClick={() => {
							handleSubmit();
							resetInput();
						}}
						className={`border px-3 p-1 disabled: rounded-2xl ${
							comment.length === 0
								? "border-[#36393b] text-[#36393b] pointer-events-none"
								: "border-color-text-hovering text-primary"
						}`}
					>
						Respond
					</button>
				</div>
			</div>
		</div>
	);
};

export default InputComment;
