import { normalizeString } from "@/utils/normalizer.util";

const LABEL_STYLE = "text-primary/60 font-medium whitespace-nowrap";

const renderArray = (array: unknown[], depth: number) => {
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
  if (Array.isArray(value)) {
    return renderArray(value, depth);
  }

  if (typeof value === "object" && value !== null) {
    return renderJSON(value, depth + 1);
  }

  if (typeof value === "string") {
    return normalizeString(value);
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
        className="flex flex-col gap-1"
        style={depth > 0 ? { paddingLeft: depth * 0.75 + "rem" } : undefined}
      >
        <div className="flex flex-row items-start gap-2 text-sm">
          <span className={LABEL_STYLE}>{normalizeString(key)}:</span>
          {!isObject && <span>{renderValue(key, value, depth)}</span>}
        </div>
        {isObject && renderValue(key, value, depth)}
      </div>
    );
  });

export const renderObject = (object: object, depth: number) => (
  <div className="flex flex-col gap-1">
    {renderEntries(Object.entries(object), depth)}
  </div>
);

export const renderJSON = (json: object, depth = 0) => (
  <div className="flex flex-col gap-1">
    {renderEntries(Object.entries(json), depth)}
  </div>
);
