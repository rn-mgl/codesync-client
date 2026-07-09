import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";

const Action = () => {
  const mappedLinesGoingUp = new Array(10).fill(null).map((_, i) => {
    return <div key={i} className="w-full h-px bg-secondary/20 -skew-60" />;
  });

  const mappedLinesGoingDown = new Array(10).fill(null).map((_, i) => {
    return <div key={i} className="w-full h-px bg-secondary/20 skew-60" />;
  });

  return (
    <div
      id="action"
      className="w-full h-auto bg-primary flex flex-col items-center justify-center min-h-screen p-4 t:p-8 relative overflow-hidden"
    >
      <div className="w-full items-center justify-center flex flex-col gap-8 h-full max-w-(--breakpoint-l-s) z-10">
        <div className="flex flex-col items-center justify-center text-center gap-2">
          <h1 className="text-3xl font-black t:text-5xl l-l:text-7xl bg-linear-to-r from-blue-400 via-green-400 to-red-400 p-2 bg-clip-text text-transparent">
            Practice with signal
          </h1>
          <p className="text-secondary/80 t:text-base l-l:text-lg">
            Pick a problem, run your answer, learn from the result, and keep
            your progress visible.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 w-full max-w-(--breakpoint-t) t:grid-cols-3">
          <div className="rounded-md border border-secondary/20 bg-secondary/5 p-4 text-center">
            <p className="text-xl font-black text-success t:text-2xl">Run</p>
            <p className="text-xs text-secondary/60 t:text-sm">test cases</p>
          </div>
          <div className="rounded-md border border-secondary/20 bg-secondary/5 p-4 text-center">
            <p className="text-xl font-black text-info t:text-2xl">Review</p>
            <p className="text-xs text-secondary/60 t:text-sm">submissions</p>
          </div>
          <div className="rounded-md border border-secondary/20 bg-secondary/5 p-4 text-center">
            <p className="text-xl font-black text-warning t:text-2xl">Grow</p>
            <p className="text-xs text-secondary/60 t:text-sm">achievements</p>
          </div>
        </div>

        <div className="w-full flex flex-col items-center justify-center gap-3 t:flex-row">
          <Link
            href="/auth/register"
            className="w-full rounded-md bg-secondary p-2 px-4 text-center font-bold text-primary t:w-fit flex flex-row items-center justify-center gap-2"
          >
            Create Account <FaArrowRightLong />
          </Link>
          <Link
            href="/auth/login"
            className="w-full rounded-md border border-secondary/40 p-2 px-4 text-center font-bold text-secondary transition-all hover:bg-secondary hover:text-primary t:w-fit"
          >
            Log In
          </Link>
        </div>
      </div>

      <div className="grid grid-rows-10 absolute top-10 left-0 w-full h-full z-0">
        {mappedLinesGoingUp}
      </div>

      <div className="grid grid-rows-10 absolute top-10 left-0 w-full h-full z-0">
        {mappedLinesGoingDown}
      </div>
    </div>
  );
};

export default Action;
