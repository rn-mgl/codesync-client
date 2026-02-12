import React from "react";

const Offer = () => {
  const mappedLines = React.useMemo(
    () =>
      new Array(50).fill(null).map((_, i) => {
        return (
          <div
            key={i}
            className={`border-neutral-950/10 border ${i % 2 === 0 ? "w-px h-full border-r border-l-0" : "h-px w-full border-b border-t-0"}`}
          ></div>
        );
      }),
    [],
  );

  return (
    <div className="w-full h-auto bg-secondary flex flex-col items-center justify-center min-h-screen p-4 t:p-8 relative">
      <div className="w-full items-center justify-center flex flex-col gap-8 h-full max-w-(--breakpoint-l-s) z-10">
        <div className="text-center">
          <p className="text-neutral-600 l-l:text-lg">all in one place</p>
          <h1 className="text-2xl font-black text-primary t:text-5xl l-l:text-7xl">
            A Complete Ecosystem
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-4 t:grid-cols-2">
          <div className="w-full p-4 t:p-8 rounded-md bg-neutral-200 border-neutral-300 border-2 flex flex-col items-start justify-center gap-4">
            <h2 className="text-primary font-bold t:text-lg l-l:text-xl">
              Problem Library
            </h2>
            <p className=" text-xs text-neutral-600 t:text-sm l-l:text-base">
              Curated problems tagged by company and difficulty. From Arrays to
              DP, we have it all.
            </p>
          </div>

          <div className="w-full p-4 t:p-8 rounded-md bg-neutral-200 border-neutral-300 border-2 flex flex-col items-end justify-center gap-4 text-right">
            <h2 className="text-primary font-bold t:text-lg l-l:text-xl">
              Real-Time Editor
            </h2>
            <p className="text-xs text-neutral-600 t:text-sm l-l:text-base">
              Code with friends instantly. OT-based synchronization ensures zero
              conflicts, just like Google Docs for code.
            </p>
          </div>

          <div className="w-full p-4 t:p-8 rounded-md bg-neutral-200 border-neutral-300 border-2 flex flex-col items-start justify-center gap-4">
            <h2 className="text-primary font-bold t:text-lg l-l:text-xl">
              Mock Interviews
            </h2>
            <p className="text-xs text-neutral-600 t:text-sm l-l:text-base">
              Simulate the pressure. Integrated video chat, whiteboards, and
              role-based permissions for interviewers.
            </p>
          </div>

          <div className=" w-full p-4 t:p-8 rounded-md bg-neutral-200 border-neutral-300 border-2 flex flex-col items-end justify-center gap-4 text-right">
            <h2 className="text-primary font-bold t:text-lg l-l:text-xl">
              AI Insights
            </h2>
            <p className="text-xs text-neutral-600 t:text-sm l-l:text-base">
              Stuck? Get progressive hints without spoilers. Our AI analyzes
              your complexity and suggests optimizations.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full absolute h-full top-0 left-0 grid grid-cols-5 grid-rows-10 z-0">
        {mappedLines}
      </div>
    </div>
  );
};

export default Offer;
