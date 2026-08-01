import AllHints from "@/src/components/features/hint/read/AllHints";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";
import { Toaster } from "sonner";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ page: number; limit: number; problem?: string }>;
}) => {
  const page = Number((await searchParams).page);
  const limit = Number((await searchParams).limit);
  const problem = (await searchParams).problem;

  return (
    <div className="w-full flex flex-col items-center justify-start min-h-full h-auto">
      <Toaster style={{ fontFamily: "var(--font-onest)" }} />
      <div className="w-full flex flex-col items-start justify-start max-w-(--breakpoint-l-l) gap-8">
        <Link
          href="/codesync/hints/create"
          className="text-primary font-bold flex flex-row items-center 
                    justify-center gap-2 hover:border-b px-1"
        >
          Add Hint
          <FaPlus />
        </Link>

        <AllHints problem={problem} limit={limit} page={page} />
      </div>
    </div>
  );
};

export default Page;
