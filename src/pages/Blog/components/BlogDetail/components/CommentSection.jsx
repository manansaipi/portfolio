import React from "react";
import { resolveImg } from "@utils/imageUtils";
import { MdEdit } from "react-icons/md";
import InputComment from "@components/ui/Input/InputComment.jsx";
import CommentItem from "./CommentItem";
import authorImgDefault from "@assets/img/author/no_profile.jpeg";
import abdulImg from "@assets/img/author/abdulmannansaipi.png";

const CommentSection = ({ comments, handlers }) => {
	const {
		isAdmin,
		isEditingName,
		userName,
		setUserName,
		comment,
		setComment,
		handleNameEditToggle,
		handleSubmitRespond,
		isSubmittingComment,
	} = handlers;

	const countComments = (commentsList) => {
		return commentsList.reduce((acc, c) => {
			return acc + 1 + (c.replies ? countComments(c.replies) : 0);
		}, 0);
	};
	const totalComments = countComments(comments);

	return (
		<div className="px-5 md:px-20 lg:px-40 2xl:px-60">
			<div>
				<h2 className="text-xl font-semibold my-5">
					Responses ({totalComments})
				</h2>
			</div>
			{/* Input comment */}
			<div>
				<div
					onClick={handleNameEditToggle}
					className="flex items-center gap-1 group mb-2 cursor-none"
				>
					<img
						src={isAdmin ? abdulImg : resolveImg(authorImgDefault)}
						alt="author"
						className="h-8 w-8 rounded-full object-cover mr-2"
					/>
					{isEditingName ? (
						<input
							type="text"
							value={userName}
							onChange={(e) => setUserName(e.target.value)}
							onBlur={handleNameEditToggle}
							onKeyDown={(e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									handleNameEditToggle();
								}
							}}
							autoFocus
							className="bg-transparent border-b text-primary text-md focus:outline-none cursor-none"
						/>
					) : (
						<>
							<div className="flex gap-2 items-center">
								<span className="text-md text-primary ">{userName} </span>
								<MdEdit className="text-color-text-hovering" size={15} /> 
							</div>
							<div className="text-color-text-hovering opacity-0 group-hover:opacity-100 transition-opacity duration-300">
								<div className="text-sm">Edit</div>
							</div>
						</>
					)}
				</div>
				<InputComment
					comment={comment}
					setComment={setComment}
					handleSubmit={handleSubmitRespond}
					isSubmitting={isSubmittingComment}
				/>
			</div>

			<div className="mt-15 border-b-[1px] border-color-text-hovering "></div>
			{/* Comments section */}
			<div className="mt-15">
				{comments.map((c) => (
					<CommentItem 
						key={c.id} 
						commentObj={c} 
						handlers={handlers} 
					/>
				))}
			</div>
		</div>
	);
};

export default CommentSection;
