import SingleProblem from "@/src/components/features/problem/read/SingleProblem";

const Page = async () => {
  return (
    <div className="w-full flex flex-col items-center justify-start l-s:overflow-y-hidden l-s:h-full">
      <div className="w-full flex flex-col items-start justify-start gap-8 h-auto l-s:overflow-y-hidden l-s:h-full">
        <SingleProblem />
      </div>
    </div>
  );
};

export default Page;
