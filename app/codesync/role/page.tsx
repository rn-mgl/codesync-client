import AllRoles from "@/src/components/features/role/read/AllRoles";
import { Toaster } from "sonner";

const Page = async () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <Toaster style={{ fontFamily: "var(--font-onest)" }} />
      <div className="w-full flex flex-col items-start justify-start max-w-(--breakpoint-l-l) gap-8">
        <AllRoles />
      </div>
    </div>
  );
};

export default Page;
