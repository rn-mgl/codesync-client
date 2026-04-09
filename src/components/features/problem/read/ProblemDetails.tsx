import { BaseProblem } from "@/src/interfaces/problem.interface";

const ProblemDetails = (props: { problem: BaseProblem }) => {
  return (
    <div className="flex flex-col items-start justify-start gap-8">
      <div className="w-full flex flex-col gap-4">
        <h1 className="text-xl font-bold text-pretty t:text-2xl">
          {props.problem.id}. {props.problem.title}
        </h1>

        <p className="text-sm whitespace-pre-line">
          {props.problem.description}
        </p>
      </div>

      <div className="text-sm">
        <p>Constraints: </p>
        <p className="whitespace-pre">formatted constraint here</p>
      </div>
    </div>
  );
};

export default ProblemDetails;
