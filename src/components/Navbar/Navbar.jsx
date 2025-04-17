import React from "react";
import TogleTheme from "./TogleTheme";

const Navbar = () => {
  return (
    <div className="section flex justify-between text-white bg-background ">
      <a className="p-3">
        <TogleTheme />
      </a>
      <a className=" hover:text-zinc-400 p-3 text-primary">
        Abdul Mannan Saipi
      </a>

      <a className="hover:text-zinc-400 p-3 text-primary ">Menu</a>
    </div>
  );
};

export default Navbar;
