import React from "react";
import blogs from "../../Blog/AllBlog/Blogs";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import { AppContext } from "../../../App";
const HomeBlog = () => {
    const { handleButtonNavigation } = React.useContext(AppContext);

    return (
        <div className="bg-light-dark  text-primary pb-20 mb:pb-30 lg:pb-50">
            <div className=" pt-20 lg:pt-30 px-5 pb-10 md:pb-20 ">
                <div className="flex flex-row md:mb-5  w-full ">
                    <div className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl  font-bold">
                        WRITING
                    </div>
                    <div className="">
                        {/* <PrimaryButton label={"VIEW ALL"}></PrimaryButton> */}
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-5 ">
                    {blogs.map((blog, index) => (
                        <a
                            key={index}
                            onClick={() => handleButtonNavigation("/blog")}
                            data-name="view"
                            className="group w-full"
                        >
                            <div className="my-2 pointer-events-none overflow-hidden w-full  min-h-[30vh] max-h-[50vh] ">
                                <img
                                    className="group-hover:scale-105 transition-all duration-500 ease-initial w-full "
                                    src={blog.image}
                                    alt=""
                                />
                            </div>
                            <div
                                data-name="view"
                                className="text-2xl font-bold"
                            >
                                {blog.title}
                            </div>
                            <div
                                data-name="view"
                                className="text-color-text-hovering  text-sm font-bold"
                            >
                                {blog.date}
                            </div>
                        </a>
                    ))}
                </div>
            </div>
            <div className="flex  items-center justify-center">
                <PrimaryButton
                    handleOnClick={() => handleButtonNavigation("/blog")}
                    label={"VIEW ALL"}
                />
            </div>
        </div>
    );
};

export default HomeBlog;
