import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";

const Hero = () => {
  return (
    <div
      id="hero"
      className="w-full bg-primary p-4 flex flex-col items-center justify-center min-h-screen h-screen t:p-8 relative "
    >
      <div
        className="absolute z-0 top-0 -translate-y-1/2 w-full blur-3xl aspect-square rounded-full 
                    bg-linear-to-b from-neutral-900/10 from-60% to-secondary/20"
      />

      <div
        className="w-full h-full text-center flex flex-col items-center justify-center max-w-(--breakpoint-l-s)
                gap-4 t:gap-8 z-10"
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
          <Link
            href="/auth/register"
            className="bg-linear-to-br from-secondary to-white p-2 rounded-md t:max-w-fit t:px-4 font-bold text-primary w-full
                    flex flex-row items-center justify-center gap-2"
          >
            Start Now <FaArrowRightLong />
          </Link>
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
