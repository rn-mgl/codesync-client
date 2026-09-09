import { normalizeString } from "@/src/utils/normalizer.util";
import { TableProps } from "@/src/interfaces/container.interface";
import React from "react";

const Table = <T extends Record<string, unknown>>(
  props: TableProps<T>,
): React.ReactElement => {
  const columns = React.useMemo(() => props.headers.length, [props]);

  const mappedHeaders = props.headers.map((d) => {
    return (
      <p key={d} className="capitalize font-bold p-2 text-nowrap">
        {normalizeString(d)}
      </p>
    );
  });

  return (
    <div className="flex flex-col items-start justify-start overflow-x-auto w-full h-full max-w-(--breakpoint-l-l)">
      <div className="w-full min-w-(--breakpoint-t) flex-1 flex flex-col gap-2">
        <div
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0, ${columns}fr))`,
          }}
          className="grid gap-4 p-4 w-full bg-primary text-secondary rounded-md text-sm"
        >
          {mappedHeaders}
        </div>

        <div className="flex-1 flex flex-col bg-secondary border-2 border-neutral-400 rounded-md w-full">
          {props.data.length > 0 ? (
            props.data
          ) : (
            <p className="w-full h-full flex items-center justify-center italic text-neutral-500 p-4 text-sm">
              No Data Available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Table;
