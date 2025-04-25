import React from "react";
import PreLoader from "./components/PreLoader";
import Home from "./components/Home/home";
import About from "./components/About/About";
import Navbar from "./components/Navbar/Navbar";
import CustomCursor from "./CustomCursor";
import Entrance from "./components/Entrance/Entrance";

const App = () => {
    return (
        <>
            <CustomCursor />
            <PreLoader />
            <Navbar />
            <Home />
            <About />
            <Entrance />
            {/* <About /> */}
        </>
    );
};

export default App;
