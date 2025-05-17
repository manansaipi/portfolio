import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import HomeRecentWork from "./HomeRecentWork/HomeRecentWork";
import { AppContext } from "../../App";
import HomeEntrance from "./Entrance/HomeEntrance";
import HomeAbout from "./HomeAbout/HomeAbout";

const Home = ({ entranceAnimationDone, handleButtonNavigation }) => {
	return (
		<>
			<HomeEntrance entranceAnimationDone={entranceAnimationDone}></HomeEntrance>
			{entranceAnimationDone && (
				<>
					<HomeAbout></HomeAbout>
					<HomeRecentWork></HomeRecentWork>
				</>
			)}
		</>
	);
};

export default Home;
