import React from "react";
import { Outlet, useLocation, useMatch, useNavigate } from "react-router";
import ExperienceEntrance from "@pages/Experience/components/ExperienceEntrance/ExperienceEntrance";

const Experience = () => {
	return (
		<div class="overflow-x-hidden">
			{/* <ExperienceEntrance /> */}
			{/* i think better not using outlet here  */}
			<Outlet />
		</div >
	);
};

export default Experience;
