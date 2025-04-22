import React from "react";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Navbar from "./components/Navbar/Navbar";
import CustomCursor from "./CustomCursor";
import Entrance from "./components/Entrance/Entrance";

const App = () => {
	return (
		<>
			<CustomCursor />
			<Navbar />
			<Home />
			<Entrance />
			<About />
			{/* <About /> */}
		</>
	);
};

export default App;
