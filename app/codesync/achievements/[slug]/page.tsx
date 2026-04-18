import SingleAchievement from "@/src/components/features/achievement/read/SingleAchievement";
import React from "react";
import { Toaster } from "sonner";

const Page = async () => {
  return (
    <div className="w-full flex flex-col items-center justify-start l-l:overflow-y-hidden l-l:h-full">
      <Toaster style={{ fontFamily: "var(--font-onest)" }} />

      <div className="w-full flex flex-col items-start justify-start gap-8 h-auto l-l:overflow-y-hidden l-l:h-full">
        <SingleAchievement />
      </div>
    </div>
  );
};

export default Page;
