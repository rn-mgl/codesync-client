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
                  ${l === props.limit ? "bg-primary text-secondary" : "bg-neutral-200 text-primary"}`}
      >
        {l}
      </button>
    );
  });

  return (
    <div className="flex flex-col w-full justify-between gap-4 t:flex-row-reverse">
      <div className="w-full max-w-(--breakpoint-m-l) flex items-center justify-center overflow-x-auto gap-1 t:w-fit">
        {mappedPages}
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
