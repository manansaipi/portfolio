import { useLayoutEffect, useRef, useState, useEffect, useContext } from "react";
import { AppContext } from "@/App";
import { getAllWritings } from "@services/post";
import { AnimateRef } from "@utils/animationUtils";
import { useNavigate } from "react-router";
import { useLenis } from "lenis/react";
import { slugify, handleImageNavigation } from "@utils/navigationImageAnimation.js";
import gsap from "gsap";

export const useHomeBlog = () => {
	const {
		handleButtonNavigation,
		entranceAnimationDone,
		navbarRef,
		preloaderRef,
	} = useContext(AppContext);

	const lenis = useLenis();
	const navigate = useNavigate();
	const titleRef = useRef();
	const imageRefs = useRef([]);

	const [blogs, setBlogs] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchBlogs = async () => {
			try {
				const data = await getAllWritings();
				setBlogs(data);
			} catch (error) {
				console.error("Error fetching blogs:", error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchBlogs();
	}, []);

	useLayoutEffect(() => {
		let ctx = gsap.context(() => {
			AnimateRef(titleRef);
		});
		return () => ctx.revert();
	}, [entranceAnimationDone]);

	const onImageNavigate = (blog, index) => {
		handleImageNavigation(
			`/blog/${slugify(blog.title)}`,
			imageRefs.current[index],
			navbarRef,
			preloaderRef,
			lenis,
			navigate,
			{ blog }
		);
	};

	return {
		blogs,
		titleRef,
		imageRefs,
		onImageNavigate,
		handleButtonNavigation,
		isLoading,
	};
};
