import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";

const Action = () => {
  return (
    <div className="w-full h-auto bg-primary flex flex-col items-center justify-center min-h-screen p-4 t:p-8">
      <div className="w-full items-center justify-center flex flex-col gap-8 h-full max-w-(--breakpoint-l-s)">
        <div className="flex flex-col items-center justify-center text-center gap-2">
          <h1 className="text-3xl font-black t:text-5xl l-l:text-7xl bg-linear-to-r from-blue-400 via-green-400 to-red-400 p-2 bg-clip-text text-transparent">
            Synchronize
          </h1>
          <p className="text-secondary/80 t:text-base l-l:text-lg">
            Join developers; break your limits
          </p>
        </div>

        <div className="w-full hover:bg-linear-to-br hover:from-teal-600/80 hover:to-fuchsia-600/80 hover:p-1 transition-all rounded-md t:w-fit">
          <button
            className="bg-linear-to-br from-secondary to-white p-2 rounded-md t:max-w-fit t:px-4 font-bold text-primary w-full
                    flex flex-row items-center justify-center gap-2"
          >
            Join Now <FaArrowRightLong />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Action;
