import { CheckBoxField } from "@/src/interfaces/field.interface";
import React from "react";
import Input from "./Input";

const CheckBox = (props: CheckBoxField) => {
  const [searchTerm, setSearchTearm] = React.useState("");

  const handleSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setSearchTearm(value);
  };

  const mappedOptions = props.options
    .filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .map((option) => {
      const checked = props.selectedOptions.includes(option.value);

      return (
        <label
          key={option.value}
          htmlFor={option.label}
          className="p-2 rounded-md relative bg-neutral-200 flex flex-row items-center justify-center gap-1 text-sm cursor-pointer"
        >
          <input
            type="checkbox"
            id={option.label}
            checked={checked}
            className="sr-only peer"
            onChange={() => props.handleCheck(option.value)}
          />
          <div
            className={`w-5 h-5 border-2 border-neutral-400 rounded-sm ${checked ? "bg-primary" : "bg-secondary"}`}
          />
          <p>{option.label}</p>
        </label>
      );
    });

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

      <div className="w-full flex flex-col gap-2">
        <div className="w-full max-w-(--breakpoint-m-l) ml-auto">
          <Input
            type="text"
            id="searchCheckbox"
            name="searchCheckbox"
            onChange={handleSearchTerm}
            value={searchTerm}
            placeholder="Search"
            required={false}
          />
        </div>

        <div className="w-full flex flex-row gap-2 flex-wrap max-h-60 overflow-y-auto">
          {mappedOptions}
        </div>
      </div>
    </div>
  );
};

export default CheckBox;
