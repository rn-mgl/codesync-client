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
    setSortKey(String(option.value));
  };

  const handleIsAsc = () => {
    setIsAsc((prev) => !prev);
  };

  const sort = React.useCallback(
    <T,>(items: T[]) => {
      return items.sort((a, b) => {
        const aVal = a[sortKey as keyof T];
        const bVal = b[sortKey as keyof T];

        if (isAsc) {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal > bVal ? -1 : 1;
        }
      });
    },
    [isAsc, sortKey],
  );

  return {
    sortKey,
    isAsc,
    activeLabel: activeOption.label,
    handleSortKey,
    handleIsAsc,
    sort,
  };
}
