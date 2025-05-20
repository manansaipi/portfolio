import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { AppContext } from "../../App";
gsap.registerPlugin(TextPlugin);

const Logo = () => {
  const { handleButtonNavigation } = React.useContext(AppContext);
  const abdul = useRef();
  const bdul = useRef();
  const mannan = useRef();
  const annan = useRef();
  const saipi = useRef();
  const aipi = useRef();
  const portfolio = useRef();

  const wrapper = useRef();

  useEffect(() => {
    const vw = window.innerWidth;

    let yOffset = 100;
    let xOffset = 100;

    if (vw < 640) {
      // small screens (like mobile)
      yOffset = 40;
      xOffset = 52;
    } else if (vw < 1024) {
      // medium screens (tablet)
      yOffset = 45;
      xOffset = 55;
    } else {
      // large screens (desktop)
      yOffset = 50;
      xOffset = 58;
    }

    const firstTl = gsap.timeline();
    const secondTl = gsap.timeline();
    const thirdTl = gsap.timeline();

    gsap.set(abdul.current, { y: yOffset, x: xOffset });
    gsap.set(mannan.current, { y: -yOffset });
    gsap.set(saipi.current, { y: yOffset, x: -xOffset });
    gsap.set(portfolio.current, { y: yOffset });

    firstTl
      .to(abdul.current, { y: 0, duration: 0.5, ease: "power3.out" })
      .to(abdul.current, {
        x: 0,
        duration: 0.5,
        delay: 0.5,
        ease: "power3.out",
      });

    thirdTl
      .to(mannan.current, {
        y: 0,
        duration: 0.5,
        ease: "power3.out",
        delay: 1.15,
      })
      .to([bdul.current, annan.current, aipi.current], {
        opacity: 1,
        duration: 1,
        text: "",
      })
      .to(wrapper.current, {
        gap: 0,
        duration: 0.7,
      });
    //   .to(portfolio.current, {
    //     y: 0,
    //     onStart: () => {
    //       portfolio.current.classList.remove("hidden");
    //       portfolio.current.classList.add("visible");
    //     },
    //   });

    secondTl
      .to(saipi.current, {
        y: 0,
        duration: 0.5,
        delay: 0.5,
        ease: "power3.out",
      })
      .to(saipi.current, { x: 0, duration: 0.5, ease: "power3.out" });
  }, []);

  return (
    <a
      onClick={() => handleButtonNavigation("/")}
      ref={wrapper}
      className=" flex items-center  gap-3 overflow-hidden  text-4xl lg:text-5xl cursor-none  hover:text-color-text-hovering"
    >
      <div className="font-luckiestguy flex pointer-events-none" ref={abdul}>
        A <div ref={bdul}>BDUL</div>
      </div>
      <div className="font-luckiestguy flex  pointer-events-none" ref={mannan}>
        M <div ref={annan}>ANNAN</div>
      </div>
      <div className="font-luckiestguy flex  pointer-events-none" ref={saipi}>
        S <div ref={aipi}>AIPI</div>
      </div>
      <div
        // href="#Home"
        ref={portfolio}
        className="font-bold hover:text-color-text-hovering cursor-none hidden"
      >
        &nbsp;&nbsp;Portfolio
      </div>
    </a>
  );
};
// https://www.sublimio.com/ refference good Logo
// https://www.reactbits.dev/

export default Logo;
