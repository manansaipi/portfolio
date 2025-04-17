import React from "react";
import TogleTheme from "./TogleTheme";

const Navbar = () => {
  return (
    <>
      <div className="flex bg-primary">
        <div className="p-5  w-1/2 hidden  md:block  ">
          <a className="w-30 font-bold text-background">Abdul Mannan Saip</a>
        </div>
        <div className="flex flex-col  justify-center items-start bg-primary p-5 pt-10 md:pt-5 ">
          <a className="absolute top-2 right-2 bg-none text-background font-bold ">
            Close
          </a>
          <a className="font-bold text-5xl text-background">HOME</a>
          <a className="font-bold text-5xl text-background">GALLERIES</a>
          <a className="font-bold text-5xl text-background">WRITING</a>
          <a className="font-bold text-5xl text-background">ABOUT</a>
          <a className="h-15"></a>
          <div className="flex gap-5 mb-5">
            <a className="font-bold text-background">Instagram</a>
            <a className="font-bold text-background">Threads</a>
            <a className="font-bold text-background">X (Twitter)</a>
          </div>
        </div>
      </div>
      <div className="section flex justify-between text-white bg-background ">
        <a className="p-3">
          <TogleTheme />
        </a>

        <a className=" hover:text-zinc-400 p-3 text-primary">
          Abdul Mannan Saipi
        </a>

        <a className="hover:text-zinc-400 p-3 text-primary ">Menu</a>
      </div>
    </>
  );
};

export default Navbar;
