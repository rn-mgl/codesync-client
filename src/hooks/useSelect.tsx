import React from "react";
import { SelectHook } from "@/interfaces/hook.interface";
import { OptionValue } from "../interfaces/field.interface";

export default function useSelect<T>(
  initialValue: SelectHook,
  parentState: React.Dispatch<React.SetStateAction<T>>,
) {
  const [select, setSelect] = React.useState<SelectHook>({
    label: initialValue.label,
    value: initialValue.value,
  });

  const handleSelect = (option: OptionValue) => {
    setSelect({ label: option.label, value: option.value });
    parentState((prev) => {
      return {
        ...prev,
        [option.target]: option.value,
      };
    });
  };

  return {
    select,
    handleSelect,
  };
}
