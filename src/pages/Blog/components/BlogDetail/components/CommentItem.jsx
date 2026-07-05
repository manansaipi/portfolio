import React from "react";
import { resolveImg } from "@utils/imageUtils";
import dayjs from "dayjs";
import { MdVerified, MdEdit } from "react-icons/md";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import InputComment from "@components/ui/Input/InputComment.jsx";
import authorImgDefault from "@assets/img/author/no_profile.jpeg";
import abdulImg from "@assets/img/author/abdulmannansaipi.png";

const CommentItem = ({
	commentObj,
	isReply = false,
	handlers,
	userState
}) => {
	const {
		isAdmin,
		likedComments,
		replyingTo,
		setReplyingTo,
		editingComment,
		setEditingComment,
		editContent,
		setEditContent,
		isEditingName,
		userName,
		setUserName,
		handleSaveEdit,
		toggleLike,
		handleEditComment,
		handleDeleteComment,
		handleNameEditToggle,
		handleReplySubmit,
		replyComment,
		setReplyComment,
	} = handlers;

	return (
		<div className={`mb-10 ${isReply ? 'ml-10 border-l border-[#333] pl-5' : ''}`}>
			<div className="flex items-center gap-3 group">
				<img
					src={commentObj.is_author ? abdulImg : resolveImg(commentObj.profile_img, authorImgDefault)}
					alt="author"
					className="h-8 w-8 rounded-full object-cover"
				/>
				<div className="flex flex-col">
					<div className="flex flex-row items-center gap-2">
						<span className="text-md text-primary ">{commentObj.username}</span>
						{commentObj.is_author && <MdVerified size={15} />}
					</div>
					<span className="text-xs text-color-text-hovering">
						{dayjs(commentObj.created_at).format("ddd, DD MMM YYYY HH:mm")}
					</span>
				</div>
			</div>
			<div className="mt-3">
				{editingComment === commentObj.id ? (
					<div className="flex flex-col gap-2">
						<textarea
							value={editContent}
							onChange={(e) => setEditContent(e.target.value)}
							className="bg-transparent border border-color-text-hovering rounded p-2 text-primary outline-none resize-none h-20 cursor-none"
							autoFocus
						/>
						<div className="flex gap-2">
							<span className="text-xs px-3 py-1 bg-white text-black rounded font-semibold cursor-none" onClick={() => handleSaveEdit(commentObj.id)}>Save</span>
							<span className="text-xs px-3 py-1 border border-color-text-hovering rounded cursor-none" onClick={() => setEditingComment(null)}>Cancel</span>
						</div>
					</div>
				) : (
					<div dangerouslySetInnerHTML={{ __html: commentObj.content }}></div>
				)}
			</div>
			<div className="flex mt-2 gap-5 text-color-text-hovering items-center h-5">
				<div
					className="flex items-center gap-2 cursor-none hover:text-red-500 transition-colors"
					onClick={() => toggleLike(commentObj.id)}
				>
					{likedComments[commentObj.id] ? (
						<FaHeart size={18} color="red" className="w-7" />
					) : (
						<CiHeart size={25} className="w-7" />
					)}
					<span className="text-sm">
						{commentObj.likes + (likedComments[commentObj.id] ? 1 : 0)}
					</span>
				</div>
				<div
					className="flex items-center gap-2 cursor-none hover:text-primary transition-colors"
					onClick={() => {
						if (replyingTo === commentObj.id) {
							setReplyingTo(null);
						} else {
							setReplyingTo(commentObj.id);
						}
					}}
				>
					<span className="text-sm font-semibold">Reply</span>
				</div>
				{isAdmin && (
					<>
						<div
							className="flex items-center gap-2 cursor-none hover:text-blue-400 transition-colors"
							onClick={() => handleEditComment(commentObj)}
						>
							<span className="text-sm font-semibold">Edit</span>
						</div>
						<div
							className="flex items-center gap-2 cursor-none hover:text-red-500 transition-colors"
							onClick={() => handleDeleteComment(commentObj.id)}
						>
							<span className="text-sm font-semibold">Delete</span>
						</div>
					</>
				)}
			</div>
			
			{/* Reply Input Box */}
			{replyingTo === commentObj.id && (
				<div className="mt-5">
					<div onClick={handleNameEditToggle} className="flex items-center gap-3 group mb-2 cursor-none">
						<img src={isAdmin ? abdulImg : resolveImg(authorImgDefault)} alt="author" className="h-8 w-8 rounded-full object-cover" />
						{isEditingName ? (
							<input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} onBlur={handleNameEditToggle} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleNameEditToggle(); } }} autoFocus className="bg-transparent border-b text-primary text-md focus:outline-none cursor-none" />
						) : (
							<>
								<span className="text-md text-primary ">{userName}</span>
								<div className="flex gap-1 items-center text-color-text-hovering opacity-0 group-hover:opacity-100 transition-opacity duration-300">
									<MdEdit size={15} /> <div className="text-sm">Edit</div>
								</div>
							</>
						)}
					</div>
					<InputComment
						comment={replyComment}
						setComment={setReplyComment}
						handleSubmit={() => handleReplySubmit(commentObj.id)}
						onCancel={() => { setReplyingTo(null); setReplyComment(""); }}
					/>
				</div>
			)}

			<div className="mt-5 border-b-[1px] border-color-text-hovering "></div>

			{/* Nested Replies */}
			{commentObj.replies && commentObj.replies.length > 0 && (
				<div className="mt-5">
					{commentObj.replies.map(reply => (
						<CommentItem 
							key={reply.id}
							commentObj={reply} 
							isReply={true} 
							handlers={handlers} 
							userState={userState} 
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default CommentItem;
