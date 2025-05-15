import React from "react";
import TransitionLink from "../Navbar/TransitionLink";
import Magnet from "../Magnet";

const PrimaryButton = ({ handleOnClick, label }) => {
    return (
        <button
            onClick={handleOnClick}
            className="border px-8 py-1 text-lg flex items-center justify-center rounded-xm cursor-pointer md:cursor-none hover:border-color-text-hovering "
        >
            <Magnet magnetStrength={4}>{label}</Magnet>
        </button>
    );
};

export default PrimaryButton;
