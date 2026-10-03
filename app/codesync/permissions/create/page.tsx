import CreatePermission from "@/src/components/features/permission/create/CreatePermission";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import { Toaster } from "sonner";

const Page = async () => {
  return (
    <div className="w-full flex flex-col items-center justify-start min-h-full h-auto">
      <Toaster style={{ fontFamily: "var(--font-onest)" }} />
      <div className="w-full flex flex-col items-start justify-start max-w-(--breakpoint-l-l) gap-8">
        <Link
          href="/codesync/permissions"
          className="text-primary font-bold flex flex-row items-center 
                    justify-center gap-2 hover:border-b px-1"
        >
          <FaArrowLeft />
          All Roles
        </Link>

        <div className="w-full flex flex-col items-center justify-center gap-4">
          <div className="w-full p-4 t:p-6 rounded-md bg-primary text-secondary font-bold t:text-lg">
            Create Permission
          </div>

          <CreatePermission />
        </div>
      </div>
    </div>
  );
};

export default Page;
