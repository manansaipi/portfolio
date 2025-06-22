import React from "react";
import { GrBold, GrItalic } from "react-icons/gr";

const InputComment = ({
	comment,
	setComment,
	isBold,
	setIsBold,
	isItalic,
	setIsItalic,
	handleClickComment,
	inputCommentRef,
	inputCommentContainer,
	commentActionsRef,
	handleOnClick,
}) => {
	return (
		<div
			ref={inputCommentContainer}
			className="w-full h-[5vh] mt-2 pt-1 pb-5 px-5 flex flex-col justify-between rounded-sm bg-[#282828]"
		>
			<input
				ref={inputCommentRef}
				value={comment}
				onChange={(e) => setComment(e.target.value)}
				onMouseDown={() => handleClickComment("open")}
				onKeyDown={(e) => {
					if (e.key === "Enter" && !e.shiftKey) {
						e.preventDefault(); // Prevent default form submission or newline
						if (comment.length > 0) {
							handleOnClick(); 
						}
					}
				}}
				className={`w-full resize-none scroll- py-2 cursor-none placeholder:text-color-text-hovering ${
					isBold ? "placeholder:font-semibold" : ""
				} ${
					isItalic ? "placeholder:italic" : ""
				} text-sm border border-[#282828] rounded-sm outline-none focus:heigh-50 transition-all`}
				placeholder="What are your thoughts?"
			/>
			<div ref={commentActionsRef} className="flex justify-between opacity-0">
				<div className="flex gap-4 items-center">
					<div
						onClick={() => setIsBold(!isBold)}
						className={`border rounded-sm p-1 transition-all duration-300 ${
							isBold ? "border-color-text-hovering" : "border-transparent"
						}`}
					>
						<GrBold size={22} />
					</div>
					<div
						onClick={() => setIsItalic(!isItalic)}
						className={`border rounded-sm p-1 transition-all duration-300 ${
							isItalic ? "border-color-text-hovering" : "border-transparent"
						}`}
					>
						<GrItalic size={22} />
					</div>
				</div>
				<div className="flex gap-5 items-center text-sm">
					<div className="text-sm" onClick={() => handleClickComment("close")}>
						Cancel
					</div>
					<button
						disabled={comment.length === 0}
						onClick={handleOnClick}
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
