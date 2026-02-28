import { TextAreaField } from "@/src/interfaces/field.interface";
import React from "react";

const TextArea = (props: TextAreaField) => {
  return (
    <div className="w-full flex flex-col items-start justify-center bg-secondary gap-1">
      {props.label ? (
        <label htmlFor="email" className="text-xs text-primary/80 font-medium">
          {props.label}
        </label>
      ) : null}

      <div className="w-full flex flex-col items-center justify-center relative">
        <textarea
          name={props.name}
          id={props.id}
          onChange={(e) => props.onChange(e)}
          value={props.value}
          required={true}
          cols={props.columns ?? 5}
          className="w-full p-2 px-3 rounded-md text-primary border-2 border-neutral-400 outline-none min-h-50"
        />

        {props.icon ? (
          <div className="absolute right-0.5 top-0.5 bg-inherit rounded-sm p-2.5 text-neutral-500">
            {props.icon}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TextArea;
