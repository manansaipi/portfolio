import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import { AppContext } from "../../../App";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimateRef } from "../../../utils/animationUtils";
import { getAllWorks } from "../../../services/workService";

gsap.registerPlugin(ScrollTrigger);

const Content = ({}) => {
	const { handleButtonNavigation } = React.useContext(AppContext);
	const { entranceAnimationDone } = React.useContext(AppContext);
	const [dataWork, setData] = useState([]);

	const whatRef = useRef();
	const descriptionRef = useRef();

	useLayoutEffect(() => {
		let ctx = gsap.context(() => {
			AnimateRef(whatRef);
			AnimateRef(descriptionRef);
		});
		return () => ctx.revert();
	}, [entranceAnimationDone]);

	// fetch api example
	useEffect(() => {
        const fetchData = async () => {
			try {
				const res = await getAllWorks();
				setData(res);
				
			} catch (error) {
				console.error("Error fetching works:", error);
			}
		};

		fetchData();

    },[]);

	useEffect(() => {
		if (dataWork.length > 0) {
			console.log("Fetched Works:", dataWork);
		}
	}, [dataWork]);


	return (
		<div className=" bg-light-dark text-primary  transition-all">
			<div className=" flex flex-col p-5 py-5 pb-10 md:p-15 lg:px-25 xl:pt-20 xl:px-50 overflow-hidden">
				<div className="overflow-hidden" ref={whatRef}>
					<div className="text-5xl lg:text-6xl tracking-widest text-color-text-hovering">
						WHAT
					</div>
					<div className="text-7xl  lg:text-8xl xl:text-9xl font-bold tracking-widest">
						I DO?
					</div>
				</div>
				<div
					ref={descriptionRef}
					className="flex flex-col md:flex-row gap-10 pt-10 overflow-hidden"
				>
					<div className="w-full text-2xl lg:text-3xl xl:text-4xl ">
						Build digital things that make the complex feel simple. Clean logic,
						smooth interactions, real impact.
					</div>
					<div className="flex flex-col w-1/2 lg:text-lg xl:text-xl">
						<div>
							I turn problems into products. Every line of code is written with
							clarity and purpose.
						</div>
					</div>
				</div>
				<div className="self-start md:self-end mt-10 md:mt-15">
					<PrimaryButton
						handleOnClick={() => handleButtonNavigation("/about")}
						label={"ABOUT ME"}
					/>
				</div>
			</div>
		</div>
	);
};

export default Content;
