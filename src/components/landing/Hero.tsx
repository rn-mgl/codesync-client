import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";

const Hero = () => {
  return (
    <div className="w-full h-full bg-primary p-2 flex flex-col items-center justify-center">
      <div
        className="w-full h-full text-center flex flex-col items-center justify-center max-w-(--breakpoint-l-l)
                gap-4 t:gap-8"
      >
        <div className="w-full flex flex-col items-center justify-center gap-2">
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
            Your platform for real-time collaborative coding, mock interviews,
            and technical mastery. Built for teams, tailored for you.
          </h2>
        </div>

        <div className="w-full hover:bg-linear-to-br hover:from-fuchsia-600/80 hover:to-teal-600/80 hover:p-1 transition-all rounded-md t:w-fit">
          <button
            className="bg-linear-to-br from-secondary to-white p-2 rounded-md t:max-w-fit t:px-4 font-bold text-primary w-full
                    flex flex-row items-center justify-center gap-2"
          >
            Start Now <FaArrowRightLong />
          </button>
        </div>

        <div className="w-full flex flex-col items-center justify-center max-w-(--breakpoint-t)">
          <div className="w-full p-4 rounded-t-md bg-neutral-800 border border-neutral-600 flex flex-row items-center justify-between">
            <div className="flex flex-row items-center justify-center gap-2">
              <div className="bg-red-400 rounded-full p-1"></div>
              <div className="bg-amber-400 rounded-full p-1"></div>
              <div className="bg-green-400 rounded-full p-1"></div>
            </div>

            <div>
              <p className="text-xs text-neutral-500">
                collaborativeSession.js
              </p>
            </div>
          </div>
          <div className="w-full p-4 font-mono rounded-b-md bg-neutral-900 border border-neutral-600 border-t-0 text-left">
            <p>
              <span className="text-red-400">const</span>{" "}
              <span className="text-purple-400">solveTogether</span>{" "}
              <span className="text-red-400">=</span>{" "}
              <span className="text-blue-400">(</span>
              <span className="text-amber-400">users: </span>
              <span className="text-blue-400">number</span>
              <span className="text-green-400">[]</span>
              <span className="text-blue-400">)</span>
              <span className="text-red-400">:</span>
              <span className="text-blue-400"> string </span>{" "}
              <span className="text-red-400">=&gt;</span>{" "}
              <span className="text-blue-400">&#123;</span> <br />
            </p>
            <p className="indent-4">
              <span className="text-red-400 indent-4">if</span>{" "}
              <span className="text-green-400">(</span>
              <span className="text-amber-400">users</span>
              <span className="text-white">.</span>
              <span className="text-blue-400">length</span>{" "}
              <span className="text-red-400 indent-4">&gt;</span>{" "}
              <span className="text-blue-400">1</span>
              <span className="text-green-400">) &#123;</span>{" "}
            </p>
            <p className="indent-8">
              <span className="text-red-400 indent-4">return</span>{" "}
              <span className="text-blue-400">
                &quot;Real-time Sync Active 🚀&quot;
              </span>
              <span className="text-white">;</span>
            </p>
            <p className="indent-4">
              <span className="text-green-400">&#125;</span>{" "}
            </p>
            <p className="indent-4">
              <span className="text-red-400 indent-4">return</span>{" "}
              <span className="text-blue-400">&quot;Building...&quot;</span>
              <span className="text-white">;</span>
            </p>
            <p>
              <span className="text-blue-400">&#125;</span>{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
