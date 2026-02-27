import { InputField } from "@/src/interfaces/field.interface";
import React from "react";

const Input: React.FC<InputField> = (props) => {
  return (
    <div className="w-full flex flex-col items-start justify-center bg-secondary gap-1">
      {props.label ? (
        <label htmlFor="email" className="text-xs text-primary/80 font-medium">
          {props.label}
        </label>
      ) : null}

      <div className="w-full flex flex-col items-center justify-center relative">
        <input
          type={props.type}
          name={props.name}
          id={props.id}
          onChange={(e) => props.onChange(e)}
          value={props.value}
          required={true}
          className="w-full p-2 px-3 rounded-md text-primary border-2 border-neutral-400 outline-none"
        />

        {props.icon ? (
          <div className="absolute right-0.5 rounded-sm bg-inherit p-2.5 text-neutral-500">
            {props.icon}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Input;
