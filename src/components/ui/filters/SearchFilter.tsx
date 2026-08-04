import Input from "@/components/ui/fields/Input";
import Select from "@/components/ui/fields/Select";
import { SearchFilterProperties } from "@/interfaces/filter.interface";
import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

const SearchFilter = (props: SearchFilterProperties) => {
  return (
    <div className="w-full flex flex-col items-stretch gap-2 t:flex-row t:items-center">
      <div className="w-full t:w-72">
        <Input
          id="searchValue"
          name="searchValue"
          type="text"
          placeholder={props.placeholder ?? "Search"}
          icon={<FaMagnifyingGlass />}
          value={props.searchValue}
          onChange={props.handleSearchValue}
        />
      </div>

      <div className="w-full t:w-44">
        <Select
          id="searchKey"
          name="searchKey"
          value={props.searchKey}
          activeLabel={props.activeLabel}
          onChange={props.handleSearchKey}
          options={props.options}
        />
      </div>
    </div>
  );
};

export default SearchFilter;
