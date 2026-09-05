"use client";

import Input from "@/components/ui/fields/Input";
import {
  MultiSelectField,
  MultiSelectOptionValue,
} from "@/src/interfaces/field.interface";
import React, { Activity } from "react";
import { FaChevronUp } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa6";

const MultiSelect = (props: MultiSelectField) => {
  const [isVisibleOptions, setIsVisibleOptions] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleIsVisibleOptions = () => {
    setIsVisibleOptions((prev) => !prev);
  };

  const handleSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setSearchTerm(value);
  };

  const mappedOptions = props.options
    .filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .map((option) => {
      const optionValue: MultiSelectOptionValue = {
        label: option.label,
        value: option.value,
      };

      const selected =
        props.selectedValues.findIndex((v) => v.value === option.value) !== -1;

      return (
        <button
          type="button"
          key={option.label}
          onClick={() => {
            props.onChange(optionValue);
          }}
          className={`p-2 rounded-md hover:bg-primary/50 hover:text-secondary w-full text-left transition-allz
                    ${selected ? "bg-primary text-secondary font-medium" : "bg-neutral-300"}`}
        >
          {option.label}
        </button>
      );
    });

  return (
    <div className="w-full flex flex-col items-start justify-center gap-1">
      {props.label ? (
        <label htmlFor={props.id} className="text-xs text-primary/80 font-medium">
          {props.label}
        </label>
      ) : null}

      <div className="w-full flex flex-col items-center justify-center relative bg-secondary rounded-md">
        <div className="w-full z-30">
          <button
            onClick={handleIsVisibleOptions}
            type="button"
            className="w-full p-2 text-left rounded-md text-neutral-500 border-2 border-neutral-400 outline-none"
          >
            {props.activeLabel}
          </button>

          <Activity mode={isVisibleOptions ? "visible" : "hidden"}>
            <div
              className="w-full absolute top-2 flex flex-col items-start justify-start rounded-md translate-y-11 p-2
                        animate-fade shadow-md gap-2 max-h-60 overflow-y-hidden bg-neutral-200"
            >
              <Input
                type="text"
                id="searchSelect"
                name="searchSelect"
                placeholder="Search"
                onChange={handleSearchTerm}
                value={searchTerm}
                required={false}
                icon={props.icon}
              />

              <div className="w-full h-full flex flex-col items-start justify-start overflow-y-auto gap-2">
                {mappedOptions}
              </div>
            </div>
          </Activity>
        </div>

        <div className="absolute right-0.5 rounded-sm bg-inherit p-2.5 py-3 text-neutral-500 top-0.5 z-0">
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

export default MultiSelect;
