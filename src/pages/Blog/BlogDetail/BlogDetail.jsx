import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router";
import blogs from "../AllBlog/Blogs";
import {
	slugify,
	handleImageNavigation,
} from "../../../utils/NavhiagtionImageAnimation";
import { AppContext } from "../../../App";
import { useLenis } from "lenis/react";
import { AnimateHeader } from "../../../components/PreLoader/AnimatePageTransition";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import gsap from "gsap";
import { GrBold } from "react-icons/gr";
import { GrItalic } from "react-icons/gr";
import { MdEdit } from "react-icons/md";
import { CiHeart } from "react-icons/ci";
import { FaRegComment } from "react-icons/fa";
import { MdOutlineModeComment } from "react-icons/md";
import { TfiComment } from "react-icons/tfi";
import InputComment from "../../../components/Input/InputComment";
import comments from "./Comments";
import { FaHeart } from "react-icons/fa";
import checkAnimation from "../../../assets/animations/heartAnimation.json";
import Lottie from "lottie-react";
import {
	getCommentByPostId,
	addComment,
	likeComment,
} from "../../../services/PostService";
import dayjs from "dayjs";
import { MdVerified } from "react-icons/md";

const BlogDetail = () => {
	const { blogId } = useParams();
	const { navbarRef, preloaderRef, handleButtonNavigation } =
		React.useContext(AppContext);
	const lenis = useLenis();
	const navigate = useNavigate();

	const headerRef = useRef();
	const contentRef = useRef();
	const imageRef = useRef();
	const inputCommentRef = useRef();
	const inputCommentContainer = useRef();
	const commentActionsRef = useRef();

	const [isBold, setIsBold] = useState(false);
	const [isItalic, setIsItalic] = useState(false);
	const [currentBlog, setCurrentBlog] = useState(null);
	const [isEditingName, setIsEditingName] = useState(false);
	const [userName, setUserName] = useState(() => {
		const storedName = localStorage.getItem("commentUserName");
		return storedName ? storedName : "Anonymous";
	});
	const [comment, setComment] = useState("");
	const [likedComments, setLikedComments] = useState(() => {
		const storedLikes = localStorage.getItem("likedComments");
		return storedLikes ? JSON.parse(storedLikes) : {};
	});

	useEffect(() => {
		localStorage.setItem("likedComments", JSON.stringify(likedComments));
	}, [likedComments]);

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
			console.error("Error fetching works:", error);
		}
	};

	async function handleSubmitRespond() {
		try {
			const commentInout = comment;
			setComment("");
			const newComment = await addComment(
				currentBlog.id,
				commentInout,
				userName
			);
			console.log("🚀 ~ handleSubmitRespond ~ newComment:", newComment);

			await fetchData(currentBlog.id);
		} catch (error) {
			console.error("Error fetching works:", error);
		}
	}

	useEffect(() => {
		const foundBlog = blogs.find((blog) => slugify(blog.title) === blogId);

		fetchData(foundBlog.id);

		setCurrentBlog(foundBlog);
	}, [blogId]);

	useLayoutEffect(() => {
		if (currentBlog && imageRef.current) {
			imageRef.current.classList.remove("z-7");
		}
	}, [currentBlog]);

	function handleClickComment(toggle) {
		if (toggle == "open") {
			gsap.to(inputCommentContainer.current, { height: "15vh" });
			gsap.to(commentActionsRef.current, { opacity: 1 });
		} else {
			gsap.to(commentActionsRef.current, { opacity: 0 });
			gsap.to(inputCommentContainer.current, { height: "5vh" });
		}
	}

	function handleCommentOnChange(e) {
		const value = e.target.value;
		setComment(value);
	}

	// useLayoutEffect(() => {
	// 	if (headerRef.current) {
	// 		AnimateHeader({ headerContainerRef: headerRef });
	// 	}
	// }, [currentBlog]);

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
							src={currentBlog.authorImg || "/default-author.jpg"}
							alt="author"
							className="h-8 w-8 rounded-full"
						/>
						<span className="uppercase tracking-wide">
							By {currentBlog.author}
						</span>
						<div>
							<MdVerified size={20} />
						</div>
					</div>
					<div className="tracking-wider">{currentBlog.date}</div>
				</div>

				{/* Content */}
				<div ref={contentRef} className="text-lg leading-relaxed text-primary">
					<p>
						{/* You can make this dynamic like `currentBlog.content` or render paragraphs */}
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
						className="flex items-center gap-3 group"
					>
						<img
							src={currentBlog.authorImg || "/default-author.jpg"}
							alt="author"
							className="h-8 w-8 rounded-full "
						/>
						{isEditingName ? (
							<input
								type="text"
								value={userName}
								onChange={(e) => setUserName(e.target.value)}
								onBlur={handleNameEditToggle}
								onKeyDown={(e) => {
									if (e.key === "Enter" && !e.shiftKey) {
										e.preventDefault(); // Prevent default form submission or newline
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
						isBold={isBold}
						setIsBold={setIsBold}
						isItalic={isItalic}
						setIsItalic={setIsItalic}
						handleClickComment={handleClickComment}
						inputCommentRef={inputCommentRef}
						inputCommentContainer={inputCommentContainer}
						commentActionsRef={commentActionsRef}
						handleOnClick={handleSubmitRespond}
					/>
				</div>

				<div className="my-10 border-b-[1px] border-color-text-hovering "></div>

				{/* All Comments */}
				{dataComments.map((comment, index) => (
					<div key={index} className="mb-10">
						<div className="flex items-center gap-3 group">
							<img
								src={currentBlog.authorImg || "/default-author.jpg"}
								alt="author"
								className="h-8 w-8 rounded-full"
							/>
							<div className="flex flex-col">
								<div className="flex flex-row items-center gap-2">
									<span className="text-md text-primary ">{comment.name}</span>
									{comment.isVerified == true && <MdVerified size={15} />}
								</div>
								<span className="text-xs text-color-text-hovering">
									{dayjs(comment.createdAt).format("DD MMM YYYY")}
								</span>
							</div>
						</div>
						<div className="mt-3">{comment.comment}</div>
						<div className="flex mt-2 gap-5 text-color-text-hovering items-center h-5">
							<div
								className="flex items-center gap-2"
								onClick={() => toggleLike(comment.id)}
							>
								{likedComments[comment.id] ? (
									<FaHeart size={18} color="red" className="w-7" />
								) : (
									<CiHeart size={25} className="w-7" />
								)}
								<span className="text-sm">
									{comment.totalLikes + (likedComments[comment.id] ? 1 : 0)}
								</span>
							</div>

							{/* <div className="flex items-center gap-2">
								<div className="text-color-text-hovering ">
									<MdOutlineModeComment size={18} />
								</div>
								<div className="text-sm">
									{comment.totalComment}{" "}
									{comment.totalComment > 1 ? "Replies" : "Reply"}
								</div>
							</div>
							<div className=" text-sm underline text-primary">Reply</div> */}
						</div>
						<div className="mt-5 border-b-[1px] border-color-text-hovering "></div>
					</div>
				))}
			</div>
		</div>
	);
};

export default BlogDetail;
