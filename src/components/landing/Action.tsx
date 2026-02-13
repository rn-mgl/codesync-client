const Action = () => {
  const mappedLinesGoingUp = new Array(10).fill(null).map((_, i) => {
    return <div key={i} className="w-full h-px bg-secondary/20 -skew-60" />;
  });

  const mappedLinesGoingDown = new Array(10).fill(null).map((_, i) => {
    return <div key={i} className="w-full h-px bg-secondary/20 skew-60" />;
  });

  return (
    <div
      id="action"
      className="w-full h-auto bg-primary flex flex-col items-center justify-center min-h-screen p-4 t:p-8 relative overflow-hidden"
    >
      <div className="w-full items-center justify-center flex flex-col gap-8 h-full max-w-(--breakpoint-l-s)">
        <div className="flex flex-col items-center justify-center text-center gap-2">
          <h1 className="text-3xl font-black t:text-5xl l-l:text-7xl bg-linear-to-r from-blue-400 via-green-400 to-red-400 p-2 bg-clip-text text-transparent">
            Synchronize
          </h1>
          <p className="text-secondary/80 t:text-base l-l:text-lg">
            Join developers; break your limits
          </p>
        </div>
      </div>

      <div className="grid grid-rows-10 absolute top-10 left-0 w-full h-full">
        {mappedLinesGoingUp}
      </div>

      <div className="grid grid-rows-10 absolute top-10 left-0 w-full h-full">
        {mappedLinesGoingDown}
      </div>
    </div>
  );
};

export default Action;
