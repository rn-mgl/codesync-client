const BlockLoader = (props: { count?: number }) => {
  const count = props.count ?? 8;

  const mappedBlocks = new Array(count).fill(0).map((_, i) => {
    return (
      <div
        key={i}
        className="w-full bg-neutral-200 rounded-lg p-2 flex flex-row gap-2"
      >
        <div className="aspect-square max-w-12 w-12 h-12 bg-neutral-300 rounded-sm animate-pulse" />

        <div className="w-full flex flex-col items-start justify-start gap-2">
          <div className="h-3 bg-neutral-300 rounded-sm animate-pulse w-3/4" />
          <div className="h-2 bg-neutral-300 rounded-sm animate-pulse w-full" />
        </div>
      </div>
    );
  });

  return (
    <div className="w-full grid grid-cols-1 t:grid-cols-2 l-s:grid-cols-3 l-l:grid-cols-4 gap-4">
      {mappedBlocks}
    </div>
  );
};

export default BlockLoader;
