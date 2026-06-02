import UserDetails from "@/src/components/features/profile/read/UserDetails";
import React from "react";

const Page = () => {
  return (
    <div className="w-full flex flex-col items-start justify-start h-auto">
      <div className="w-full flex flex-col max-w-(--breakpoint-l-l) gap-8">
        <UserDetails />
      </div>
    </div>
  );
};

export default Page;
