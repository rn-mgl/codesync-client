import React from "react";

const ProblemLoader = () => {
  return (
    <>
      <div className="w-full h-full flex flex-col l-s:overflow-hidden gap-4">
        <div className="h-4 bg-neutral-300 rounded-sm animate-pulse w-24" />

        <div className="w-full min-h-fit flex flex-row items-start justify-start gap-2">
          {new Array(3).fill(0).map((_, i) => (
            <div
              key={i}
              className="h-8 bg-neutral-300 rounded-sm animate-pulse w-20"
            />
          ))}
        </div>

        <div className="w-full h-full flex overflow-y-auto flex-col l-s:overflow-hidden border rounded-md border-neutral-400 bg-secondary">
          <div className="w-full h-full flex flex-col gap-8 p-2 overflow-y-auto l-s:max-h-full">
            <div className="flex flex-col items-start justify-start gap-4">
              <div className="w-full flex flex-col gap-4">
                <div className="h-6 bg-neutral-300 rounded-sm animate-pulse w-3/4" />

                <div className="flex flex-wrap gap-2">
                  {new Array(3).fill(0).map((_, i) => (
                    <div
                      key={i}
                      className="h-6 bg-neutral-300 rounded-full animate-pulse w-16"
                    />
                  ))}
                </div>

                <div className="flex flex-col gap-2">
                  {new Array(4).fill(0).map((_, i) => (
                    <div
                      key={i}
                      className="h-3 bg-neutral-300 rounded-sm animate-pulse"
                      style={{ width: `${85 - i * 10}%` }}
                    />
                  ))}
                </div>
              </div>

              <div className="text-sm gap-2 flex flex-col w-full">
                <div className="h-3 bg-neutral-300 rounded-sm animate-pulse w-20" />
                <div className="flex flex-col gap-2 w-full">
                  {new Array(2).fill(0).map((_, i) => (
                    <div
                      key={i}
                      className="bg-neutral-200 border border-neutral-300 rounded-md p-1 w-full h-7 animate-pulse"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-full flex flex-col items-start justify-start gap-2 l-s:h-full l-s:overflow-y-hidden">
        <div className="w-full flex flex-row items-center justify-between gap-2 h-fit">
          <div className="flex gap-2">
            {new Array(3).fill(0).map((_, i) => (
              <div
                key={i}
                className="w-9 h-9 bg-neutral-300 rounded-full animate-pulse"
              />
            ))}
          </div>
          <div className="flex gap-2">
            {new Array(2).fill(0).map((_, i) => (
              <div
                key={i}
                className="w-9 h-9 bg-neutral-300 rounded-full animate-pulse"
              />
            ))}
          </div>
        </div>

        <div className="w-full grid grid-cols-1 grid-rows-2 items-start justify-start gap-4 h-screen l-s:h-full rounded-md overflow-hidden">
          <div className="w-full h-full grid-rows-1 p-2 rounded-md bg-[#1e1e1e] flex flex-col items-center justify-center">
            <div className="w-full h-full flex flex-col gap-2 p-2">
              {[
                "90%", "75%", "85%", "60%", "95%", "70%", "80%", "65%",
                "88%", "72%", "78%", "68%",
              ].map((width, i) => (
                <div
                  key={i}
                  className="h-3 bg-neutral-700 rounded-sm animate-pulse"
                  style={{ width }}
                />
              ))}
            </div>
          </div>

          <div className="w-full flex flex-col items-end justify-start grid-rows-1 h-full overflow-y-hidden">
            <div className="w-full h-full rounded-md flex flex-col items-start justify-start overflow-y-hidden border border-neutral-400">
              <div className="flex flex-col gap-3 p-4 w-full">
                {new Array(3).fill(0).map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-2"
                  >
                    <div className="h-3 bg-neutral-300 rounded-sm animate-pulse w-full" />
                    <div className="h-3 bg-neutral-300 rounded-sm animate-pulse w-4/5" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProblemLoader;
