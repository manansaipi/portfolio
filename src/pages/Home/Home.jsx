import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import HomeRecentWork from "./HomeRecentWork/HomeRecentWork";
import { AppContext } from "../../App";
import Intro from "./Intro/Intro";
import HomeAbout from "./HomeAbout/HomeAbout";

const Home = ({ animationDone, handleButtonNavigation }) => {
    return (
        <>
            <Intro></Intro>
            {animationDone && (
                <>
                    <HomeAbout
                    ></HomeAbout>
                    <HomeRecentWork
                    ></HomeRecentWork>
                </>
            )}
        </>
    );
};

export default Home;
