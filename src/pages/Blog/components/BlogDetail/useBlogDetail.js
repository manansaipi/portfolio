import { useState, useEffect, useLayoutEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import { AppContext } from "@/App.jsx";
import { useToast } from "@components/ui/Toast/ToastProvider";
import {
	getAllWritings,
	getCommentByPostId,
	addComment,
	likeComment,
} from "@services/postService.js";
import { slugify } from "@utils/navigationImageAnimation.js";

export const useBlogDetail = () => {
	const { blogId } = useParams();
	const { handleButtonNavigation, isAdmin } = useContext(AppContext);
	const navigate = useNavigate();
	const toast = useToast();

	const [currentBlog, setCurrentBlog] = useState(null);
	const [dataComments, setDataComments] = useState([]);
	const [comment, setComment] = useState("");
	const [replyComment, setReplyComment] = useState("");
	const [replyingTo, setReplyingTo] = useState(null);
	const [editingComment, setEditingComment] = useState(null);
	const [editContent, setEditContent] = useState("");
	const [isEditingName, setIsEditingName] = useState(false);

	const [userName, setUserName] = useState(() => {
		if (localStorage.getItem("isAdmin") === "true") {
			return "Abdul Mannan Saipi";
		}
		const storedName = localStorage.getItem("commentUserName");
		return storedName ? storedName : "Anonymous";
	});

	const [likedComments, setLikedComments] = useState(() => {
		const storedLikes = localStorage.getItem("likedComments");
		return storedLikes ? JSON.parse(storedLikes) : {};
	});

	useEffect(() => {
		localStorage.setItem("likedComments", JSON.stringify(likedComments));
	}, [likedComments]);

	useEffect(() => {
		if (isAdmin) {
			setUserName("Abdul Mannan Saipi");
		} else {
			const storedName = localStorage.getItem("commentUserName");
			setUserName(storedName ? storedName : "Anonymous");
		}
	}, [isAdmin]);

	const fetchData = async (postId) => {
		try {
			const res = await getCommentByPostId(postId);
			setDataComments(res);
		} catch (error) {
			console.error("Error fetching comments:", error);
		}
	};

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

	const handleDeleteComment = async (commentId) => {
		if (!window.confirm("Are you sure you want to delete this comment?")) return;
		try {
			const { deleteComment } = await import("@services/adminService");
			await deleteComment(commentId);
			if (currentBlog) fetchData(currentBlog.id);
			toast.success("Comment deleted successfully");
		} catch (error) {
			console.error("Error deleting comment:", error);
			toast.error("Failed to delete comment");
		}
	};

	const handleEditComment = (commentObj) => {
		setEditingComment(commentObj.id);
		setEditContent(commentObj.content);
	};

	const handleSaveEdit = async (commentId) => {
		try {
			const { updateComment } = await import("@services/adminService");
			await updateComment(commentId, { content: editContent });
			setEditingComment(null);
			setEditContent("");
			if (currentBlog) fetchData(currentBlog.id);
			toast.success("Comment updated successfully");
		} catch (error) {
			console.error("Error updating comment:", error);
			toast.error("Failed to update comment");
		}
	};

	const toggleLike = async (commentId) => {
		const isCurrentlyLiked = likedComments[commentId];
		const newLikedState = !isCurrentlyLiked;

		setLikedComments((prev) => ({
			...prev,
			[commentId]: newLikedState,
		}));

		const updatedStorage = {
			...likedComments,
			[commentId]: newLikedState,
		};
		localStorage.setItem("likedComments", JSON.stringify(updatedStorage));

		try {
			await likeComment(commentId, newLikedState);
		} catch (error) {
			console.error("Failed to like comment:", error);
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

	async function handleSubmitRespond() {
		try {
			const commentInput = comment;
			setComment("");
			await addComment(currentBlog.id, commentInput, userName);
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

	return {
		currentBlog,
		dataComments,
		likedComments,
		userName,
		setUserName,
		comment,
		setComment,
		replyComment,
		setReplyComment,
		replyingTo,
		setReplyingTo,
		editingComment,
		setEditingComment,
		editContent,
		setEditContent,
		isEditingName,
		setIsEditingName,
		isAdmin,
		handleButtonNavigation,
		handleDeleteComment,
		handleEditComment,
		handleSaveEdit,
		toggleLike,
		handleNameEditToggle,
		handleSubmitRespond,
		handleReplySubmit,
	};
};
