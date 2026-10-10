import AllTestCases from "@/src/components/features/test-case/read/AllTestCases";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import { Toaster } from "sonner";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ page: number; limit: number; problem?: string }>;
}) => {
  const page = Number((await searchParams).page) || 0;
  const limit = Number((await searchParams).limit) || 25;
  const problem = (await searchParams).problem;

  return (
    <div className="w-full flex flex-col items-center justify-start min-h-full h-auto">
      <Toaster style={{ fontFamily: "var(--font-onest)" }} />
      <div className="w-full flex flex-col items-start justify-start max-w-(--breakpoint-l-l) gap-8">
        <AllTestCases problem={problem} limit={limit} page={page} />
      </div>
    </div>
  );
};

export default Page;
