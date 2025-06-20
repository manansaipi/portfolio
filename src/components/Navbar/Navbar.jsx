import React, { useRef, useState, useEffect } from "react";
import TogleTheme from "./TogleThemeButton";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

import FloatingNavbar from "./FloatingNavbar";
import OpenedNavbar from "./OpenedNavbar";
import NavbarLarge from "./NavbarLarge";
import { AppContext } from "../../App";

gsap.registerEase(CustomEase);
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(CustomEase);

const Navbar = ({}) => {
	const { entranceAnimationDone } = React.useContext(AppContext);

	
	const [isOpen, setIsOpen] = useState(false);
	const navbarRef = useRef();
	const navigationListRef = useRef();
	const socialMediaRef = useRef();
	const leftTextNavbarOpenRef = useRef();
	const logoRef = useRef();

	const handleOpenNavbar = () => {
		setIsOpen(!isOpen);

		if (!isOpen) {
			// open navbar
			navbarRef.current.style.display = "flex";
			gsap.fromTo(
				navbarRef.current,
				{ y: -500 },
				{
					y: 0,
					duration: 1,
					ease: "power4.out",
				}
			);

			// animate navList
			gsap.set(navigationListRef.current.children, { y: 100 });
			gsap.to(navigationListRef.current.children, {
				y: 0,
				duration: 0.5,
				stagger: 0.075,
			});
			// animate left text opened navbar
			gsap.set(leftTextNavbarOpenRef.current.children, { y: 100 });
			gsap.to(leftTextNavbarOpenRef.current.children, {
				y: 0,
				duration: 0.75,
				stagger: 0.075,
			});

			// animate social media
			gsap.set(socialMediaRef.current.children, { y: 50 });
			gsap.to(socialMediaRef.current.children, {
				y: 0,
				duration: 0.5,
				stagger: 0.075,
				delay: 0.3,
			});

			// hiding logoRef
			gsap.fromTo(
				logoRef.current,
				{
					opacity: 1,
				},
				{
					opacity: 0,
					duration: 0.3,
					ease: "power4.in",
				}
			);
		} else {
			// close navbar
			gsap.to(navbarRef.current, {
				y: -500,
				duration: 1.2,
				ease: CustomEase.create(
					"custom",
					"M0,0 C0.11,0.494 0.3,0.6 0.33,0.6 0.35,0.6 0.37,0.6 0.38,0.6 0.39,0.6 0.41,0.6 0.43,0.6 0.45,0.6 0.47,0.6 0.49,0.6 0.51,0.6 0.55,0.6 0.58,0.65 0.6 ,0.7 0.65,0.75 0.7,0.85 0.9,0.9 0.9,1 1,1 "
				),
				onComplete: () => {
					// hide the navbar if the navbar completely closed
					if (navbarRef.current.style.display == "translate(0px, -500px)") {
						navbarRef.current.style.display = "none";
					}
				},
			});
			gsap.to(logoRef.current, {
				opacity: 1,
				duration: 0.3,
			});
		}
	};

	useEffect(() => {
		// Click-outside handler
		const handleClickOutside = (event) => {
			if (
				isOpen && // when user click and vabar is open
				navbarRef.current &&
				!navbarRef.current.contains(event.target) && // when user click and it not contain navbar
				!event.target.closest(".open-navbar-button") &&
				!logoRef.current.contains(event.target)
			) {
				handleOpenNavbar();
			}
		};

		let resizeTimer;
		let vw = window.innerWidth;

		// close the navbar when user resizing the the screen to large size
		const handleResize = () => {
			clearTimeout(resizeTimer); // Clear the previous timeout
			resizeTimer = setTimeout(() => {
				vw = window.innerWidth;
				if (vw > 1024 && isOpen) {
					handleOpenNavbar();
				}
			}, 300); // Wait 300ms after the last resize
		};

		window.addEventListener("resize", handleResize);

		// Call once to check initial width
		handleResize();

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			window.removeEventListener("resize", handleResize);
		};
	}, [isOpen]);

	return (
		<>
			{/* FLOATING NAVBAR */}
			<FloatingNavbar
				logoRef={logoRef}
				isOpen={isOpen}
				handleOpenNavbar={handleOpenNavbar}
				entranceAnimationDone={entranceAnimationDone}
			/>

			{/* OPENED NAVBAR */}
			<OpenedNavbar
				navbarRef={navbarRef}
				leftTextNavbarOpenRef={leftTextNavbarOpenRef}
				navigationListRef={navigationListRef}
				socialMediaRef={socialMediaRef}
				handleOpenNavbar={handleOpenNavbar}
			/>

			{/* NAVBAR LARGE */}
			<NavbarLarge />
		</>
	);
};

export default Navbar;
