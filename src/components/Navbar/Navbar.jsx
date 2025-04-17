import React from "react";
import TogleTheme from "./TogleTheme";

const Navbar = () => {
  return (
    <>
      <div className="flex ">
        <div className="hidden p-5  md:block w-1/2 ">
          <div className="w-30 font-bold">Abdul Mannan Saip</div>
        </div>
        <div className="flex flex-col  justify-center items-start bg-primary p-5 pt-10 md:pt-5 ">
          <div className="absolute top-2 right-2 bg-primary text-background font-bold ">
            Close
          </div>
          <div className="font-bold text-5xl">HOME</div>
          <div className="font-bold text-5xl">GALLERIES</div>
          <div className="font-bold text-5xl">WRITING</div>
          <div className="font-bold text-5xl">ABOUT</div>
          <div className="h-15"></div>
          <div className="flex gap-5 mb-5">
            <a className="font-bold">Instagram</a>
            <a className="font-bold">Threads</a>
            <a className="font-bold">X (Twitter)</a>
          </div>
        </div>
      </div>
      <div className="section flex justify-between text-white bg-background ">
        {/* <a className="p-3">
        <TogleTheme />
        </a> */}

        <a className=" hover:text-zinc-400 p-3 text-primary">
          Abdul Mannan Saipi
        </a>

        <a className="hover:text-zinc-400 p-3 text-primary ">Menu</a>
      </div>
    </>
  );
};

export default Navbar;
