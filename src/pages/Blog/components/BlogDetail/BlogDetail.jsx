import React, { useRef, useLayoutEffect, useState } from "react";
import { useBlogDetail } from "./useBlogDetail";
import CommentSection from "./components/CommentSection";
import PrimaryButton from "@components/ui/Buttons/PrimaryButton.jsx";
import { MdVerified } from "react-icons/md";
import authorImgDefault from "@assets/img/author/no_profile.webp";
import { resolveImg } from "@utils/imageUtils.js";
import dayjs from "dayjs";
import ImageCarousel from "@components/ui/ImageCarousel/ImageCarousel";
import { Helmet } from "react-helmet-async";

const BlogDetail = () => {
	const handlers = useBlogDetail();
	const { currentBlog, dataComments, handleButtonNavigation, isLoading } = handlers;

	const headerRef = useRef();
	const contentRef = useRef();
	const imageRef = useRef();

	useLayoutEffect(() => {
		if (currentBlog && imageRef.current) {
			imageRef.current.classList.remove("z-7");
		}
	}, [currentBlog]);

	if (isLoading) {
		return <div className="min-h-screen bg-background text-primary"></div>;
	}

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

	let parsedImages = [];
	try {
		if (currentBlog.images) {
			parsedImages = JSON.parse(currentBlog.images);
		}
	} catch (e) {}

	// Prepend main image to the front of the carousel if we have a main image
	let allImages = [];
	if (currentBlog.image) allImages.push(currentBlog.image);
	if (parsedImages.length > 0) allImages = [...allImages, ...parsedImages];

	const [viewportHeight, setViewportHeight] = useState(0);
	useLayoutEffect(() => {
		setViewportHeight(window.innerHeight);
	}, []);

	return (
		<div 
			className="min-h-screen bg-background text-primary pb-50"
			style={{
				"--vh-5": viewportHeight ? `${viewportHeight * 0.05}px` : "5vh",
				"--vh-70": viewportHeight ? `${viewportHeight * 0.70}px` : "70vh"
			}}
		>
			{/* Image Header */}
			<div className="relative w-full overflow-hidden h-[var(--vh-70)]">
				{allImages.length > 1 ? (
					<ImageCarousel
						ref={imageRef}
						images={allImages}
						className="h-[var(--vh-70)] w-full object-cover absolute z-7 shadow-lg shadow-black"
						autoSlideInterval={5000}
					/>
				) : (
					<img
						ref={imageRef}
						src={currentBlog.image}
						alt="Blog header"
						className="h-[var(--vh-70)] w-full object-cover absolute z-7 shadow-lg shadow-black"
						onError={(e) => {
							e.target.onerror = null;
							e.target.src = `https://placehold.co/800x450/333333/FFFFFF?text=Image+Not+Found`;
						}}
					/>
				)}
			</div>

			{/* Main Content */}
			<div className="pt-[var(--vh-5)] px-5 md:px-20 lg:px-40 2xl:px-60 flex flex-col gap-8">
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
					className="text-lg leading-relaxed text-primary blog-content-html break-words overflow-hidden"
				>
					<div dangerouslySetInnerHTML={{ 
						__html: currentBlog.content
							.replace(/&nbsp;/g, ' ')
							.replace(/<p><\/p>/g, '<p><br></p>')
							.replace(/\\"/g, '"')
							.replace(/\\n/g, '<br />')
							.replace(/\n/g, '<br />') 
					}} />
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
