import { useLayoutEffect, useRef, useState, useEffect, useContext } from "react";
import { AppContext } from "@/App";
import { getAllWritings } from "@services/postService";
import { AnimateHeader } from "@components/layout/PreLoader/AnimatePageTransition";
import { useNavigate } from "react-router";
import { useLenis } from "lenis/react";
import { slugify, handleImageNavigation } from "@utils/navigationImageAnimation.js";

export const useAllBlog = () => {
	const { navbarRef, preloaderRef } = useContext(AppContext);
	const lenis = useLenis();
	const navigate = useNavigate();

	const headerContainerRef = useRef([]);
	const imageRefs = useRef([]);
	const [blogs, setBlogs] = useState([]);

	useEffect(() => {
		const fetchBlogs = async () => {
			try {
				const data = await getAllWritings();
				setBlogs(data);
			} catch (error) {
				console.error("Error fetching blogs:", error);
			}
		};
		fetchBlogs();
	}, []);

	useLayoutEffect(() => {
		if (blogs.length > 0 && headerContainerRef.current[0]) {
			AnimateHeader({
				headerContainerRef: { current: headerContainerRef.current[0] },
			});
		}
	}, [blogs]);

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
		headerContainerRef,
		imageRefs,
		onImageNavigate
	};
};
