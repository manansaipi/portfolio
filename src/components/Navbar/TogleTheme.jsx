import React, { useState } from "react";

const TogleTheme = () => {
  const [enabled, setEnabled] = useState(false);
  const toggleTheme = () => {
    setEnabled(!enabled);

    //TODO : ADD DEFAULT THEME BASED ON USER THEME SETTING
    //TODO : STORE USER PREFERENCED SETTING INTO LOCAL STORAGE

    if (enabled) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  };
  return (
    <div onClick={toggleTheme}>
      <div
        className={`${
          !enabled
            ? "bg-zinc-900 shadow shadow-black"
            : "bg-background inset-shadow-sm inset-shadow-amber-100 shadow shadow-amber-100"
        } P-3 w-15 h-7 rounded-2xl   flex items-center translate-z-0.5 `}
      >
        {/* <div
          className={`absolute opacity-0 w-10 h-10 transition-all duration-200 ${
            !enabled ? "scale-200 opacity-100 bg-black " : ""
          }`}
        ></div> */}
        <div
          className={`rounded-full w-[40%] m-0.5 ${
            enabled
              ? "translate-x-8 rotate-210 bg-amber-300 translate-z-100  shadow shadow-amber-300  "
              : "translate-x-0 bg-white shadow shadow-black translate-z-7"
          }  transition-all duration-500 overflow-hidden  `}
        >
          <div
            className={`bg-zinc-900 rounded-full translate-x-2.5 w-full h-6 ${
              enabled ? "opacity-0" : ""
            } duration-200`}
          >
            {" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TogleTheme;

// import React, { useState } from "react";

// const ToggleTheme = () => {
//   const [enabled, setEnabled] = useState(false);

//   return (
//     <div
//       onClick={() => setEnabled(!enabled)}
//       className="w-16 h-8 flex items-center rounded-full p-1 transition-colors duration-300 bg-zinc-800 shadow-inner"
//     >
//       <div
//         className={`w-6 h-6 rounded-full bg-white transition-all duration-300 ease-in-out shadow-md
//           ${enabled ? "translate-x-8 bg-yellow-300" : "translate-x-0"}
//         `}
//       >
//         <div
//           className={`absolute w-6 h-6 rounded-full bg-zinc-800 transition-all duration-300
//             ${enabled ? "translate-x-0 opacity-0" : "translate-x-1 opacity-100"}
//           `}
//         ></div>
//       </div>
//     </div>
//   );
// };

// export default ToggleTheme;
