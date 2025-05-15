import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import HomeRecentWork from "./HomeRecentWork/HomeRecentWork";
import { AppContext } from "../../App";
import Intro from "./Intro";
import HomeAbout from "./HomeAbout";

const Home = ({ animationDone, handleButtonNavigation }) => {
   

    

    return (
        <>
            {/* <Intro></Intro> */}
            {animationDone ? (
                <>
                    <HomeAbout handleButtonNavigation={handleButtonNavigation}></HomeAbout>
                    <HomeRecentWork
                        handleButtonNavigation={handleButtonNavigation}
                    ></HomeRecentWork>
                </>
            ) : (
                <></>
            )}
        </>
    );
};

export default Home;
