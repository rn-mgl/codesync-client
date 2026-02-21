import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";

const Page = () => {
  return (
    <div className="w-full flex flex-col items-start justify-start min-h-full h-auto">
      <div className="w-full flex flex-col items-start justify-start max-w-(--breakpoint-l-l) gap-2">
        <Link
          href="/codesync/problems"
          className="text-primary font-bold flex flex-row items-center 
                    justify-center gap-2 hover:border-b px-1"
        >
          <FaArrowLeft />
          All Problems
        </Link>
      </div>
    </div>
  );
};

export default Page;
