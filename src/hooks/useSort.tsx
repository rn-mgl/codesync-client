import React from "react";
import { SortFilterOption } from "../interfaces/filter.interface";
import { OptionValue } from "../interfaces/field.interface";

export default function useSort(
  options: SortFilterOption[],
  defaultKey: string,
) {
  const [sortKey, setSortKey] = React.useState(defaultKey);
  const [isAsc, setIsAsc] = React.useState(true);

  const activeOption =
    options.find((option) => option.value === sortKey) ?? options[0];

  const handleSortKey = (option: OptionValue) => {
    setSortKey(String(option));
  };

  const handleIsAsc = () => {
    setIsAsc((prev) => !prev);
  };

  return {
    sortKey,
    isAsc,
    activeLabel: activeOption.label,
    handleSortKey,
    handleIsAsc,
  };
}
