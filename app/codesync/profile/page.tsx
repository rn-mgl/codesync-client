import UserDetails from "@/src/components/features/profile/read/UserDetails";
import HeatmapCalendar from "@/src/components/features/profile/read/HeatmapCalendar";
import { Toaster } from "sonner";

const Page = () => {
  return (
    <div className="w-full flex flex-col items-center justify-start h-auto">
      <Toaster style={{ fontFamily: "var(--font-onest)" }} />
      <div className="w-full flex flex-col max-w-(--breakpoint-l-l) gap-8">
        <UserDetails />
        <HeatmapCalendar />
      </div>
    </div>
  );
};

export default Page;
