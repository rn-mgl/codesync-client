const ProfileLoader = () => {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex flex-col gap-4 t:flex-row">
        <div className="w-full h-full bg-neutral-200 rounded-lg aspect-square t:max-w-60 animate-pulse" />

        <div className="w-full rounded-lg bg-neutral-200 p-4 flex flex-col items-center justify-center gap-2">
          <div className="h-4 bg-neutral-300 rounded-sm animate-pulse w-1/2" />
          <div className="h-3 bg-neutral-300 rounded-sm animate-pulse w-1/3" />
        </div>
      </div>

      <div className="w-full flex flex-row justify-between px-2">
        <div className="h-6 w-6 bg-neutral-300 rounded-full animate-pulse" />
        <div className="h-6 w-6 bg-neutral-300 rounded-full animate-pulse" />
      </div>
    </div>
  );
};

export default ProfileLoader;
