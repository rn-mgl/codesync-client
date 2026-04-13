import { BaseProblem } from "@/src/interfaces/problem.interface";
import React from "react";

const ProblemDetails = (props: { problem: BaseProblem }) => {
  const formattedConstraints = Object.entries(props.problem.constraints).map(
    ([key, value]) => {
      return (
        <p
          key={key}
          className="bg-neutral-200 border border-neutral-300 rounded-md p-1 w-fit"
        >
          {typeof value === "object" ? (
            <React.Fragment>
              <span>{value.min}</span> &lt;={" "}
              <span className="font-semibold">{key}</span> &lt;={" "}
              <span>{value.max}</span>
            </React.Fragment>
          ) : (
            <span>{value}</span>
          )}
        </p>
      );
    },
  );

  return (
    <div className="flex flex-col items-start justify-start gap-4 ">
      <div className="w-full flex flex-col gap-4">
        <h1 className="text-xl font-bold text-pretty t:text-2xl">
          {props.problem.id}. {props.problem.title}
        </h1>

        <article>
          <div
            className="prose max-w-none text-base text-primary"
            dangerouslySetInnerHTML={{ __html: props.problem.description }}
          />
        </article>
      </div>

      <div className="text-sm gap-2 flex flex-col">
        <p className="font-bold">Constraints: </p>
        <div className="whitespace-pre flex flex-col gap-2">
          {formattedConstraints}
        </div>
      </div>
    </div>
  );
};

export default ProblemDetails;
