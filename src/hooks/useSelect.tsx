import React from "react";
import { SelectHook } from "@/interfaces/hook.interface";

export default function useSelect<T>(
  initialValue: SelectHook,
  parentState: React.Dispatch<React.SetStateAction<T>>,
) {
  const [select, setSelect] = React.useState<SelectHook>({
    label: initialValue.label,
    value: initialValue.value,
  });

  const handleSelect = (option: {
    label: string;
    value: string | number;
    target: string;
  }) => {
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
