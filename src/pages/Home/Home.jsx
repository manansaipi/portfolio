import React from "react";
import HomeRecentWork from "@pages/Home/components/HomeRecentWork/HomeRecentWork";
import HomeEntrance from "@pages/Home/components/HomeEntrance/HomeEntrance";
import HomeAbout from "@pages/Home/components/HomeAbout/HomeAbout";
import HomeProject from "@pages/Home/components/HomeProject/HomeProject";
import HomeBlog from "@pages/Home/components/HomeBlog/HomeBlog";
import { AppContext } from "@/App";

const Home = () => {
	const { entranceAnimationDone } = React.useContext(AppContext);

	return (
		<>
			<HomeEntrance></HomeEntrance>
			
			<div style={{ display: entranceAnimationDone ? 'block' : 'none' }}>
				<HomeAbout />
				<HomeRecentWork />
				<HomeBlog />
			</div>

		</>
	);
};

export default Home;
