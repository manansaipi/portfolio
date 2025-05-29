import React, { useEffect } from "react";
import { AppContext } from "../../../App";
import slugify from "../../Experience/slugifyHelper";

const ListRecentWorkLarge = ({ works, handleHover }) => {
	const { handleButtonNavigation } = React.useContext(AppContext);

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
							key={work.id}
							data-name="view"
							onMouseEnter={() => {
								handleHover("enter", index);
							}}
							onClick={() =>
								handleButtonNavigation(
									`/work/${slugify(work.company)}`
									// imageRefs.current[index]
								)
							}
							className="hover:text-color-text-hovering transition-all duration-300 ease-out hover:-translate-x-1"
						>
							<div className="border-t-1 border-color-text-hovering pointer duration-0 hover:translate-x-0"></div>
							<div className="flex flex-row justify-between items-center m-10 xl:my:15 xl:mx-25 2xl:mx-35 pointer-events-none hover:text-color-text-hovering transition-all duration-300 ease-out hover:-translate-y-1">
								<div className="flex flex-col ">
									<div
										data-name="view"
										className="text-5xl xl:text-6xl 2xl:text-7xl"
									>
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
