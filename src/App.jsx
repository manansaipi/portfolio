import React, { useEffect, useState, useRef } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { Outlet, useLocation, useNavigate } from "react-router";

import CustomCursor from "./components/CustomCursor";
import PreLoader from "./components/PreLoader/PreLoader";

import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Footer from "./components/Footer/Footer";
import { AnimatePageTransition } from "./components/PreLoader/AnimatePageTransition";

export const AppContext = React.createContext({});

const App = () => {
	const [entranceAnimationDone, setEntranceAnimationDone] = useState(false);
	const location = useLocation();
	const preloaderRef = useRef();
	const navbarRef = useRef();
	const navigate = useNavigate();
	const lenis = useLenis();

	const isHome = location.pathname === "/" || location.pathname === "/home";

	function handleButtonNavigation(href) {
		if (location.pathname != href) {
			AnimatePageTransition({
				preloaderRef,
				navbarRef,
				lenis,
				href,
				navigate,
			});
		}
	}

	return (
		<>
			<AppContext.Provider
				value={{ preloaderRef, navbarRef, handleButtonNavigation }}
			>
				<ReactLenis root>
					<CustomCursor />
					<PreLoader
						setEntranceAnimationDone={setEntranceAnimationDone}
						preloaderRef={preloaderRef}
					/>
					<div ref={navbarRef}>
						<Navbar />
					</div>
					<div className={isHome ? "" : "hidden"}>
						<Home entranceAnimationDone={entranceAnimationDone} />
					</div>
					<div className={isHome ? "hidden" : ""}>
						<Outlet />
					</div>

					{entranceAnimationDone && <Footer />}
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
// showcase more work section :  https://www.orchestraco.com/careers
// can be blog page show case section : https://www.orchestraco.com/insights or https://www.sublimio.com/upstairz/
// blog : https://www.sublimio.com/leaving-a-mark-our-vision-on-logo-design/
// blog main page : https://www.sublimio.com/leaving-a-mark-our-vision-on-logo-design/
// blog can be like this https://citizenofnowhe.re/blog/gfx100rf-first-impressions
//https://davidpacheco.co/

 // \Developed and maintained backend logic modules using Java and BizActor to support core MES operations across factories in multiple countries.
// •
// Utilized SQL Server Management Studio (SSMS) to analyze production data and validate backend feature requests for performance and accuracy.
// •
// Collaborated with QA and manufacturing teams to maintain and scale backend services across production lines.