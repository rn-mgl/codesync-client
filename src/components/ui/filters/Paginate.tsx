import { PaginateProperties } from "@/src/interfaces/filter.interface";

const Paginate = (props: PaginateProperties) => {
  const mappedPages = new Array(props.pages).fill(0).map((_, i) => {
    return (
      <button
        key={i}
        onClick={() => props.handlePage(i)}
        className={`p-2 rounded-sm border aspect-square w-10 min-w-10 text-xs 
                  ${props.page === i ? "bg-primary text-secondary" : "bg-secondary text-primary"}`}
      >
        {i}
      </button>
    );
  });

  const mappedLimits = [10, 25, 50, 100].map((l) => {
    return (
      <button
        key={l}
        onClick={() => props.handleLimit(l)}
        className={`p-2 rounded-sm border aspect-square w-10 text-xs 
                  ${l === props.limit ? "bg-primary text-secondary" : "bg-secondary text-primary"}`}
      >
        {l}
      </button>
    );
  });

  return (
    <div className="flex flex-row w-full justify-between">
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
          <div className="flex flex-col items-center justify-start gap-1 absolute right-0 top-12 animate-fade">
            {mappedLimits}
          </div>
        ) : null}
      </div>

      <div className="w-fit max-w-(--breakpoint-m-m) flex items-center justify-start overflow-x-auto gap-1">
        {mappedPages}
      </div>
    </div>
  );
};

export default Paginate;
