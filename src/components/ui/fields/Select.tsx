"use client";

import { SelectField } from "@/src/interfaces/field.interface";
import React, { Activity } from "react";
import { FaChevronUp } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa6";

const Select: React.FC<SelectField> = (props) => {
  const [isVisibleOptions, setIsVisibleOptions] = React.useState(false);

  const handleIsVisibleOptions = () => {
    setIsVisibleOptions((prev) => !prev);
  };

  const mappedOptions = props.options.map((option) => {
    return (
      <button
        type="button"
        key={option.label}
        onClick={() => {
          props.onChange(option.label, option.value, props.id ?? props.name);
          handleIsVisibleOptions();
        }}
        className={`p-2 rounded-md hover:bg-primary/50 hover:text-secondary w-full text-left transition-all
                    ${option.value === props.value ? "bg-primary text-secondary" : "bg-neutral-300"}`}
      >
        {option.label}
      </button>
    );
  });

  return (
    <div className="w-full flex flex-col items-start justify-center bg-secondary gap-1">
      {props.label ? (
        <label htmlFor="email" className="text-xs text-primary/80 font-medium">
          {props.label}
        </label>
      ) : null}

      <div className="w-full flex flex-col items-center justify-center relative">
        <input
          type="text"
          name={props.name}
          id={props.id}
          value={props.value}
          required={true}
          className="w-full p-2 px-3 rounded-md text-primary border-2 border-neutral-400 outline-none hidden"
        />

        <div className="w-full relative">
          <button
            onClick={handleIsVisibleOptions}
            type="button"
            className="w-full p-2 text-left rounded-md bg-inherit text-primary border-2 border-neutral-400 outline-none"
          >
            {props.activeLabel}
          </button>

          <Activity mode={isVisibleOptions ? "visible" : "hidden"}>
            <div
              className="w-full absolute top-0 flex flex-col items-start justify-center bg-neutral-300 rounded-md z-20 translate-y-14 p-2
                        animate-fade"
            >
              {mappedOptions}
            </div>
          </Activity>
        </div>

        <div className="absolute right-0.5 rounded-sm bg-inherit p-2.5 py-3 text-neutral-500 top-0.5">
          <Activity mode={isVisibleOptions ? "hidden" : "visible"}>
            <FaChevronDown />
          </Activity>

          <Activity mode={isVisibleOptions ? "visible" : "hidden"}>
            <FaChevronUp />
          </Activity>
        </div>
      </div>
    </div>
  );
};

export default Select;
