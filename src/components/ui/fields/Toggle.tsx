import { ToggleField } from "@/src/interfaces/field.interface";
import React from "react";

const Toggle = (props: ToggleField) => {
  return (
    <div className="w-full flex flex-col items-start justify-center bg-secondary gap-1">
      {props.label ? (
        <label
          htmlFor={props.id}
          className="text-xs text-primary/80 font-medium"
        >
          {props.label}
        </label>
      ) : null}

      <div className="w-full flex flex-col items-start justify-center relative">
        <label
          htmlFor={props.id}
          className="w-fit flex items-center justify-start relative cursor-pointer"
        >
          <input
            type="checkbox"
            checked={props.checked}
            name={props.name}
            id={props.id}
            className="sr-only peer"
            onChange={props.onChange}
          />
          <div
            className={`p-1 rounded-md w-14 border-2 border-neutral-400 transition-all peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40 ${props.checked ? "bg-primary" : "bg-secondary"}`}
          >
            <div
              className={`w-5 h-5 rounded-sm transition-all ${props.checked ? "bg-secondary translate-x-6" : "bg-neutral-400 translate-x-0"}`}
            />
          </div>
        </label>
      </div>
    </div>
  );
};

export default Toggle;
