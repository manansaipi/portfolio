import React from "react";
import bobendprImg from "../../../assets/img/profiles/bobendpr.jpg"; // adjust the path as needed

const ImageIntro = ({imgContainerRef, imgRef, className}) => {
    return (
        <div
            ref={imgContainerRef}
            className={`${className} relative -mt-[10vh] bg-black w-full h-[40vw]   max-h-[50vh]  text-white`}
        >
            <img
                ref={imgRef}
                src={bobendprImg}
                className="w-full h-full object-cover absolute object-[25%_70%] "
                alt=""
            />
        </div>
    );
};

export default ImageIntro;
