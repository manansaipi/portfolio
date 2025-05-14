import React from "react";
import Magnet from "../../components/Magnet";
import TransitionLink from "../../components/Navbar/TransitionLink";
import { AppContext } from "../../App";
import bobendpr from "../../assets/img/profiles/bobendpr.jpg"; // adjust the path as needed

const Content = () => {
	const { preloaderRef } = React.useContext(AppContext);

	return (
		<div className=" bg-light-dark text-primary  transition-all">
			{/* <div className=" relative -mt-[10vh] bg-black w-full h-[40vw]   max-h-[50vh]  text-white  ">
				<img
					src={bobendpr}
					className="w-full h-full object-cover absolute object-[25%_70%] "
					alt=""
				/>
			</div> */}
			<div className=" flex flex-col p-5 py-5 pb-10 md:p-15 lg:px-25 xl:pt-20 xl:px-50">
				<div className="text-6xl lg:text-7xl xl:text-8xl tracking-widest text-color-text-hovering">
					what
				</div>
				<div className="text-7xl  lg:text-8xl xl:text-9xl font-bold tracking-widest">
					I DO?
				</div>
				<div className="flex flex-col md:flex-row gap-10 pt-10 ">
					<div className="w-full text-2xl lg:text-3xl xl:text-4xl ">
						Build digital things that make the complex feel simple. Clean logic,
						smooth interactions, real impact.
					</div>
					<div className="flex flex-col gap-10 md:gap-15 w-1/2 lg:text-lg xl:text-xl">
						<div>
							I turn problems into products. Every line of code is written with
							clarity and purpose.
						</div>
						<div className="border px-8 py-1 text-lg flex items-center justify-center rounded-xm cursor-pointer md:cursor-none hover:border-color-text-hovering self-start ">
							<Magnet magnetStrength={4}>
								<TransitionLink
									preloaderRef={preloaderRef}
									href={"/about"}
									label={"ABOUT ME"}
								></TransitionLink>
							</Magnet>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Content;
