import { useRef, useState, useEffect } from "react";
import bgImage from "../../assets/img/bg/noise-transparent.png"; // adjust the path as needed
import Lanyard from "./Lanyard";
import MessageForm from "./MessageForm";
import FooterContact from "./FooterContact";

const Contact = () => {
  const [visible, setVisible] = useState(false);
  const lanyardRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // stop observing once loaded
        }
      },
      { threshold: 1 }
    );

    if (lanyardRef.current) observer.observe(lanyardRef.current);
  }, []);

  return (
    <div
      id="Contact"
      className="section bg-gray-50 bg-repeat bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="flex flex-col lg:flex-row ">
        <div
          ref={lanyardRef}
          className="h-[80vh] lg:w-full hidden md:flex md:items-center justify-center   "
        >
          {visible ? (
            <div className="h-full w-[45vh] lg:w-full">
              <Lanyard position={[0, 0, 15]} gravity={[0, -40, 0]} />
            </div>
          ) : (
            <div />
          )}
        </div>
        <div className="h-[80vh] w-full p-12">
          <MessageForm />
        </div>
      </div>
      {/* <div className="h-[80vh] "></div> */}
      <div className="h-[20vh] ">
        <FooterContact />
      </div>
    </div>
  );
};

export default Contact;
// https://aafrzl.my.id/ contact refference
// TODO : VALIDASI EMAIL SENDER SPAMMING. CANNOT SEND TWO TIMES OR MORE
