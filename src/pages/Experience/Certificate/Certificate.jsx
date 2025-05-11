import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import certificates from "./CertificatesList";

gsap.registerPlugin(ScrollTrigger);

const Certificate = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false); // new line

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Track window width

  const certDescContainerRef = useRef();
  const certcertListRef = useRef();
  const certDescRef = useRef();

  const certListRef = useRef();

  const hoveredIndexRef = useRef(null);

  useEffect(() => {
    hoveredIndexRef.current = hoveredIndex;
  }, [hoveredIndex]);

  useEffect(() => {
    const moveCursor = (e) => {
      // set delay to have magnetic effect
      setTimeout(() => {
        let currentIndex = hoveredIndexRef.current;
        if (currentIndex !== null) {
          certcertListRef.current.textContent = certificates[currentIndex].name;
          certDescRef.current.textContent = certificates[currentIndex].desc;
        }

        setPosition({ x: e.clientX, y: e.clientY });
      }, 150);
    };

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  // Update window width on resize
  useEffect(() => { 
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Pin only if window width > 1024px
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      if (windowWidth < 1024) {
        ScrollTrigger.create({
          trigger: certDescContainerRef.current,
          start: "top 8%",
          endTrigger: certListRef.current, // The element you want to end at
          end: "bottom center",
          pin: true,
          pinSpacing: false,
          //   markers: true,
        });
      } else if (windowWidth > 1024) {
        ScrollTrigger.create({
          trigger: certDescContainerRef.current,
          start: "10% center",
          endTrigger: certListRef.current, // The element you want to end at
          end: "bottom center",
          pin: true,
          pinSpacing: false,
          //   markers: true,
        });
      }

      const children = certListRef.current.children;
      gsap.set(children, { color: "#6a6a6a" });

      [...children].forEach((child, index) => {
        gsap.to(child, {
          color: "#ffffff",
          duration: 0.00001,
          scrollTrigger: {
            trigger: child,
            start: "top center",
            end: "bottom center",
            toggleActions: "play reset play reset",
            // markers: true,
          },
          onStart: () => {
            setHoveredIndex(index);
            certcertListRef.current.textContent = certificates[index].name;
            certDescRef.current.textContent = certificates[index].desc;
          },
        });
      });
    });
    return () => ctx.revert(); // cleanup!
  }, [windowWidth]); // Dependency on windowWidth

  return (
    <>
      <div className="flex flex-col lg:flex-row text-primary h-full">
        {hoveredIndex !== null && showCertificate && (
          <div
            className="fixed bg-gray-700 w-[400px] h-[350px] transition-transform duration-300 ease-out scale-100"
            style={{
              top: `${position.y - 160}px`,
              left: `${position.x - 180}px`,
              pointerEvents: "none",
            }}
          >
            <div className="px-10 w-full h-full flex items-center justify-center">
              <img
                src={certificates[hoveredIndex].image}
                alt="certificate"
                className="shadow-lg shadow-black"
              />
            </div>
          </div>
        )}
        {/* px-5 md:px-15 lg:px-20 */}
        <div className="mb-10 md:mb-0 px-5 md:px-15 lg:px-0 lg:pl-10 xl:px-20 lg:pt-15 h-[25vh] lg:h-[300px] lg:w-[60vw] overflow-hidden text-ellipsis">
          <div ref={certDescContainerRef} className="  bg-blur ">
            <span
              className="text-lg md:text-xl text-primary "
              ref={certcertListRef}
            >
              Bangkit Academy led by Google, Tokopedia, Gojek, & Traveloka
            </span>
            <span className="text-lg md:text-xl text-primary">. </span>
            <span
              ref={certDescRef}
              className="text-color-text-hovering text-md md:text-lg "
            >
              Bangkit 2023, part of the Kampus Merdeka program, is a
              collaboration between the Ministry of Education, Culture,
              Research, and Technology, Google, Tokopedia, Gojek, and Traveloka.
            </span>
            {/* <span ref={certcertListRef} className="text-xl text-primary">
							Certifications & Achievements:
						</span>
						<span className="text-lg md:text-xl text-primary">. </span>
						<span
							ref={certDescRef}
							className="text-color-text-hovering text-md md:text-lg"
						>
							Because learning is a muscle—and mine's been lifting
						</span> */}
          </div>
        </div>

        <div className="flex flex-col px-5 md:px-10 ">
          <span className="text-3xl md:text-5xl font-extrabold text-white ">
            MY CERTIFICATES
          </span>
          <div ref={certListRef} className="flex flex-col">
            {certificates.map((cert, index) => (
              <a
                href={cert.link}
                target="_blank"
                data-name="certificate"
                key={index}
                className="flex gap-5 py-2 md:cursor-none "
                onMouseEnter={() => {
                  setHoveredIndex(index);
                  setShowCertificate(true);
                }}
                onMouseLeave={() => {
                  setHoveredIndex(null);
                  setShowCertificate(false);
                }}
              >
                <span
                  data-name="certificate"
                  className="text-xs md:text-md lg:text-lg"
                >
                  {cert.year}
                </span>
                <span
                  data-name="certificate"
                  className="text-xl md:text-2xl lg:text-3xl font-extrabold hover:text-primary -mt-2"
                >
                  {cert.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Certificate;
