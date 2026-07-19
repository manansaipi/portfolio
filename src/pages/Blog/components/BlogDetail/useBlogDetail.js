import { useState, useEffect, useLayoutEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { AppContext } from "@/App.jsx";
import { useToast } from "@components/ui/Toast/ToastProvider";
import {
	getAllWritings,
	getCommentByPostId,
	addComment,
	likeComment,
} from "@services/post";
import { slugify } from "@utils/navigationImageAnimation.js";

export const useBlogDetail = () => {
	const { blogId } = useParams();
	const { handleButtonNavigation, isAdmin } = useContext(AppContext);
	const navigate = useNavigate();
	const location = useLocation();
	const toast = useToast();

	const [currentBlog, setCurrentBlog] = useState(location.state?.blog || null);
	const [dataComments, setDataComments] = useState([]);
	const [comment, setComment] = useState("");
	const [replyingTo, setReplyingTo] = useState(null);
	const [editingComment, setEditingComment] = useState(null);
	const [editContent, setEditContent] = useState("");
	const [isEditingName, setIsEditingName] = useState(false);
	const [isLoading, setIsLoading] = useState(!location.state?.blog);
	const [isSubmittingComment, setIsSubmittingComment] = useState(false);
	const [submittingReplyId, setSubmittingReplyId] = useState(null);

	const resolveUserName = (isAdminUser) => {
		if (isAdminUser) return "Abdul Mannan Saipi";
		return localStorage.getItem("commentUserName") || "Anonymous";
	};

	const [userName, setUserName] = useState(() => resolveUserName(isAdmin));

	const [likedComments, setLikedComments] = useState(() => {
		const storedLikes = localStorage.getItem("likedComments");
		return storedLikes ? JSON.parse(storedLikes) : {};
	});

	useEffect(() => {
		localStorage.setItem("likedComments", JSON.stringify(likedComments));
	}, [likedComments]);

	useEffect(() => {
		setUserName(resolveUserName(isAdmin));
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
			const passedBlog = location.state?.blog;
			
			if (passedBlog) {
				// If blog is passed via router state, fetch comments immediately
				fetchData(passedBlog.id);
			} else {
				setIsLoading(true);
			}
			
			const fetchedBlogs = await getAllWritings();
			const foundBlog = fetchedBlogs.find((blog) => slugify(blog.title) === blogId);
			
			if (foundBlog) {
				if (!passedBlog) {
					await fetchData(foundBlog.id);
				}
				setCurrentBlog(foundBlog);
			}
			setIsLoading(false);
		};
		fetchCurrentBlog();
	}, [blogId]);

	const handleDeleteComment = async (commentId) => {
		if (!window.confirm("Are you sure you want to delete this comment?")) return;
		try {
			const { deleteComment } = await import("@services/admin");
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
			const { updateComment } = await import("@services/admin");
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
			setIsSubmittingComment(true);
			const commentInput = comment;
			await addComment(currentBlog.id, commentInput, userName);
			await fetchData(currentBlog.id);
			setComment("");
		} catch (error) {
			console.error("Error submitting response:", error);
		} finally {
			setIsSubmittingComment(false);
		}
	}

	async function handleReplySubmit(parentId, commentInput, onSuccess) {
		try {
			setSubmittingReplyId(parentId);
			await addComment(currentBlog.id, commentInput, userName, parentId);
			await fetchData(currentBlog.id);
			if (onSuccess) onSuccess();
			setReplyingTo(null);
		} catch (error) {
			console.error("Error submitting response:", error);
		} finally {
			setSubmittingReplyId(null);
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
		isLoading,
		isSubmittingComment,
		submittingReplyId,
	};
};
