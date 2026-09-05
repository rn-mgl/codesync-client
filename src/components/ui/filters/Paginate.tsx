import React from "react";
import { PaginateProperties } from "@/src/interfaces/filter.interface";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const Paginate = (props: PaginateProperties) => {
  const [inputValue, setInputValue] = React.useState(String(props.page));
  const [prevPage, setPrevPage] = React.useState(props.page);

  if (prevPage !== props.page) {
    setPrevPage(props.page);
    setInputValue(String(props.page));
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setInputValue(value);
  };

  const handleInputSubmit = () => {
    const num = Number(inputValue);

    if (!Number.isNaN(num) && num >= 0 && num < props.pages) {
      props.handlePage(num);
    } else {
      setInputValue(String(props.page));
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleInputSubmit();
  };

  const mappedBoxes = [-2, -1, 0, 1, 2].map((offset) => {
    if (offset === 0) {
      return (
        <input
          key="page-input"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputSubmit}
          onKeyDown={handleInputKeyDown}
          className="p-2 border-b aspect-square w-10 min-w-10 text-xs text-center bg-secondary text-primary outline-none"
        />
      );
    }

    const pageNum = props.page + offset;

    if (pageNum < 0 || pageNum >= props.pages)
      return (
        <div
          key={`page-${pageNum}`}
          className="p-2 rounded-sm border aspect-square w-10 min-w-10 text-xs bg-neutral-300"
        ></div>
      );

    return (
      <button
        type="button"
        key={`page-${pageNum}`}
        onClick={() => props.handlePage(pageNum)}
        className={`p-2 rounded-sm border aspect-square w-10 min-w-10 text-xs 
                  ${props.page === pageNum ? "bg-primary text-secondary" : "bg-secondary text-primary"}`}
      >
        {pageNum}
      </button>
    );
  });

  const mappedLimits = [10, 25, 50, 100].map((l) => {
    return (
      <button
        type="button"
        key={l}
        onClick={() => props.handleLimit(l)}
        className={`p-2 rounded-sm border aspect-square w-10 text-xs 
                  ${l === props.limit ? "bg-primary text-secondary" : "bg-neutral-200 text-primary"}`}
      >
        {l}
      </button>
    );
  });

  return (
    <div className="flex flex-col w-full justify-between gap-4 t:flex-row-reverse">
      <div className="w-full flex items-center justify-center gap-1 t:w-fit">
        <button
          type="button"
          onClick={() => props.handlePage(Math.max(0, props.page - 1))}
          disabled={props.page === 0}
          className="p-1.5 flex flex-col items-center justify-center rounded-sm border aspect-square w-10 min-w-10 text-xs bg-secondary text-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaChevronLeft className="text-xs p-0.5" />
        </button>

        {mappedBoxes}

        <button
          type="button"
          onClick={() =>
            props.handlePage(Math.min(props.pages - 1, props.page + 1))
          }
          disabled={props.page >= props.pages - 1}
          className="p-1.5 flex flex-col items-center justify-center rounded-sm border aspect-square w-10 min-w-10 text-xs bg-secondary text-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaChevronRight className="text-xs p-0.5" />
        </button>
      </div>

      <div className="relative flex flex-row items-start justify-start gap-2">
        <div className="flex flex-row items-center justify-center gap-2">
          <span className="text-sm">Show</span>

          <button
            onClick={props.handleCanSelectLimit}
            className="p-1 text-sm border font-medium rounded-sm aspect-square w-10"
          >
            {props.limit}
          </button>
        </div>

        {props.canSelectLimit ? (
          <div className="flex flex-row items-center justify-start gap-1 absolute left-22.5 top-0 animate-fade z-20">
            {mappedLimits}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Paginate;
