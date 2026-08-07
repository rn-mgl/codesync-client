const DashboardLoader = () => {
  const mappedStats = new Array(3).fill(0).map((_, i) => {
    return (
      <div
        key={i}
        className="bg-neutral-200 rounded-lg p-4 flex flex-col gap-2 animate-pulse"
      >
        <div className="h-4 w-4 bg-neutral-300 rounded-sm" />
        <div className="h-6 w-10 bg-neutral-300 rounded-sm" />
        <div className="h-3 w-24 bg-neutral-300 rounded-sm" />
      </div>
    );
  });

  const mappedAchievements = new Array(4).fill(0).map((_, i) => {
    return (
      <div
        key={i}
        className="bg-neutral-200 rounded-lg p-2 flex flex-row gap-2 animate-pulse"
      >
        <div className="aspect-square max-w-12 w-12 h-12 bg-neutral-300 rounded-sm" />

        <div className="w-full flex flex-col items-start justify-start gap-2">
          <div className="h-3 bg-neutral-300 rounded-sm w-3/4" />
          <div className="h-2 bg-neutral-300 rounded-sm w-full" />
        </div>
      </div>
    );
  });

  return (
    <div className="w-full flex flex-col items-start justify-start gap-8">
      <div className="grid grid-cols-1 t:grid-cols-2 l-s:grid-cols-3 gap-4 w-full">
        {mappedStats}
      </div>

      <div className="w-full flex flex-col items-start justify-start gap-4">
        <div className="h-4 w-32 bg-neutral-300 rounded-sm animate-pulse" />
        <div className="w-full h-16 bg-neutral-200 rounded-md animate-pulse" />
      </div>

      <div className="w-full flex flex-col items-start justify-start gap-4">
        <div className="h-4 w-32 bg-neutral-300 rounded-sm animate-pulse" />
        <div className="w-full grid grid-cols-1 t:grid-cols-2 l-s:grid-cols-3 l-l:grid-cols-4 gap-4">
          {mappedAchievements}
        </div>
      </div>
    </div>
  );
};

export default DashboardLoader;
