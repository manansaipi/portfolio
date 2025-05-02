import React from "react";
import bgImage from "../../assets/img/bg/noise-transparent.png"; // adjust the path as needed
import FooterContact from "./FooterContact";

const Contact = () => {
  return (
    <div
      className="section bg-gray-50 bg-repeat bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="h-[80vh] "></div>
      <FooterContact />
    </div>
  );
};

export default Contact;
// https://aafrzl.my.id/ contact refference
