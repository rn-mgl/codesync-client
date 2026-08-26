const ListLoader = (props: { count?: number }) => {
  const count = props.count ?? 6;

  const mappedRows = new Array(count).fill(0).map((_, i) => {
    return (
      <div
        key={i}
        className="w-full flex items-center gap-2 p-2 not-last:border-b-2 border-neutral-400"
      >
        <div className="h-3 bg-neutral-300 rounded-sm animate-pulse w-24" />

        <div className="h-3 bg-neutral-300 rounded-sm animate-pulse w-full" />
      </div>
    );
  });

  return (
    <div className="w-full flex flex-col items-start justify-start">
      {mappedRows}
    </div>
  );
};

export default ListLoader;
