import React from "react";
import { Toaster } from "sonner";

const Page = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <Toaster style={{ fontFamily: "var(--font-onest)" }} />
      <div className="w-full flex flex-col max-w-(--breakpoint-l-l) gap-8"></div>
    </div>
  );
};

export default Page;
