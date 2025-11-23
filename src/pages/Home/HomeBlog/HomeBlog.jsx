import React, { useLayoutEffect, useRef } from "react";
import blogs from "../../../consts/Blogs";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import { AppContext } from "../../../App";
import { AnimateRef } from "../../../utils/animationUtils";
import gsap from "gsap";
import { useNavigate } from "react-router";
import { useLenis } from "lenis/react";
import {
	slugify,
	handleImageNavigation,
} from "../../../utils/NavhiagtionImageAnimation";

const HomeBlog = () => {
	const {
		handleButtonNavigation,
		entranceAnimationDone,
		navbarRef,
		preloaderRef,
	} = React.useContext(AppContext);

	const lenis = useLenis();
	const navigate = useNavigate();
	const titleRef = useRef();
	const imageRefs = useRef([]);

	useLayoutEffect(() => {
		let ctx = gsap.context(() => {
			AnimateRef(titleRef);
		});
		return () => ctx.revert();
	}, [entranceAnimationDone]);

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
							data-name="view"
							className="group w-full"
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
								className="text-color-text-hovering  text-sm font-bold"
							>
								{blog.date}
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
