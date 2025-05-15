import React, { useRef } from "react";
import { Router, useLocation, useNavigate } from "react-router";
import { AnimatePageTransition } from "../PreLoader/AnimatePageTransition";
import { AppContext } from "../../App";

const TransitionLink = ({ href, label }) => {
    const { preloaderRef } = React.useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleClick = () => {
        if (location.pathname !== href) {
            AnimatePageTransition({
                preloaderRef,
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
