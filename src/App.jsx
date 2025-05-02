import React from "react";
import PreLoader from "./components/PreLoader";
import Home from "./components/Home/home";
import About from "./components/About/About";
import Experience from "./components/Experience/Experience";
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
			<Experience />
			{/* <Entrance /> */}
			{/* <About /> */}
		</>
	);
};

export default App;
// TODO : WEB PORTOFOLIO TERMINAL/CMD STYLEhttps://www.youtube.com/watch?v=L-7Rofs-zTM&ab_channel=MuhammadIqbalAlaydrus
