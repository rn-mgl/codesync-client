const TableLoader = (props: { rows?: number; columns?: number }) => {
  const rows = props.rows ?? 5;
  const columns = props.columns ?? 4;

  const mappedRows = new Array(rows).fill(0).map((_, i) => {
    const mappedColumns = new Array(columns).fill(0).map((_, j) => {
      const width = j === 0 ? "w-8" : j === columns - 1 ? "w-16" : "w-3/4";

      return (
        <div
          key={j}
          className={`h-3 bg-neutral-300 rounded-sm animate-pulse ${width}`}
        />
      );
    });

    return (
      <div
        key={i}
        className="grid w-full p-4 gap-4 items-center border-b-2 border-neutral-400 last:border-b-0"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, ${columns}fr))`,
        }}
      >
        {mappedColumns}
      </div>
    );
  });

  return (
    <div className="flex flex-col items-start justify-start overflow-x-auto w-full max-w-(--breakpoint-l-l)">
      <div className="w-full min-w-(--breakpoint-t) grid grid-cols-1 gap-2">
        <div
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0, ${columns}fr))`,
          }}
          className="grid gap-4 p-4 w-full bg-primary text-secondary rounded-md"
        >
          {new Array(columns).fill(0).map((_, i) => (
            <div
              key={i}
              className="h-3 bg-neutral-700 rounded-sm animate-pulse w-3/4"
            />
          ))}
        </div>

        <div className="bg-secondary border-2 border-neutral-400 rounded-md grid grid-cols-1 w-full">
          {mappedRows}
        </div>
      </div>
    </div>
  );
};

export default TableLoader;
