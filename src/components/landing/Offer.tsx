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
    <div
      id="offer"
      className="w-full h-auto bg-secondary flex flex-col items-center justify-center min-h-screen p-4 t:p-8 relative"
    >
      <div className="w-full items-center justify-center flex flex-col gap-8 h-full max-w-(--breakpoint-l-s) z-10">
        <div className="text-center flex flex-col items-center justify-center gap-1">
          <div className="w-10 h-1 rounded-full bg-linear-to-r from-accent via-success to-accent" />
          <p className="text-neutral-600 l-l:text-lg">available right now</p>
          <h1 className="text-2xl font-black text-primary t:text-5xl l-l:text-7xl">
            Current Feature Set
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-4 t:grid-cols-2">
          <div className="w-full p-4 t:p-8 rounded-md bg-neutral-200 border-neutral-300 border-2 flex flex-col items-start justify-center gap-4">
            <h2 className="bg-linear-to-br from-accent to-success bg-clip-text text-transparent font-bold t:text-lg l-l:text-xl">
              Problem Workspace
            </h2>
            <p className=" text-xs text-neutral-600 t:text-sm l-l:text-base">
              Browse a searchable problem library with topic filters and
              difficulty sorting. Create and edit problems with rich
              descriptions, constraints, editorials, and topic tags. Open any
              problem in a split-panel workspace with a description tab,
              editorial tab, and full submission history.
            </p>
          </div>

          <div className="w-full p-4 t:p-8 rounded-md bg-neutral-200 border-neutral-300 border-2 flex flex-col items-end justify-center gap-4 text-right">
            <h2 className="bg-linear-to-br from-accent to-success bg-clip-text text-transparent font-bold t:text-lg l-l:text-xl">
              In-Browser Code Editor
            </h2>
            <p className="text-xs text-neutral-600 t:text-sm l-l:text-base">
              Write code directly in the browser with Monaco — the same editor
              powering VS Code. Run your solution against test cases instantly,
              see pass or fail results with runtime and memory metrics, and
              review past submissions with detailed run statistics and charts.
            </p>
          </div>

          <div className="w-full p-4 t:p-8 rounded-md bg-neutral-200 border-neutral-300 border-2 flex flex-col items-start justify-center gap-4">
            <h2 className="bg-linear-to-br from-accent to-success bg-clip-text text-transparent font-bold t:text-lg l-l:text-xl">
              Hints, Topics & Test Cases
            </h2>
            <p className="text-xs text-neutral-600 t:text-sm l-l:text-base">
              Organize problems by topic collections. Add progressive hints with
              rich text formatting to guide solvers step by step. Define sample
              and hidden test cases with custom memory limits and execution time
              constraints — all managed from a single flow.
            </p>
          </div>

          <div className=" w-full p-4 t:p-8 rounded-md bg-neutral-200 border-neutral-300 border-2 flex flex-col items-end justify-center gap-4 text-right">
            <h2 className="bg-linear-to-br from-accent to-success bg-clip-text text-transparent font-bold t:text-lg l-l:text-xl">
              Cody AI Assistant
            </h2>
            <p className="text-xs text-neutral-600 t:text-sm l-l:text-base">
              A floating chatbot you can open anytime while practicing. Cody
              streams responses in real time, keeps a full chat history you can
              revisit, and lets you start new sessions — so you always have help
              nearby without leaving the workspace.
            </p>
          </div>

          <div className="w-full p-4 t:p-8 rounded-md bg-neutral-200 border-neutral-300 border-2 flex flex-col items-start justify-center gap-4">
            <h2 className="bg-linear-to-br from-accent to-success bg-clip-text text-transparent font-bold t:text-lg l-l:text-xl">
              Achievements & Progress
            </h2>
            <p className="text-xs text-neutral-600 t:text-sm l-l:text-base">
              Earn badges across bronze, silver, gold, and diamond tiers.
              Achievements track categories like problems solved, submissions
              made, and streaks maintained — each with point values and unlock
              criteria so you can see exactly what to aim for next.
            </p>
          </div>

          <div className=" w-full p-4 t:p-8 rounded-md bg-neutral-200 border-neutral-300 border-2 flex flex-col items-end justify-center gap-4 text-right">
            <h2 className="bg-linear-to-br from-accent to-success bg-clip-text text-transparent font-bold t:text-lg l-l:text-xl">
              Dashboard & Profile
            </h2>
            <p className="text-xs text-neutral-600 t:text-sm l-l:text-base">
              A dashboard that surfaces problems solved, submissions today, and
              achievements earned at a glance. Your profile includes a
              GitHub-style contribution heatmap, account settings, password
              management, and a summary of your overall progress.
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
