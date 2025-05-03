import React, { useEffect, useState } from "react";
import { ReactLenis, useLenis } from "lenis/react";

import CustomCursor from "./CustomCursor";
import PreLoader from "./components/PreLoader";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Experience from "./components/Experience/Experience";
import Contact from "./components/Contact/Contact";
// import Entrance from "./components/Entrance/Entrance";

const App = () => {
	const [animationDone, setAnimationDone] = useState(false);

	// Prevent browser from restoring scroll position
	if ("scrollRestoration" in window.history) {
		window.history.scrollRestoration = "manual";
	}

	useEffect(() => {
		window.scrollTo(0, 0); // Scroll to top on first load
	}, []);

	return (
		<>
			<ReactLenis root>
				<CustomCursor />
				<PreLoader setAnimationDone={setAnimationDone} />
				<Navbar />
				<Home />
				{animationDone && (
					<>
						{/* <About /> */}
						{/* <Experience /> */}
						<Contact />
					</>
				)}
			</ReactLenis>
		</>
	);
};

export default App;
// TODO : WEB PORTOFOLIO TERMINAL/CMD STYLEhttps://www.youtube.com/watch?v=L-7Rofs-zTM&ab_channel=MuhammadIqbalAlaydrus
// WEBSITE AWARD https://dennissnellenberg.com/ (https://blog.olivierlarose.com/tutorials/awwwards-landing-page), https://zentry.com/
// WEB IDEA : https://minimal.gallery/, https://www.darkmodedesign.com/, https://www.cssdesignawards.com/sites/above-the-clouds-111w-57s/47359/,  , https://www.awwwards.com/#nominees
