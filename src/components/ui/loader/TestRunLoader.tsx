const TestRunLoader = () => {
  const mappedTabs = new Array(3).fill(0).map((_, i) => (
    <div
      key={i}
      className="w-24 h-7 bg-neutral-200 border-2 border-neutral-400 rounded-md animate-pulse"
    />
  ));

  const mappedRows = new Array(3).fill(0).map((_, i) => (
    <div key={i} className="w-full flex flex-col items-start justify-start gap-2">
      <div className="h-3 w-16 bg-neutral-300 rounded-sm animate-pulse" />
      <div className="w-full h-16 bg-neutral-300 rounded-md animate-pulse" />
    </div>
  ));

  return (
    <div className="w-full h-full flex flex-col items-start justify-start gap-2 border p-2 rounded-md border-neutral-400">
      <div className="w-full flex items-start justify-start gap-2">
        <div className="w-full flex items-start justify-start gap-2">
          {mappedTabs}
        </div>
      </div>

      <div className="w-full h-auto flex flex-col items-start justify-start gap-2">
        {mappedRows}
      </div>
    </div>
  );
};

export default TestRunLoader;