import { SelectOptionValue } from "@/interfaces/field.interface";
import { SearchFilterOption } from "@/interfaces/filter.interface";
import React from "react";
import { normalizeString } from "../utils/normalizer.util";

export default function useSearch(
  options: SearchFilterOption[],
  defaultKey: string,
) {
  const [searchKey, setSearchKey] = React.useState(defaultKey);
  const [searchValue, setSearchValue] = React.useState("");

  const activeOption =
    options.find((option) => option.value === searchKey) ?? options[0];

  const handleSearchKey = (option: SelectOptionValue) => {
    setSearchKey(String(option.value));
  };

  const handleSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const filter = React.useCallback(
    <T,>(items: T[]) => {
      const value = searchValue.trim().toLowerCase();

      if (!value) {
        return items;
      }

      return items.filter((item) =>
        normalizeString(String(item[searchKey as keyof T]))
          .toLowerCase()
          .includes(value),
      );
    },
    [searchKey, searchValue],
  );

  return {
    searchKey,
    searchValue,
    searchLabel: activeOption.label,
    handleSearchKey,
    handleSearchValue,
    filter,
  };
}
