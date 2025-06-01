import React from "react";
import blogs from "./Blogs";

const AllBlog = () => {
	return (
		<div className="bg-background min-h-[100vh] text-primary ">
			<div className="py-[18vh] w-full px-5">
				{blogs.map((blog, index) => (
					<>
						<div className="flex flex-col gap-5">
							<div className="w-full text-3xl">{blog.title}</div>
							<div className="w-full text-lg text-color-text-hovering">
								Lorem ipsum dolor sit amet consectetur adipisicing elit.
								Accusamus, omnis. Lorem ipsum dolor sit amet. Lorem ipsum dolor
								sit amet.
							</div>
							<a data-name="view" className="mt-5 group overflow-hidden max-h-[50vh]">
								<img
									src={blog.image}
									alt="blog_image"
									className="-mt-5 w-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-500 ease-in-out"
								/>
							</a>
						</div>
						<div className=" flex  items-center justify-between mt-5 text-color-text-hovering text-[10px] mb-10">
							<div className=" flex items-center  gap-5">
								<img
									src="
                        https://www.sublimio.com/wp-content/uploads/2023/11/Matteo.png"
									alt="author_img"
									className="max-h-[5vh]"
								/>
								<div className="tracking-[2px] uppercase">BY {blog.author}</div>
							</div>
							<div className="tracking-[2px]">{blog.date}</div>
							{/* <div className="tracking-[2px]">5 MIN AGO</div> */}
						</div>
					</>
				))}
			</div>
		</div>
	);
};

export default AllBlog;
