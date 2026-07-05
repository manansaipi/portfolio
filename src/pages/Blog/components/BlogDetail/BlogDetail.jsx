import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
	slugify,
	handleImageNavigation,
} from "@utils/navigationImageAnimation.js";
import { AppContext } from "@/App.jsx";
import { useLenis } from "lenis/react";
import { AnimateHeader } from "@components/layout/PreLoader/AnimatePageTransition.jsx";
import PrimaryButton from "@components/ui/Buttons/PrimaryButton.jsx";
import { MdEdit } from "react-icons/md";
import { CiHeart } from "react-icons/ci";
import InputComment from "@components/ui/Input/InputComment.jsx";
import { FaHeart } from "react-icons/fa";
import {
    getAllWritings,
	getCommentByPostId,
	addComment,
	likeComment,
} from "@services/postService.js";
import dayjs from "dayjs";
import { MdVerified } from "react-icons/md";
import authorImgDefault from "@assets/img/author/Matteo.jpg";

const BlogDetail = () => {
	const { blogId } = useParams();
	const { navbarRef, preloaderRef, handleButtonNavigation, isAdmin } =
		React.useContext(AppContext);
	const lenis = useLenis();
	const navigate = useNavigate();

	const headerRef = useRef();
	const contentRef = useRef();
	const imageRef = useRef();

	const [currentBlog, setCurrentBlog] = useState(null);
	const [isEditingName, setIsEditingName] = useState(false);
	const [userName, setUserName] = useState(() => {
		const storedName = localStorage.getItem("commentUserName");
		return storedName ? storedName : "Anonymous";
	});
	const [comment, setComment] = useState("");
	const [replyComment, setReplyComment] = useState("");
	const [replyingTo, setReplyingTo] = useState(null);
	
	const [likedComments, setLikedComments] = useState(() => {
		const storedLikes = localStorage.getItem("likedComments");
		return storedLikes ? JSON.parse(storedLikes) : {};
	});

	useEffect(() => {
		localStorage.setItem("likedComments", JSON.stringify(likedComments));
	}, [likedComments]);

	const handleDeleteComment = async (commentId) => {
		if (!window.confirm("Are you sure you want to delete this comment?")) return;
		try {
			const { deleteComment } = await import("@services/adminService");
			await deleteComment(commentId);
			if (currentBlog) fetchData(currentBlog.id);
		} catch (error) {
			console.error("Error deleting comment:", error);
		}
	};

	const toggleLike = async (commentId) => {
		// Determine the new like state before updating
		const isCurrentlyLiked = likedComments[commentId];
		const newLikedState = !isCurrentlyLiked;

		// Update UI immediately
		setLikedComments((prev) => ({
			...prev,
			[commentId]: newLikedState,
		}));

		// Save to localStorage (optional)
		const updatedStorage = {
			...likedComments,
			[commentId]: newLikedState,
		};
		localStorage.setItem("likedComments", JSON.stringify(updatedStorage));

		// Hit API with correct like state
		try {
			await likeComment(commentId, newLikedState);
		} catch (error) {
			console.error("Failed to like comment:", error);
			// Optional: rollback UI if needed
			setLikedComments((prev) => ({
				...prev,
				[commentId]: isCurrentlyLiked,
			}));
		}
	};

	const handleNameEditToggle = () => {
		setIsEditingName((prev) => !prev);
		if (userName.trim().length === 0) {
			setUserName("Anonymous");
			localStorage.setItem("commentUserName", "Anonymous");
		} else {
			localStorage.setItem("commentUserName", userName);
		}
	};

	const [dataComments, setDataComments] = useState([]);
	const fetchData = async (postId) => {
		try {
			const res = await getCommentByPostId(postId);
			setDataComments(res);
		} catch (error) {
			console.error("Error fetching comments:", error);
		}
	};

	async function handleSubmitRespond() {
		try {
			const commentInput = comment;
			setComment("");
			await addComment(
				currentBlog.id,
				commentInput,
				userName
			);
			await fetchData(currentBlog.id);
		} catch (error) {
			console.error("Error submitting response:", error);
		}
	}

	async function handleReplySubmit(parentId) {
		try {
			const commentInput = replyComment;
			setReplyComment("");
			setReplyingTo(null);
			await addComment(currentBlog.id, commentInput, userName, parentId);
			await fetchData(currentBlog.id);
		} catch (error) {
			console.error("Error submitting response:", error);
		}
	}

	useEffect(() => {
        const fetchCurrentBlog = async () => {
            const fetchedBlogs = await getAllWritings();
		    const foundBlog = fetchedBlogs.find((blog) => slugify(blog.title) === blogId);
            if (foundBlog) {
		        fetchData(foundBlog.id);
		        setCurrentBlog(foundBlog);
            }
        };
        fetchCurrentBlog();
	}, [blogId]);

	useLayoutEffect(() => {
		if (currentBlog && imageRef.current) {
			imageRef.current.classList.remove("z-7");
		}
	}, [currentBlog]);

	if (!currentBlog) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background text-primary px-5">
				<div className="text-center">
					<h1 className="text-4xl font-bold mb-4">Blog Not Found</h1>
					<p className="text-lg mb-6">
						The blog post you're looking for doesn't exist.
					</p>
					<PrimaryButton
						label="Back to All Works"
						handleOnClick={() => handleButtonNavigation("/blog")}
					/>
				</div>
			</div>
		);
	}

	const resolveImg = (imgStr, defaultImg) => {
		if (!imgStr) return defaultImg;
		if (imgStr.startsWith("/static")) return `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}${imgStr}`;
		if (imgStr.startsWith("@assets")) return defaultImg;
		return imgStr;
	};

	const renderComment = (commentObj, isReply = false) => (
		<div key={commentObj.id} className={`mb-10 ${isReply ? 'ml-10 border-l border-[#333] pl-5' : ''}`}>
			<div className="flex items-center gap-3 group">
				<img
					src={resolveImg(commentObj.profile_img, authorImgDefault)}
					alt="author"
					className="h-8 w-8 rounded-full object-cover"
				/>
				<div className="flex flex-col">
					<div className="flex flex-row items-center gap-2">
						<span className="text-md text-primary ">{commentObj.username}</span>
						{commentObj.isVerified && <MdVerified size={15} />}
					</div>
					<span className="text-xs text-color-text-hovering">
						{dayjs(commentObj.created_at).format("ddd, DD MMM YYYY HH:mm")}
					</span>
				</div>
			</div>
			<div className="mt-3" dangerouslySetInnerHTML={{ __html: commentObj.content }}></div>
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
					<div
						className="flex items-center gap-2 cursor-none hover:text-red-500 transition-colors ml-4"
						onClick={() => handleDeleteComment(commentObj.id)}
					>
						<span className="text-sm font-semibold">Delete</span>
					</div>
				)}
			</div>
			
			{/* Reply Input Box */}
			{replyingTo === commentObj.id && (
				<div className="mt-5">
					<div onClick={handleNameEditToggle} className="flex items-center gap-3 group mb-2 cursor-none">
						<img src={resolveImg(currentBlog.author_img, authorImgDefault)} alt="author" className="h-8 w-8 rounded-full object-cover" />
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
					{commentObj.replies.map(reply => renderComment(reply, true))}
				</div>
			)}
		</div>
	);

	return (
		<div className="min-h-screen bg-background text-primary pb-50">
			{/* Image Header */}
			<div className="w-full overflow-hidden">
				<img
					ref={imageRef}
					src={currentBlog.image}
					alt="Blog header"
					className="h-[70vh] w-full object-cover absolute z-7 shadow-lg shadow-black"
					onError={(e) => {
						e.target.onerror = null;
						e.target.src = `https://placehold.co/800x450/333333/FFFFFF?text=Image+Not+Found`;
					}}
				/>
			</div>

			{/* Main Content */}
			<div className="pt-[75vh] px-5 md:px-20 lg:px-40 2xl:px-60 flex flex-col gap-8">
				{/* Title */}
				<div
					ref={headerRef}
					className="text-3xl md:text-4xl lg:text-5xl font-bold"
				>
					{currentBlog.title}
				</div>

				{/* Author & Date */}
				<div className="flex items-center justify-between text-sm text-color-text-hovering">
					<div className="flex items-center gap-3">
						<img
							src={resolveImg(currentBlog.author_img, authorImgDefault)}
							alt="author"
							className="h-8 w-8 rounded-full object-cover"
						/>
						<span className="uppercase tracking-wide">
							By {currentBlog.author}
						</span>
						<div>
							<MdVerified size={20} />
						</div>
					</div>
					<div className="tracking-wider">{dayjs(currentBlog.published_at).format("MMM D, YYYY")}</div>
				</div>

				{/* Content */}
				<div
					ref={contentRef}
					className="text-lg leading-relaxed text-primary"
				>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
						lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod
						malesuada. Nullam ac erat ante. Integer varius nisi in tellus
						tincidunt, id pulvinar felis efficitur.
					</p>
				</div>
			</div>

			{/* response section */}
			<div className="mt-20 mb-15 border-b-[1px] border-color-text-hovering "></div>
			<div className="px-5 md:px-20 lg:px-40 2xl:px-60">
				<div>
					<h2 className="text-xl font-semibold my-5">
						Responses ({dataComments.length})
					</h2>
				</div>
				{/* Input comment */}
				<div>
					<div
						onClick={handleNameEditToggle}
						className="flex items-center gap-3 group cursor-none"
					>
						<img
							src={resolveImg(currentBlog.author_img, authorImgDefault)}
							alt="author"
							className="h-8 w-8 rounded-full object-cover"
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
								<span className="text-md text-primary ">{userName}</span>
								<div className="flex gap-1 items-center text-color-text-hovering opacity-0 group-hover:opacity-100 transition-opacity duration-300">
									<MdEdit size={15} /> <div className="text-sm">Edit</div>
								</div>
							</>
						)}
					</div>
					<InputComment
						comment={comment}
						setComment={setComment}
						handleSubmit={handleSubmitRespond}
					/>
				</div>

				<div className="my-10 border-b-[1px] border-color-text-hovering "></div>

				{/* All Comments */}
				{dataComments.map((comment) => renderComment(comment))}
			</div>
		</div>
	);
};

export default BlogDetail;
