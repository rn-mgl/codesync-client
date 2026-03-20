import CreateTestCase from "@/src/components/features/test-case/create/CreateTestCase";
import Link from "next/link";
import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Toaster } from "sonner";

const Page = () => {
  return (
    <div className="w-full flex flex-col items-center justify-start min-h-full h-auto">
      <Toaster style={{ fontFamily: "var(--font-onest)" }} />
      <div className="w-full flex flex-col items-start justify-start max-w-(--breakpoint-l-l) gap-8">
        <Link
          href="/codesync/test-cases"
          className="text-primary font-bold flex flex-row items-center 
                    justify-center gap-2 hover:border-b px-1"
        >
          <FaArrowLeft />
          All Test Cases
        </Link>

        <div className="w-full flex flex-col items-center justify-center gap-4">
          <div className="w-full p-4 t:p-6 rounded-md bg-primary text-secondary font-bold t:text-lg">
            Create Test Case
          </div>

          <CreateTestCase />
        </div>
      </div>
    </div>
  );
};

export default Page;
