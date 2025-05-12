import React, { useEffect, useState, useRef } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { Outlet, useLocation } from "react-router";

import CustomCursor from "./components/CustomCursor";
import PreLoader from "./components/PreLoader/PreLoader";

import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Experience from "./pages/Experience/Experience";
import Contact from "./pages/Contact/Contact";
import Footer from "./components/Footer/Footer";
// import Entrance from "./components/Entrance/Entrance";
export const AppContext = React.createContext({});

const App = () => {
	const [animationDone, setAnimationDone] = useState(false);
	const location = useLocation();
	const [showTransition, setShowTransition] = useState(false);
	const preloaderRef = useRef();
	const preloaderTextRef = useRef();

	useEffect(() => {
		if (location.pathname != "/" || location.pathname != "/home") {
			setShowTransition(true);
		}
		const timer = setTimeout(() => {
			setShowTransition(false);
		}, 3000); // show for 1 second (adjust as needed)

		return () => clearTimeout(timer);
	}, [location.pathname]); // Trigger on every route change

	// AnimatePageIn();
	return (
		<>
			<AppContext.Provider value={{ preloaderRef }}>
				<ReactLenis root>
					<CustomCursor />
					<PreLoader
						setAnimationDone={setAnimationDone}
						preloaderRef={preloaderRef}
						preloaderTextRef={preloaderTextRef}
					/>
					{/* <TransitionPage /> */}
					<Navbar
						preloaderRef={preloaderRef}
						preloaderTextRef={preloaderTextRef}
					/>
					<Outlet context={animationDone} />
					{animationDone ? <Footer preloaderRef={preloaderRef} /> : <></>}
				</ReactLenis>
			</AppContext.Provider>
		</>
	);
};

export default App;
// TODO : WEB PORTOFOLIO TERMINAL/CMD STYLEhttps://www.youtube.com/watch?v=L-7Rofs-zTM&ab_channel=MuhammadIqbalAlaydrus
// WEBSITE AWARD https://dennissnellenberg.com/ (https://blog.olivierlarose.com/tutorials/awwwards-landing-page), https://zentry.com/
// WEB IDEA : https://minimal.gallery/, https://www.darkmodedesign.com/, https://www.cssdesignawards.com/sites/above-the-clouds-111w-57s/47359/,  , https://www.awwwards.com/#nominees,
// https://justgowiththeflow.com/
// https://www.chiara-hofmayer.de/en
// https://alvalens-k2ihpke38-alvalens-projects.vercel.app/projects/archive
// website idea : https://readymag.com/examples/portfolio ,
//  https://michaelwatchmaker.com/about/
