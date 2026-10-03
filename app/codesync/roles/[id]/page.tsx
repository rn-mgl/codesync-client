import SingleRole from "@/src/components/features/role/read/SingleRole";
import { Toaster } from "sonner";

const Page = async () => {
  return (
    <div className="w-full flex flex-col items-center justify-start l-s:overflow-y-hidden l-s:h-full">
      <Toaster style={{ fontFamily: "var(--font-onest)" }} />
      <div className="w-full flex flex-col items-start justify-start gap-8 h-auto l-s:overflow-y-hidden l-s:h-full">
        <SingleRole />
      </div>
    </div>
  );
};

export default Page;
