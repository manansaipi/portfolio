import React from "react";
import bgImage from "../../assets/img/bg/noise-transparent.png"; // adjust the path as needed
import FooterContact from "./FooterContact";
import Lanyard from "./Lanyard";

const Contact = () => {
  return (
    <div
      id="Contact"
      className="section bg-gray-50 bg-repeat bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
      {/* <div className="h-[80vh] "></div> */}
      <FooterContact />
    </div>
  );
};

export default Contact;
// https://aafrzl.my.id/ contact refference
