import React, { useEffect, useState } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { Outlet } from "react-router";

import CustomCursor from "./components/CustomCursor";
import PreLoader from "./components/PreLoader";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Experience from "./pages/Experience/Experience";
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
				<Outlet />
				{animationDone && (
					<>
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
// WEB IDEA : https://minimal.gallery/, https://www.darkmodedesign.com/, https://www.cssdesignawards.com/sites/above-the-clouds-111w-57s/47359/,  , https://www.awwwards.com/#nominees, https://justgowiththeflow.com/
// https://www.chiara-hofmayer.de/en
// https://alvalens-k2ihpke38-alvalens-projects.vercel.app/projects/archive
// website idea : https://readymag.com/examples/portfolio ,
//  https://michaelwatchmaker.com/about/
