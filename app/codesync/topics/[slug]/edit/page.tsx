"use client";

import TopicForm from "@/src/components/features/topic/form/TopicForm";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { Toaster } from "sonner";

const Page = () => {
  const params: { slug?: string } | null = useParams();

  return (
    <div className="w-full flex flex-col items-center justify-start min-h-full h-auto">
      <Toaster style={{ fontFamily: "var(--font-onest)" }} />
      <div className="w-full flex flex-col items-start justify-start max-w-(--breakpoint-l-l) gap-8">
        <Link
          href="/codesync/topics"
          className="text-primary font-bold flex flex-row items-center 
                    justify-center gap-2 hover:border-b px-1"
        >
          <FaArrowLeft />
          All Topics
        </Link>

        <div className="w-full flex flex-col items-center justify-center gap-4">
          <div className="w-full p-4 t:p-6 rounded-md bg-primary text-secondary font-bold t:text-lg">
            Edit Topic
          </div>

          <TopicForm mode="update" slug={params?.slug} />
        </div>
      </div>
    </div>
  );
};

export default Page;
