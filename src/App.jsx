import React from "react";
import Home from "./components/Home/home";
import About from "./components/About/about";
import Navbar from "./components/Navbar/Navbar";

const App = () => {
  return (
    <>
      <Navbar />
      <Home />
      <About />
    </>
  );
};

export default App;
