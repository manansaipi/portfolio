import React from "react";
import CustomCursor from "./CustomCursor";
import PreLoader from "./components/PreLoader";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Experience from "./components/Experience/Experience";
import Contact from "./components/Contact/Contact";
// import Entrance from "./components/Entrance/Entrance";

const App = () => {
	return (
		<>
			<CustomCursor />
			<PreLoader />
			<Navbar />
			<Home />
			<Contact />
			{/* <Experience /> */}
			{/* <Entrance /> */}
			{/* <About /> */}
		</>
	);
};

export default App;
// TODO : WEB PORTOFOLIO TERMINAL/CMD STYLEhttps://www.youtube.com/watch?v=L-7Rofs-zTM&ab_channel=MuhammadIqbalAlaydrus
