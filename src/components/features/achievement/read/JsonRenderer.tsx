import { normalizeString } from "@/utils/normalizer.util";

const LABEL_STYLE = "text-primary/60 font-medium whitespace-nowrap capitalize";

const renderArray = (array: unknown[], depth: number) => {
  if (array.length === 0) {
    return <span className="text-sm">-</span>;
  }

  const hasObjects = array.some(
    (item) => typeof item === "object" && item !== null && !Array.isArray(item),
  );

  if (hasObjects) {
    return array.map((data, index) => {
      if (typeof data === "object" && data !== null && !Array.isArray(data)) {
        return (
          <div
            key={index}
            className="border-l-2 border-neutral-400 pl-3 py-1 flex flex-col gap-1"
          >
            {renderJSON(data, depth + 1)}
          </div>
        );
      }

      return (
        <div key={index} className="text-sm">
          {String(data)}
        </div>
      );
    });
  }

  return (
    <span className="text-sm">
      {array
        .map((item) =>
          typeof item === "string" ? normalizeString(item) : String(item),
        )
        .join(", ")}
    </span>
  );
};

const renderValue = (key: string, value: unknown, depth: number) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (Array.isArray(value)) {
    return renderArray(value, depth);
  }

  if (typeof value === "object") {
    return renderJSON(value, depth + 1);
  }

  if (typeof value === "string") {
    return value;
  }

  return JSON.stringify(value);
};

const renderEntries = (entries: [string, unknown][], depth: number) =>
  entries.map(([key, value]) => {
    const isObject =
      typeof value === "object" && value !== null && !Array.isArray(value);

    return (
      <div
        key={key}
        className="flex flex-col gap-1 not-last:border-b border-neutral-400 justify-center py-2"
        style={depth > 0 ? { paddingLeft: depth * 2 + "rem" } : undefined}
      >
        <div className="flex flex-row items-start gap-2 text-sm">
          <pre className={LABEL_STYLE}>{normalizeString(key)}:</pre>
          {!isObject && <pre>{renderValue(key, value, depth)}</pre>}
        </div>
        {isObject && renderValue(key, value, depth)}
      </div>
    );
  });

export const renderObject = (object: object, depth: number) => (
  <div className="flex flex-col gap-1 w-full">
    {renderEntries(Object.entries(object), depth)}
  </div>
);

export const renderJSON = (json: object, depth = 0) => (
  <div className="flex flex-col gap-1 w-full">
    {renderEntries(Object.entries(json), depth)}
  </div>
);
