import React, { useRef, useLayoutEffect } from "react";
import { useBlogDetail } from "./useBlogDetail";
import CommentSection from "./components/CommentSection";
import PrimaryButton from "@components/ui/Buttons/PrimaryButton.jsx";
import { MdVerified } from "react-icons/md";
import authorImgDefault from "@assets/img/author/no_profile.jpeg";
import { resolveImg } from "@utils/imageUtils.js";
import dayjs from "dayjs";

const BlogDetail = () => {
	const handlers = useBlogDetail();
	const { currentBlog, dataComments, handleButtonNavigation } = handlers;

	const headerRef = useRef();
	const contentRef = useRef();
	const imageRef = useRef();

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
					className="text-lg leading-relaxed text-primary blog-content-html"
				>
					<div dangerouslySetInnerHTML={{ __html: currentBlog.content }} />
				</div>
			</div>

			<div className="px-5 md:px-20 lg:px-40 2xl:px-60">
				<div className="my-15 border-b-[1px] border-color-text-hovering "></div>
			</div>

			{/* Comment Section */}
			<CommentSection comments={dataComments} handlers={handlers} />
		</div>
	);
};

export default BlogDetail;
