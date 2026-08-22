import JobsList from "@/src/components/features/queue/read/JobsList";
import JobsStatusCount from "@/src/components/features/queue/read/JobsStatusCount";
import {
  JOB_ACTIONS,
  JOB_STATUSES,
  JOB_TYPES,
} from "@/src/interfaces/queue.interface";
import { Toaster } from "sonner";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{
    action: JOB_ACTIONS;
    status: JOB_STATUSES;
    type: JOB_TYPES;
  }>;
}) => {
  const action: JOB_ACTIONS = (await searchParams).action ?? "count";
  const status: JOB_STATUSES = (await searchParams).status ?? "active";
  const type: JOB_TYPES = (await searchParams).type ?? "listener";

  console.log(`ACTION: ${action}`);

  return (
    <div className="w-full flex flex-col items-center justify-start h-auto">
      <Toaster style={{ fontFamily: "var(--font-onest)" }} />
      <div className="w-full flex flex-col max-w-(--breakpoint-l-l) gap-8">
        {action === "count" ? (
          <JobsStatusCount />
        ) : action === "list" ? (
          <JobsList status={status} type={type} />
        ) : null}
      </div>
    </div>
  );
};

export default Page;
