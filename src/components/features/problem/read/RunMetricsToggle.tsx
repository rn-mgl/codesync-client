import React from "react";
import { FaMemory, FaRegClock } from "react-icons/fa";

const RunMetricsToggle = (props: {
  handleActiveChart: (chart: "runtime" | "memory") => void;
  activeChart: "runtime" | "memory";
  runtime: number;
  memory: number;
}) => {
  return (
    <div className="w-full grid grid-cols-1 gap-2 t:grid-cols-2">
      <button
        onClick={() => props.handleActiveChart("runtime")}
        className={`w-full p-4 rounded-md flex flex-row justify-between items-center text-left transition-all bg-cyan-500
                                         ${props.activeChart === "runtime" ? "opacity-100" : "opacity-50"}`}
      >
        <p className="flex flex-col">
          <span className="text-xs text-secondary font-light">
            Average Run Time
          </span>
          <span className="text-2xl text-primary-300 font-black mt-auto">
            {props.runtime} ms
          </span>
        </p>
        <p>
          <FaRegClock className="text-secondary text-2xl" />
        </p>
      </button>

      <button
        onClick={() => props.handleActiveChart("memory")}
        className={`w-full p-4 rounded-md flex flex-row justify-between items-center text-left transition-all bg-emerald-500
                                         ${props.activeChart === "memory" ? "opacity-100" : "opacity-50"}`}
      >
        <p className="flex flex-col">
          <span className="text-xs text-secondary font-light">
            Average Memory Used
          </span>
          <span className="text-2xl text-primary-300 font-black mt-auto">
            {props.memory} MB
          </span>
        </p>
        <p>
          <FaMemory className="text-secondary text-2xl" />
        </p>
      </button>
    </div>
  );
};

export default RunMetricsToggle;
