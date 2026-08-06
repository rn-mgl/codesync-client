import Input from "@/components/ui/fields/Input";
import Select from "@/components/ui/fields/Select";
import {
  SearchFilterProperties,
  SortFilterProperties,
} from "@/interfaces/filter.interface";
import React from "react";
import {
  FaSortAlphaDown,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import { FaGears, FaMagnifyingGlass, FaXmark } from "react-icons/fa6";

const SortFilter = (props: SortFilterProperties) => {
  return (
    <div className="w-full flex flex-col items-stretch gap-2 t:flex-row t:items-center t:w-fit">
      <div className="w-full t:w-72 relative flex flex-row items-center justify-start gap-2">
        <Select
          id="sortKey"
          name="sortKey"
          value={props.sortKey}
          activeLabel={props.activeLabel}
          onChange={props.handleSortKey}
          options={props.options}
        />

        <button
          onClick={props.handleIsAsc}
          className="p-3 rounded-md aspect-square border-2 text-neutral-500 border-neutral-400"
        >
          {props.isAsc ? <FaSortAmountDown /> : <FaSortAmountUp />}
        </button>
      </div>
    </div>
  );
};

export default SortFilter;
