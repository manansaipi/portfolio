import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import authorImg from "@assets/img/author/no_profile.jpeg";
import { AnimateHeader } from "@components/layout/PreLoader/AnimatePageTransition";
import {
	slugify,
	handleImageNavigation,
} from "@utils/navigationImageAnimation.js";
import { useNavigate } from "react-router";
import { useLenis } from "lenis/react";
import { AppContext } from "@/App";
import { getAllWritings } from "@services/postService";
import dayjs from "dayjs";

const AllBlog = () => {
	const { navbarRef, preloaderRef } = React.useContext(AppContext);
	const lenis = useLenis();
	const navigate = useNavigate();

	const headerContainerRef = useRef([]);
	const imageRefs = useRef([]);
	const [blogs, setBlogs] = useState([]);

	const resolveImg = (imgStr, defaultImg) => {
		if (!imgStr) return defaultImg;
		if (imgStr.startsWith("/static")) return `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}${imgStr}`;
		if (imgStr.startsWith("@assets")) return defaultImg;
		return imgStr;
	};

	useEffect(() => {
		const fetchBlogs = async () => {
			const data = await getAllWritings();
			setBlogs(data);
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

	return (
		<div className="bg-background min-h-[100vh] text-primary ">
			<div className="lg:grid lg:grid-cols-2 py-[18vh] md:pt-[20vh] lg:pt-[40vh] w-full px-5 md:px-15 ">
				{blogs.map((blog, index) => (
					<div
						key={index}
						className={`flex flex-col  lg:gap-5 mb-10 md:mb-20 ${
							index == 0 ? "lg:mb-20 lg:col-span-2" : "lg:w-[40vw] lg:mx-10"
						}`}
					>
						<div
							className={`${
								index == 0 ? "lg:px-35 xl:px-70  2xl:px-100 " : ""
							}  `}
						>
							<div
								ref={(element) => (headerContainerRef.current[index] = element)}
								className={`flex flex-col relative ${
									index == 0 ? "lg:flex-row lg:gap-10" : " "
								} mb-5`}
							>
								<div className="w-full text-3xl lg:text-4xl">{blog.title}</div>
								<div className="w-full text-lg text-color-text-hovering line-clamp-3">
									{blog.content ? blog.content.replace(/<[^>]*>?/gm, '') : "No content available."}
								</div>
							</div>

							{/* large author */}
							<div
								className={`hidden  ${
									index == 0 ? "lg:mb-10 lg:flex" : ""
								}  items-center justify-between text-color-text-hovering text-[10px]  `}
							>
								<div className=" flex items-center gap-5 ">
									<img
										src={resolveImg(blog.author_img, authorImg)}
										alt="author_img"
										className="max-h-[5vh] rounded-full object-cover"
									/>
									<div className="tracking-[2px] uppercase">
										BY {blog.author}
									</div>
								</div>
								<div className="tracking-[2px]">{dayjs(blog.published_at).format("MMM D, YYYY")}</div>
								{/* <div className="tracking-[2px]">5 MIN AGO</div> */}
							</div>
						</div>

						{/* blog img */}
						<a
							data-name="view"
							onClick={() =>
								handleImageNavigation(
									`/blog/${slugify(blog.title)}`,
									imageRefs.current[index],
									navbarRef,
									preloaderRef,
									lenis,
									navigate
								)
							}
							className={` group overflow-hidden max-h-[50vh] ${
								index == 0
									? "lg:max-h-[80vh]  lg:mx-15 xl:mx-25 2xl:mx-40 "
									: ""
							}`}
						>
							<img
								ref={(el) => (imageRefs.current[index] = el)}
								src={blog.image}
								alt="blog_image"
								className={`-mt-5 w-full ${
									index == 0 ? "" : "lg:h-[35vh] xl:h-[50vh]"
								} object-cover pointer-events-none group-hover:scale-105 transition-transform duration-500 ease-in-out`}
							/>
						</a>

						{/* small author */}
						<div
							className={`flex  ${
								index == 0 ? "lg:hidden" : "lg:flex"
							}   items-center justify-between text-color-text-hovering text-[10px] mt-5`}
						>
							<div className=" flex items-center  gap-5">
								<img
									src={resolveImg(blog.author_img, authorImg)}
									alt="author_img"
									className="max-h-[5vh] rounded-full object-cover"
								/>
								<div className="tracking-[2px] uppercase">BY {blog.author}</div>
							</div>
							<div className="tracking-[2px]">{dayjs(blog.published_at).format("MMM D, YYYY")}</div>
							{/* <div className="tracking-[2px]">5 MIN AGO</div> */}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default AllBlog;
