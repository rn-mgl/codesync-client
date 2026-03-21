import SingleTestCase from "@/src/components/features/test-case/read/SingleTestCase";
import React from "react";
import { Toaster } from "sonner";

const Page = async () => {
  return (
    <div className="w-full flex flex-col items-center justify-start">
      <Toaster style={{ fontFamily: "var(--font-onest)" }} />
      <div className="w-full flex flex-col items-start justify-start gap-8 h-auto">
        <SingleTestCase />
      </div>
    </div>
  );
};

export default Page;
