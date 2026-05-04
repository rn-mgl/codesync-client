import AllTopics from "@/src/components/features/topic/read/AllTopics";
import Link from "next/link";
import React from "react";
import { FaPlus } from "react-icons/fa";
import { Toaster } from "sonner";

const Page = async () => {
  return (
    <div className="w-full flex flex-col items-center justify-start min-h-full h-auto">
      <Toaster style={{ fontFamily: "var(--font-onest)" }} />
      <div className="w-full flex flex-col items-start justify-start max-w-(--breakpoint-l-l) gap-8">
        <Link
          href="/codesync/topics/create"
          className="text-primary font-bold flex flex-row items-center 
                    justify-center gap-2 hover:border-b px-1"
        >
          Add Topic
          <FaPlus />
        </Link>

        <AllTopics />
      </div>
    </div>
  );
};

export default Page;
