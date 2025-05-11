import React from "react";
import Main from "./Main";
import Content from "./Content";
import TransitionPage from "../../components/TransitionPage/TransitionPage";
import { useOutletContext } from "react-router";

const Home = () => {
	const animationDone = useOutletContext();
	return (
		<>
			<Main></Main>
			{animationDone ? <Content></Content> : <></>}
		</>
	);
};

export default Home;
