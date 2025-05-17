import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import HomeRecentWork from "./HomeRecentWork/HomeRecentWork";
import { AppContext } from "../../App";
import HomeEntrance from "./Entrance/HomeEntrance";
import HomeAbout from "./HomeAbout/HomeAbout";

const Home = ({ animationDone, handleButtonNavigation }) => {
	return (
		<>
			<HomeEntrance></HomeEntrance>
			{animationDone && (
				<>
					<HomeAbout></HomeAbout>
					<HomeRecentWork></HomeRecentWork>
				</>
			)}
		</>
	);
};

export default Home;
