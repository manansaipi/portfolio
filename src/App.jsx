import React from "react";
import Home from "./components/Home/home";
import About from "./components/About/about";
import Navbar from "./components/Navbar/Navbar";
import CustomCursor from "./CustomCursor";

const App = () => {
  return (
    < >
      <CustomCursor />
      <Navbar />
      <Home />
      <About />
    </>
  );
};

export default App;
