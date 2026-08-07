import React, { useState, useLayoutEffect } from "react";
import AboutEntrance from "@pages/About/components/AboutEntrance/AboutEntrance";
import Certificate from "@pages/About/components/AboutCertificate/AboutCertificate";
const About = () => {
	const [viewportHeight, setViewportHeight] = useState(0);
	useLayoutEffect(() => {
		setViewportHeight(window.innerHeight);
	}, []);

	return (
		<div className=" bg-light-dark text-primary overflow-x-hidden" style={{ paddingTop: viewportHeight ? `${viewportHeight * 0.20}px` : "20vh" }}>
			<AboutEntrance />
			<Certificate />
		</div>
	);
};

export default About;
