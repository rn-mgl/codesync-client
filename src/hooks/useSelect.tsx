import React from "react";
import { SelectHook } from "@/interfaces/hook.interface";

export default function useSelect<T>(
  initialValue: SelectHook,
  collateralState: React.Dispatch<React.SetStateAction<T>>,
) {
  const [select, setSelect] = React.useState<SelectHook>({
    label: initialValue.label,
    value: initialValue.value,
  });

  const handleSelect = (
    label: string,
    value: string | number,
    target: string,
  ) => {
    setSelect({ label, value });
    collateralState((prev) => {
      return {
        ...prev,
        [target]: value,
      };
    });
  };

  return {
    select,
    handleSelect,
  };
}
