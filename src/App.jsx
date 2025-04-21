import React from "react";
import Home from "./components/Home/home";
import About from "./components/About/about";
import Navbar from "./components/Navbar/Navbar";
import CustomCursor from "./CustomCursor";
import Entrance from "./components/Entrance/Entrance";

const App = () => {
    return (
        <>
            <CustomCursor />
            <Navbar />
            <Entrance />
            <Home />
            {/* <About /> */}
        </>
    );
};

export default App;
