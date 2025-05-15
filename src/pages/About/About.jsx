import React from "react";
import UnderDevelopment from "../UnderDevelopment/UnderDevelopment";
import profileAboutImg from "../../assets/img/profiles/bobenprofile.jpeg"; // adjust the path as needed

const About = () => {
	return (
		// <UnderDevelopment
		// 	title="About Page"
		// 	message="About me? Good question. I’m still deciding how to tell my story without sounding like a superhero origin story. "
		// />
		<>
			<div className="h-[200vh] bg-light-dark text-primary text-3xl p-5 pt-10 ">
				<div className="px-5 md:px-20 z-10">
					<div className="">
						Build digital things that work beautifully and feel easy.
					</div>
					<div className="border-t-[1px] my-15 text-color-text-hovering"></div>
					<div className="flex flex-col lg:flex-row">
						<div className="text-sm lg:w-[40vh] lg:pr-10">
							<div>
								Hi! I’m Ben, a software developer with experience in web,
								mobile, and machine learning application development. Proficient
								in full-stack development, with expertise in designing,
								building, and deploying scalable applications on cloud platforms
							</div>
							<div className="mt-5 text-color-text-hovering animate-pulse mb-10">
								Always exploring...
							</div>
						</div>
						<div className="bg-black h-[70vh] ">
							<img
								className="h-full object-cover object-[55%]"
								src={profileAboutImg}
								alt=""
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default About;
