import { normalizeString } from "@/src/helpers/normalizer.helper";
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
    <div className="flex flex-col items-start justify-start overflow-x-auto w-full max-w-(--breakpoint-l-l)">
      <div className="w-full min-w-(--breakpoint-t) grid grid-cols-1 gap-2">
        <div
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0, ${columns}fr))`,
          }}
          className="grid gap-4 p-4 w-full bg-primary text-secondary rounded-md"
        >
          {mappedHeaders}
        </div>

        <div className="bg-secondary border-2 border-neutral-400 rounded-md grid grid-cols-1 w-full">
          {props.data}
        </div>
      </div>
    </div>
  );
};

export default Table;
