import React from "react";

const Home = () => {
  return (
    <section className="section bg-amber-500 flex items-center justify-center">
      <div className="flex items-center p-6 w-md  bg-white rounded-xl shadow-lg space-x-4">
        <img
          className="w-12 h-12"
          src="data:image/png;base64,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"
          alt=""
        />
        <div>
          <div className="text-xl font-medium"> Are you sure?</div>
          <p className="text-slate-500">
            You are about to delete a post, tailwind is a mobile first
          </p>
        </div>

        {/* <div className=" p-0.5 rounded-xl hover:transition-all duration-300 hover:bg-red-800 ">
          <button className="bg-red-600 p-3 w-20 rounded-xl text-white  transition-all">
            Yes
          </button>
        </div> */}
      </div>
      {/* <div className="home">
        <div className="flex">
          <div className=" bg-blue-500  text-white">Column 1</div>
          <div className=" bg-green-500  text-white">Column 2</div>
        </div>
      </div> */}
    </section>
  );
};

export default Home;
