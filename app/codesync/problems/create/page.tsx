import CreateProblem from "@/src/components/features/problem/create/CreateProblem";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";

const Page = async () => {
  return (
    <div className="w-full flex flex-col items-center justify-start min-h-full h-auto">
      <div className="w-full flex flex-col items-start justify-start max-w-(--breakpoint-l-l) gap-8">
        <Link
          href="/codesync/problems"
          className="text-primary font-bold flex flex-row items-center 
                    justify-center gap-2 hover:border-b px-1"
        >
          <FaArrowLeft />
          All Problems
        </Link>

        <div className="w-full flex flex-col items-center justify-center gap-4">
          <div className="w-full p-4 t:p-6 rounded-md bg-primary text-secondary font-bold t:text-lg">
            Create Problem
          </div>

          <CreateProblem />
        </div>
      </div>
    </div>
  );
};

export default Page;
