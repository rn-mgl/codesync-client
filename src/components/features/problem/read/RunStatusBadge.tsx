import React from "react";

const RunStatusBadge = (props: { passed: number; total: number }) => {
  return (
    <div className="w-full flex items-center justify-end">
      <p
        className={`p-2 rounded-md text-xs font-semibold ${props.passed === props.total ? "bg-green-300" : "bg-red-300"}`}
      >
        {props.passed} / {props.total} Test Cases Passed
      </p>
    </div>
  );
};

export default RunStatusBadge;
