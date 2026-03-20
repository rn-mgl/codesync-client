import Link from "next/link";
import React from "react";
import { FaPlus } from "react-icons/fa";
import { Toaster } from "sonner";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ problem?: string }>;
}) => {
  const problem = (await searchParams).problem;

  return (
    <div className="w-full flex flex-col items-center justify-start min-h-full h-auto">
      <Toaster style={{ fontFamily: "var(--font-onest)" }} />
      <div className="w-full flex flex-col items-start justify-start max-w-(--breakpoint-l-l) gap-8">
        <Link
          href={
            problem
              ? `/codesync/test-cases/create?problem=${problem}`
              : `/codesync/test-cases/create`
          }
          className="text-primary font-bold flex flex-row items-center 
                    justify-center gap-2 hover:border-b px-1"
        >
          Add Test Case
          <FaPlus />
        </Link>
      </div>
    </div>
  );
};

export default Page;
