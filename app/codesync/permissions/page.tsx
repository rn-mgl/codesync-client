import AllPermissions from "@/src/components/features/permission/read/AllPermissions";
import Link from "next/link";
import React from "react";
import { FaPlus } from "react-icons/fa";
import { Toaster } from "sonner";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: number; limit?: number }>;
}) => {
  const page = Number((await searchParams).page) || 0;
  const limit = Number((await searchParams).limit) || 10;

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <Toaster style={{ fontFamily: "var(--font-onest)" }} />
      <div className="w-full flex flex-col items-start justify-start max-w-(--breakpoint-l-l) gap-8">
        <Link
          href="/codesync/permissions/create"
          className="text-primary font-bold flex flex-row items-center 
                    justify-center gap-2 hover:border-b px-1"
        >
          Add Permission
          <FaPlus />
        </Link>

        <AllPermissions limit={limit} page={page} />
      </div>
    </div>
  );
};

export default Page;
