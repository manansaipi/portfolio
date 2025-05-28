import React from "react";
import Magnet from "../Magnet";

const PrimaryButton = ({ handleOnClick, label, colorStyle="text-primary" }) => {
    return (
        <a
            onClick={handleOnClick}
            className={`border px-8 py-1 text-lg md:text-xl lg:text-2xl flex items-center justify-center rounded-xm cursor-none ${colorStyle}  hover:border-color-text-hovering`}
        >
            <Magnet wrapperClassName="pointer-events-none" magnetStrength={4}>
                {label}
            </Magnet>
        </a>
    );
};

export default PrimaryButton;
