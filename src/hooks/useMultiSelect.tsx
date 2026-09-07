import React from "react";
import { MultiSelectOptionValue } from "../interfaces/field.interface";

export default function useMultiSelect() {
  const [selected, setSelected] = React.useState<MultiSelectOptionValue[]>([]);

  const handleSelected = (option: MultiSelectOptionValue) => {
    setSelected((prev) => {
      const index = prev.findIndex((t) => option.value === t.value);

      const value =
        index === -1
          ? [...prev, option]
          : [...prev.slice(0, index), ...prev.slice(index + 1)];

      return value;
    });
  };

  return { selected, handleSelected };
}
