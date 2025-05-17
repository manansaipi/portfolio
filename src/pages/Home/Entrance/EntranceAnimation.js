import gsap from "gsap";

export const EntranceAnimation = ({
  refs,
  greetings,
  setCurrentGreeting,
  currentGreeting,
  location
}) => {
  const {
    homeContainerRef,
    headerContainerRef,
    ciaoRef,
    imRef,
    benRef,
    doingRef,
    techRef,
    softwareRef,
    whoRef,
    lovesRef,
    simpleRef,
    imgContainerRef,
  } = refs;

  const vw = window.innerWidth;

  let yOffset = 0;
  let yToOffset = 0;
  let rotateZvar = 25;

  const handleResize = () => {
    if (vw < 640) {
      yOffset = 80;
      yToOffset = -50 - 35;
    } else if (vw < 1024) {
      yOffset = 95;
      yToOffset = -65 - 35;
    } else if (vw < 1280) {
      yOffset = 110;
      yToOffset = -80 - 35;
    } else {
      yOffset = 125;
      yToOffset = -95 - 35;
    }
  };

  handleResize();

  gsap.set(ciaoRef.current, { y: yOffset, rotateZ: rotateZvar });
  gsap.set(imRef.current, { y: yOffset, rotateZ: rotateZvar });
  gsap.set(benRef.current, { y: yOffset, rotateZ: rotateZvar });
  gsap.set(doingRef.current, { y: yOffset, rotateZ: 3 });
  gsap.set(softwareRef.current, { y: yOffset, rotateZ: 3 });
  gsap.set(whoRef.current, { y: yOffset, rotateZ: 3 });
  gsap.set(simpleRef.current, { y: yOffset, rotateZ: 3 });

  const tl = gsap.timeline();

  tl.to(ciaoRef.current, { y: 0, duration: 0.35, rotateZ: 0, delay: 0.5,
      onStart: () => {
        if (headerContainerRef.current) {
            headerContainerRef.current.classList.add("z-7");
        }
      }
   })
    .to(imRef.current, {
      y: 0,
      rotateZ: 0,
      duration: 0.35,
      delay: 0.35,
    })
    .to(benRef.current, {
      y: 0,
      rotateZ: 0,
      duration: 0.53,
    }, "-=0.4")
    .to(doingRef.current, {
      y: 0,
      rotateZ: 0,
      duration: 0.6,
      delay: 1,
    })
    .to(whoRef.current, {
      y: 0,
      rotateZ: 0,
      duration: 0.8,
    }, "-=0.5")
    .to(techRef.current, {
      y: yToOffset,
      rotateZ: -10,
      delay: 2,
      duration: 0.8,
    })
    .to(softwareRef.current, {
      y: 0,
      rotateZ: 0,
    }, "-=0.5")
    .to(lovesRef.current, {
      y: yToOffset,
      rotateZ: -10,
      duration: 0.8,
    }, "-=0.6")
    .to(simpleRef.current, {
      y: 0,
      rotateZ: 0,
      onComplete: () => {
        if (headerContainerRef.current) {
          setTimeout(() => {
            headerContainerRef.current.classList.remove("z-7");
          }, 2000);
        }
      }
    }, "-=0.6");

  if (location.pathname === "/") {
    gsap.to(imgContainerRef.current, {
      delay: 7,
      onComplete: () => {
        homeContainerRef.current?.classList.remove("overflow-hidden");
        imgContainerRef.current?.classList.remove("hidden");
      }
    });
  }

  const interval = setInterval(() => {
    const tl = gsap.timeline();

    tl.to(ciaoRef.current, {
      y: -50,
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        let nextGreeting;
        do {
          nextGreeting =
            greetings[Math.floor(Math.random() * greetings.length)];
        } while (nextGreeting === currentGreeting);

        setCurrentGreeting(nextGreeting);
        gsap.set(ciaoRef.current, { y: 100 });
      },
    }).to(ciaoRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: "circ.out",
    });
  }, 10000);

  window.addEventListener("resize", handleResize);

  return () => {
    clearInterval(interval);
    window.removeEventListener("resize", handleResize);
  };
};
