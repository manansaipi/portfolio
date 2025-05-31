import React from "react";
import HomeRecentWork from "./HomeRecentWork/HomeRecentWork";
import HomeEntrance from "./HomeEntrance/HomeEntrance";
import HomeAbout from "./HomeAbout/HomeAbout";
import HomeProject from "./HomeProject/HomeProject";
import HomeBlog from "../Home/HomeBlog/HomeBlog";
import { AppContext } from "../../App";

const Home = () => {
	const { entranceAnimationDone } = React.useContext(AppContext);

	return (
		<>
			<HomeEntrance></HomeEntrance>
			{entranceAnimationDone && (
				<>
					<HomeAbout></HomeAbout>
					<HomeRecentWork></HomeRecentWork>
					{/* <HomeProject></HomeProject> */}
					<HomeBlog />
				</>
			)}
		</>
	);
};

export default Home;
