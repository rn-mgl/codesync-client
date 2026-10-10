import AllAchievements from "@/src/components/features/achievement/read/AllAchievements";
import { Toaster } from "sonner";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ page: number; limit: number }>;
}) => {
  const page = Number((await searchParams).page) || 0;
  const limit = Number((await searchParams).limit) || 25;

  return (
    <div className="w-full flex flex-col items-center justify-start min-h-full h-auto">
      <Toaster style={{ fontFamily: "var(--font-onest)" }} />
      <div className="w-full flex flex-col items-start justify-start max-w-(--breakpoint-l-l) gap-8">
        <AllAchievements limit={limit} page={page} />
      </div>
    </div>
  );
};

export default Page;
