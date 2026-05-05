import SingleTopic from "@/src/components/features/topic/read/SingleTopic";
import React from "react";
import { Toaster } from "sonner";

const Page = () => {
  return (
    <div className="w-full flex flex-col items-center justify-start">
      <Toaster style={{ fontFamily: "var(--font-onest)" }} />
      <div className="w-full flex flex-col items-start justify-start gap-8 h-auto">
        <SingleTopic />
      </div>
    </div>
  );
};

export default Page;
