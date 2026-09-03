const RunResultLoader = () => {
  return (
    <div className="flex flex-col items-start justify-start gap-2 w-full">
      <div className="p-2 rounded-md bg-neutral-200 flex flex-col items-start justify-start gap-2 w-full">
        <div className="w-full flex items-center gap-2">
          <div className="h-6 w-40 bg-neutral-300 rounded-md animate-pulse" />

          <div className="h-6 w-20 bg-neutral-300 rounded-md animate-pulse ml-auto" />
        </div>

        <div className="w-full h-40 bg-neutral-300 rounded-md animate-pulse" />
      </div>
    </div>
  );
};

export default RunResultLoader;