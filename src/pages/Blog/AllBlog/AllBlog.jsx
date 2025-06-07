import React from "react";
import blogs from "./Blogs";
import authorImg from "../../../assets/img/author/Matteo.jpg";

const AllBlog = () => {
	return (
		<div className="bg-background min-h-[100vh] text-primary ">
			<div className="py-[18vh] md:pt-[20vh] lg:pt-[40vh] w-full px-5 md:px-15 ">
				{blogs.map((blog, index) => (
					<>
						<div
							className={`flex flex-col lg:gap-5 mb-10 md:mb-20 ${
								index == 0 ? "lg:mb-20" : "lg:w-[40vw]"
							}`}
						>
							<div
								className={`${
									index == 0 ? "lg:px-35 xl:px-70  2xl:px-100 " : ""
								}  `}
							>
								<div
									className={`flex flex-col ${
										index == 0 ? "lg:flex-row lg:gap-10" : ""
									} mb-5`}
								>
									<div className="w-full text-3xl lg:text-4xl">{blog.title}</div>
									<div className="w-full text-lg text-color-text-hovering">
										Lorem ipsum dolor sit amet consectetur adipisicing elit.
										Accusamus, omnis. Lorem ipsum dolor sit amet. Lorem ipsum
										dolor sit amet.
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
											src={authorImg}
											alt="author_img"
											className="max-h-[5vh] "
										/>
										<div className="tracking-[2px] uppercase">
											BY {blog.author}
										</div>
									</div>
									<div className="tracking-[2px]">{blog.date}</div>
									{/* <div className="tracking-[2px]">5 MIN AGO</div> */}
								</div>
							</div>

							{/* img */}
							<a
								data-name="view"
								className={`mt-5 group overflow-hidden max-h-[50vh] bg-red-300 ${
									index == 0
										? "lg:max-h-[80vh] lg:mx-15 xl:mx-25 2xl:mx-40 "
										: ""
								}`}
							>
								<img
									src={blog.image}
									alt="blog_image"
									className="-mt-5 w-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-500 ease-in-out"
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
										src={authorImg}
										alt="author_img"
										className="max-h-[5vh]"
									/>
									<div className="tracking-[2px] uppercase">
										BY {blog.author}
									</div>
								</div>
								<div className="tracking-[2px]">{blog.date}</div>
								{/* <div className="tracking-[2px]">5 MIN AGO</div> */}
							</div>
						</div>
					</>
				))}
			</div>
		</div>
	);
};

export default AllBlog;
