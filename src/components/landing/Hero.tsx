import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";

const Hero = () => {
  return (
    <div className="w-full h-full bg-primary p-2 flex flex-col items-center justify-center">
      <div
        className="w-full h-full text-center flex flex-col items-center justify-center max-w-(--breakpoint-l-l)
                gap-2 t:gap-4 l-l:gap-8"
      >
        <h1 className="text-3xl font-black text-secondary t:text-5xl l-l:text-7xl">
          <span className="bg-linear-to-br from-fuchsia-600 to-red-600 bg-clip-text text-transparent">
            Master
          </span>{" "}
          the code; <br />{" "}
          <span className="bg-linear-to-br from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Sync
          </span>{" "}
          your success.
        </h1>

        <h2 className="text-secondary/80 t:text-base max-w-(--breakpoint-t) l-l:text-lg">
          Your platform for real-time collaborative coding, mock interviews, and
          technical mastery. Built for teams, tailored for you.
        </h2>

        <div className="w-full hover:bg-linear-to-br hover:from-fuchsia-600/80 hover:to-teal-600/80 hover:p-1 transition-all rounded-md t:w-fit">
          <button
            className="bg-linear-to-br from-secondary to-white p-2 rounded-md t:max-w-fit t:px-4 font-bold text-primary w-full
                    flex flex-row items-center justify-center gap-2"
          >
            Start Now <FaArrowRightLong />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
