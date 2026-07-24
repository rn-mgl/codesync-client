const AchievementLoader = () => {
  return (
    <div className="flex flex-col items-start justify-start w-full gap-4">
      <div className="h-4 bg-neutral-300 rounded-sm animate-pulse w-32" />

      <div className="w-full flex flex-row gap-2 justify-end">
        {new Array(2).fill(0).map((_, i) => (
          <div
            key={i}
            className="w-9 h-9 bg-neutral-300 rounded-full animate-pulse"
          />
        ))}
      </div>

      <div className="flex flex-col gap-4 items-center justify-center w-full overflow-auto">
        <div className="w-full flex flex-col">
          <div className="w-full flex items-center justify-center p-8 rounded-lg bg-neutral-200 animate-pulse">
            <div className="max-w-60 w-50 h-50 bg-neutral-300 rounded-sm animate-pulse" />
          </div>
        </div>

        <div className="w-full flex flex-col">
          <div className="p-4 bg-primary/80 w-full rounded-t-md h-10 animate-pulse" />

          <div className="flex flex-col p-2 border border-neutral-400 rounded-b-md bg-secondary gap-4 t:p-4">
            {new Array(3).fill(0).map((_, i) => (
              <div
                key={i}
                className="w-full flex flex-col items-start justify-center gap-1"
              >
                <div className="h-2 bg-neutral-300 rounded-sm animate-pulse w-16" />
                <div className="w-full h-8 bg-neutral-200 border-2 border-neutral-300 rounded-md animate-pulse" />
              </div>
            ))}

            <div className="w-full flex flex-col items-start justify-center gap-1">
              <div className="h-2 bg-neutral-300 rounded-sm animate-pulse w-20" />
              <div className="w-full min-h-40 bg-neutral-200 border-2 border-neutral-300 rounded-md animate-pulse" />
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col">
          <div className="p-4 bg-primary/80 w-full rounded-t-md h-10 animate-pulse" />

          <div className="p-2 rounded-b-md border border-neutral-400 t:p-4 flex flex-col gap-3">
            {new Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex flex-row items-center gap-2">
                <div className="h-3 bg-neutral-300 rounded-sm animate-pulse w-24 shrink-0" />
                <div className="h-3 bg-neutral-300 rounded-sm animate-pulse w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementLoader;
