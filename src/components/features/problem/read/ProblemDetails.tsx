import { BaseHint } from "@/src/interfaces/hint.interface";
import { BaseProblem } from "@/src/interfaces/problem.interface";
import { BaseTopic } from "@/src/interfaces/topic.interface";
import React from "react";
import { FaChevronRight } from "react-icons/fa6";

const ProblemDetails = (props: {
  problem: BaseProblem;
  topics: BaseTopic[];
  hints: BaseHint[];
}) => {
  const [activeHints, setActiveHints] = React.useState<number[]>([]);

  const handleActiveHints = (id: number) => {
    setActiveHints((prev) =>
      prev.includes(id)
        ? [
            ...prev.slice(0, prev.indexOf(id)),
            ...prev.slice(prev.indexOf(id) + 1),
          ]
        : [...prev, id],
    );
  };

  const mappedConstraints = Object.entries(props.problem.constraints).map(
    ([key, value]) => {
      return (
        <p
          key={key}
          className="bg-neutral-200 border border-neutral-300 rounded-md p-1 w-full"
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
        className="w-fit px-1.5 py-0.5 rounded-full bg-neutral-300 text-xs flex flex-row items-center justify-between gap-1"
      >
        <span>{topic.icon}</span>
        <span>{topic.name}</span>
      </div>
    );
  });

  const mappedHints = props.hints.map((hint) => {
    const isActive = activeHints.includes(hint.id);

    return (
      <div
        key={hint.id}
        className="w-full flex flex-col items-start justify-center bg-neutral-200 p-2 
                  rounded-md border border-neutral-400 transition-all gap-2"
      >
        <button
          onClick={() => handleActiveHints(hint.id)}
          className="flex flex-row items-center justify-center gap-2 hover:shadow-none"
        >
          <FaChevronRight
            className={`${isActive ? "rotate-90" : "rotate-0"} transition-all`}
          />
          <span className="font-bold">Hint {hint.level}</span>
        </button>

        {isActive ? (
          <div className="w-full p-2 rounded-sm bg-secondary animate-fade text-wrap">
            {hint.hint}
          </div>
        ) : null}
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

      {mappedConstraints.length ? (
        <div className="text-sm gap-2 flex flex-col w-full ">
          <p className="font-bold">Constraints: </p>
          <div className="whitespace-pre-wrap flex flex-col gap-2 w-full">
            {mappedConstraints}
          </div>
        </div>
      ) : null}

      {mappedHints.length ? (
        <div className="text-sm gap-2 flex flex-col w-full">
          <p className="font-bold">Hints: </p>
          <div className="whitespace-pre flex flex-col gap-2">
            {mappedHints}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProblemDetails;
