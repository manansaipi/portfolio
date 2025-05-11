import React, { useRef } from "react";
import { Router, useLocation, useNavigate } from "react-router";
import { AnimatePageTransition } from "../PreLoader/AnimatePageTransition";

const TransitionLink = ({ preloaderRef, preloaderTextRef, href, label }) => {
	const navigate = useNavigate();
	const location = useLocation();

	console.log(location.pathname);
	console.log(href);
	const handleClick = () => {
		if (location.pathname !== href) {
			AnimatePageTransition({
				preloaderRef,
				preloaderTextRef,
				href,
				navigate,
			});
		}
	};

	return (
		<>
			<a onClick={handleClick}>{label}</a>
		</>
	);
};

export default TransitionLink;
