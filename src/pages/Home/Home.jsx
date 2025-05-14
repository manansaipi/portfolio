import React from "react";
import { useOutletContext } from "react-router";

import Intro from "./Intro";
import HomeAbout from "./HomeAbout";
import HomeRecentWork from "./HomeRecentWork";

const Home = ({ animationDone }) => {
    return (
        <>
            <Intro></Intro>
            {animationDone ? (
                <>
                    <HomeAbout></HomeAbout>
                    <HomeRecentWork></HomeRecentWork>
                </>
            ) : (
                <></>
            )}
        </>
    );
};

export default Home;
