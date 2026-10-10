import AllPermissions from "@/src/components/features/permission/read/AllPermissions";
import { Toaster } from "sonner";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: number; limit?: number }>;
}) => {
  const page = Number((await searchParams).page) || 0;
  const limit = Number((await searchParams).limit) || 10;

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <Toaster style={{ fontFamily: "var(--font-onest)" }} />
      <div className="w-full flex flex-col items-start justify-start max-w-(--breakpoint-l-l) gap-8">
        <AllPermissions limit={limit} page={page} />
      </div>
    </div>
  );
};

export default Page;
