import React, { useReducer, useRef } from "react";
import { AppContext } from "../../../App";
import {
	handleImageNavigation,
	slugify,
} from "../../../utils/NavhiagtionImageAnimation";
import { useLinkClickHandler, useNavigate } from "react-router";
import { useLenis } from "lenis/react";

const ListRecentWorkMobile = ({ works }) => {
	const { handleButtonNavigation } = React.useContext(AppContext);

	const { navbarRef } = React.useContext(AppContext);
	const { preloaderRef } = React.useContext(AppContext);
	const lenis = useLenis();
	const navigate = useNavigate();

	const imageRefs = useRef([]);

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-10">
			{works.slice(0, 3).map((work, index) => {
				return (
					<a
						key={work.id}
						onClick={() =>
							handleImageNavigation(
								`/work/${slugify(work.company)}`,
								imageRefs.current[index],
								navbarRef,
								preloaderRef,
								lenis,
								navigate
							)
						}
						data-name="view"
						className={`flex flex-col
							                ${index === 2 ? "md:col-span-2" : ""} 
							gap-5 text-white h-full w-full group`}
					>
						<div className={`h-[50vh]  ${work.bgColor} pointer-events-none `}>
							<div className="px-5 w-full h-full flex items-center justify-center ">
								<img
									ref={(el) => (imageRefs.current[index] = el)}
									className="h-[40vh] shadow-lg shadow-black transition-transform duration-500 ease-in-out group-hover:scale-102 object-cover"
									src={work.img}
									alt=""
								/>
							</div>
						</div>
						<div className="pointer-events-none text-primary">
							<div className="text-3xl">{work.company} </div>
							<div className=" border-b-1 my-5"></div>
							<div className="flex justify-between ">
								<div>{work.role}</div>
								<div>
									{work.startDate} &nbsp;-&nbsp; {work.endDate}
								</div>
							</div>
						</div>
					</a>
				);
			})}
		</div>
	);
};

export default ListRecentWorkMobile;
