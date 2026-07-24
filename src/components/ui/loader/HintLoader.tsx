const HintLoader = () => {
  return (
    <div className="flex flex-col items-start justify-start w-full gap-8">
      <div className="w-full flex justify-between">
        <div className="h-4 bg-neutral-300 rounded-sm animate-pulse w-20" />

        <div className="flex gap-2">
          {new Array(2).fill(0).map((_, i) => (
            <div
              key={i}
              className="w-9 h-9 bg-neutral-300 rounded-full animate-pulse"
            />
          ))}
        </div>
      </div>

      <div className="w-full flex flex-col items-start justify-start">
        <div className="p-4 bg-primary/80 w-full rounded-t-md h-10 animate-pulse" />

        <div className="w-full flex flex-col items-start justify-start gap-4 p-2 border-primary/50 border rounded-b-md t:p-4">
          <div className="w-full flex flex-col items-start justify-center gap-1">
            <div className="h-2 bg-neutral-300 rounded-sm animate-pulse w-14" />
            <div className="w-full h-8 bg-neutral-200 border-2 border-neutral-300 rounded-md animate-pulse" />
          </div>

          <div className="w-full flex flex-col items-start justify-center gap-1">
            <div className="h-2 bg-neutral-300 rounded-sm animate-pulse w-8" />
            <div className="w-full min-h-40 bg-neutral-200 border-2 border-neutral-300 rounded-md animate-pulse" />
          </div>

          {new Array(2).fill(0).map((_, i) => (
            <div
              key={i}
              className="w-full flex flex-col items-start justify-center gap-1"
            >
              <div className="h-2 bg-neutral-300 rounded-sm animate-pulse w-16" />
              <div className="w-full h-8 bg-neutral-200 border-2 border-neutral-300 rounded-md animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HintLoader;
