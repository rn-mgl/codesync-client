import Link from "next/link";
import { FaPlus } from "react-icons/fa6";

const Page = () => {
  return (
    <div className="w-full flex flex-col items-center justify-start min-h-full h-auto">
      <div className="w-full flex flex-col items-start justify-start max-w-(--breakpoint-l-l)">
        <Link
          href="/codesync/problems/create"
          className="text-primary font-bold flex flex-row items-center 
                    justify-center gap-2 hover:border-b px-1"
        >
          Add Problem
          <FaPlus />
        </Link>
      </div>
    </div>
  );
};

export default Page;
