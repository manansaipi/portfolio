import React, { useEffect, useRef, useState } from "react";
import { AppContext } from "../../../App";
import {
	handleWorkNavigation,
	slugify,
} from "../../../utils/experienceFunctionHelper";
import { useLinkClickHandler, useNavigate } from "react-router";
import { useLenis } from "lenis/react";

const ListRecentWorkLarge = ({ works, handleHover, imageRefs }) => {
	const { handleButtonNavigation } = React.useContext(AppContext);

	const { navbarRef } = React.useContext(AppContext);
	const { preloaderRef } = React.useContext(AppContext);
	const lenis = useLenis();
	const navigate = useNavigate();
	const [position, setPosition] = useState({ x: 0, y: 0 });

	let index = 0;
	const workListContainer = useRef([]);

	useEffect(() => {
		const moveCursor = (e) => {
			setPosition({ x: e.clientX, y: e.clientY });
		};

		window.addEventListener("mousemove", moveCursor);

		return () => {
			window.removeEventListener("mousemove", moveCursor);
		};
	}, []);

	useEffect(() => {
		const checkHoverOnScroll = () => {
			const { x, y } = position;

			let hovering = "out";

			// Check for elements with data-work="view"
			document.querySelectorAll("[data-work='view']").forEach((el) => {
				const rect = el.getBoundingClientRect();
				// console.log("🚀 ~ document.querySelectorAll ~ rect:", rect)
				if (x !== 0 && y !== 0) {
					if (
						x >= rect.left &&
						x <= rect.right &&
						y >= rect.top &&
						y <= rect.bottom
					) {
						hovering = "enter";
						index = parseInt(el.dataset.index, 10);
					}
				}
			});

			handleHover(hovering, index);
		};

		window.addEventListener("scroll", checkHoverOnScroll);
		return () => {
			window.removeEventListener("scroll", checkHoverOnScroll);
		};
	}, [position]);

	return (
		<div className="hidden lg:block text-primary">
			<div className=" mx-15 py-10 xl:mx-25 2xl:mx-35 text-xs xl:text-sm  text-color-text-hovering">
				RECENT WORK
			</div>
			<div
				onMouseLeave={() => {
					handleHover("out");
				}}
				className="flex flex-col text-primary"
			>
				{works.map((work, index) => {
					return (
						<a
							key={index}
							data-name="view"
							data-work="view"
							data-index={index}
							onMouseEnter={() => {
								handleHover("enter", index);
							}}
							onClick={() =>
								handleWorkNavigation(
									`/work/${slugify(work.company)}`,
									imageRefs.current[index],
									navbarRef,
									preloaderRef,
									lenis,
									navigate
								)
							}
							className="hover:text-color-text-hovering transition-all duration-300 ease-out hover:-translate-x-1"
						>
							<div className="border-t-1 border-color-text-hovering duration-0 hover:translate-x-0"></div>
							<div
								ref={(element) => (workListContainer.current[index] = element)}
								className="flex flex-row justify-between items-center m-10 xl:my:15 xl:mx-25 2xl:mx-35 hover:text-color-text-hovering transition-all duration-300 ease-out hover:-translate-y-1"
							>
								<div className="flex flex-col pointer-events-none ">
									<div className="text-5xl xl:text-6xl 2xl:text-7xl">
										{work.company}
									</div>
									<div className="text-lg xl:text-xl 2xl:text-2xl">
										{work.role}
									</div>
								</div>
								<div className="text-xs xl:text-sm 2xl:text-md">
									{work.startDate} &nbsp;-&nbsp; {work.endDate}
								</div>
							</div>
						</a>
					);
				})}
				<div className="border-t-1 border-color-text-hovering "></div>
			</div>
		</div>
	);
};

export default ListRecentWorkLarge;
