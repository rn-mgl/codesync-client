import { BaseProblem } from "@/src/interfaces/problem.interface";
import { BaseTopic } from "@/src/interfaces/topic.interface";
import React from "react";

const ProblemDetails = (props: {
  problem: BaseProblem;
  topics: BaseTopic[];
}) => {
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

  const mappedTopics = props.topics.map((topic) => {
    return (
      <div
        key={topic.id}
        className="w-fit px-2 py-0.5 rounded-full bg-neutral-300 text-xs"
      >
        {topic.name}
      </div>
    );
  });

  return (
    <div className="flex flex-col items-start justify-start gap-4 ">
      <div className="w-full flex flex-col gap-4">
        <h1 className="text-xl font-bold text-pretty t:text-2xl">
          {props.problem.id}. {props.problem.title}
        </h1>

        <div className="w-full flex flex-wrap gap-2">{mappedTopics}</div>

        <article>
          <div
            className="prose max-w-none text-primary leading-snug"
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
