import React from "react";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";

const Content = ({ handleButtonNavigation }) => {
    return (
        <div className=" bg-light-dark text-primary  transition-all">
            <div className=" flex flex-col p-5 py-5 pb-10 md:p-15 lg:px-25 xl:pt-20 xl:px-50">
                <div className="text-6xl lg:text-7xl xl:text-8xl tracking-widest text-color-text-hovering">
                    what
                </div>
                <div className="text-7xl  lg:text-8xl xl:text-9xl font-bold tracking-widest">
                    I DO?
                </div>
                <div className="flex flex-col md:flex-row gap-10 pt-10 ">
                    <div className="w-full text-2xl lg:text-3xl xl:text-4xl ">
                        Build digital things that make the complex feel simple.
                        Clean logic, smooth interactions, real impact.
                    </div>
                    <div className="flex flex-col gap-10 md:gap-15 w-1/2 lg:text-lg xl:text-xl">
                        <div>
                            I turn problems into products. Every line of code is
                            written with clarity and purpose.
                        </div>
                        <div className="self-start md:self-end">
                            <PrimaryButton
                                handleOnClick={() =>
                                    handleButtonNavigation("/about")
                                }
                                label={"ABOUT ME"}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Content;
