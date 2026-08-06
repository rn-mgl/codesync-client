import Input from "@/components/ui/fields/Input";
import Select from "@/components/ui/fields/Select";
import { SearchFilterProperties } from "@/interfaces/filter.interface";
import React from "react";
import { FaGears, FaMagnifyingGlass, FaXmark } from "react-icons/fa6";

const SearchFilter = (props: SearchFilterProperties) => {
  const [showOptions, setShowOptions] = React.useState(false);

  const handleShowOptions = () => {
    setShowOptions((prev) => !prev);
  };

  return (
    <div className="w-full flex flex-col items-stretch gap-2 t:flex-row t:items-center">
      <div className="w-full t:w-72 relative flex flex-row items-center justify-start gap-2">
        <div className="w-full flex flex-col items-center justify-start relative">
          <Input
            id="searchValue"
            name="searchValue"
            type="text"
            placeholder={props.placeholder ?? "Search"}
            icon={<FaMagnifyingGlass />}
            value={props.searchValue}
            onChange={props.handleSearchValue}
          />

          {showOptions && (
            <div className="absolute top-12 z-10 w-full p-1 rounded-md bg-primary/20 backdrop-blur-md">
              <Select
                id="searchKey"
                name="searchKey"
                value={props.searchKey}
                activeLabel={props.activeLabel}
                onChange={props.handleSearchKey}
                options={props.options}
              />
            </div>
          )}
        </div>

        <button
          onClick={handleShowOptions}
          className="p-3 rounded-md aspect-square border-2 text-neutral-500 border-neutral-400"
        >
          {showOptions ? <FaXmark /> : <FaGears />}
        </button>
      </div>
    </div>
  );
};

export default SearchFilter;
