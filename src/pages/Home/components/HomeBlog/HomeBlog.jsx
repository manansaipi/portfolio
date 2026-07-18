import React from "react";
import PrimaryButton from "@components/ui/Buttons/PrimaryButton";
import { useHomeBlog } from "./useHomeBlog";
import dayjs from "dayjs";
import { prefetchComments } from "@services/postService";

const HomeBlog = () => {
	const {
		blogs,
		titleRef,
		imageRefs,
		onImageNavigate,
		handleButtonNavigation,
	} = useHomeBlog();

	return (
		<div className="bg-light-dark  text-primary pb-20 mb:pb-30 lg:pb-50">
			<div className=" pt-20 lg:pt-30 px-5 pb-10 md:pb-20 ">
				<div
					ref={titleRef}
					className="flex flex-row  w-full overflow-hidden"
				>
					<div className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl  font-bold">
						WRITING
					</div>
					<div className="">
						{/* <PrimaryButton label={"VIEW ALL"}></PrimaryButton> */}
					</div>
				</div>
				<div className="flex flex-col md:flex-row gap-5 ">
					{blogs.slice(0, 2).map((blog, index) => (
						<a
							key={index}
							onClick={() => onImageNavigate(blog, index)}
                            onMouseEnter={() => prefetchComments(blog.id)}
							data-name="view"
							className="group w-full cursor-none"
						>
							<div className="my-2 pointer-events-none overflow-hidden w-full  min-h-[30vh] max-h-[50vh] ">
								<img
									ref={(el) => (imageRefs.current[index] = el)}
									className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out w-full max-h-[70vh] "
									src={blog.image}
									alt="img"
								/>
							</div>
							<div
								data-name="view"
								className="text-2xl font-bold"
							>
								{blog.title}
							</div>

							<div
								data-name="view"
								className="text-color-text-hovering  text-sm font-bold tracking-[2px] uppercase mt-2"
							>
								{dayjs(blog.published_at).format("MMM D, YYYY")}
							</div>
						</a>
					))}
				</div>
			</div>
			<div className="flex  items-center justify-center">
				<PrimaryButton
					handleOnClick={() => handleButtonNavigation("/blog")}
					label={"VIEW ALL"}
				/>
			</div>
		</div>
	);
};

export default HomeBlog;
