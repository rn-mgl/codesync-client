import { normalizeString } from "./normalizer.util";

export const renderArray = (array: unknown[]) => {
  return array.map((data, index) => {
    if (Array.isArray(data)) {
      return (
        <div
          key={index}
          className="p-1 rounded-sm bg-neutral-300 capitalize flex flex-col gap-2"
        >
          {data.join(", ")}
        </div>
      );
    } else if (typeof data === "object" && data !== null) {
      return (
        <div
          key={index}
          className="flex flex-col gap-2 p-2 bg-neutral-200 rounded-xs"
        >
          {renderJSON(data)}
        </div>
      );
    } else {
      return (
        <div
          key={index}
          className=" p-1 rounded-sm bg-neutral-300 capitalize flex flex-col gap-2"
        >
          {typeof data !== "string"
            ? JSON.stringify(data)
            : normalizeString(data)}
        </div>
      );
    }
  });
};

export const renderObject = (object: object) => {
  return Object.entries(object).map(([nestedKey, nestedValue]) => {
    if (typeof nestedValue === "object" && nestedValue !== null) {
      return (
        <div
          key={nestedKey}
          className="flex flex-row gap-2 items-start justify-start text-sm"
        >
          <span className="text-secondary bg-primary p-1 px-2 rounded-sm capitalize">
            {normalizeString(nestedKey)}
          </span>

          <div className="p-1 rounded-sm bg-neutral-300 capitalize flex flex-col gap-2">
            {Array.isArray(nestedValue)
              ? nestedValue.join(", ")
              : renderJSON(nestedValue)}
          </div>
        </div>
      );
    } else {
      <div
        key={nestedKey}
        className="flex flex-row gap-2 items-start justify-start text-sm"
      >
        <span className="text-secondary bg-primary p-1 px-2 rounded-sm capitalize">
          {normalizeString(nestedKey)}
        </span>

        <div className="p-1 rounded-sm bg-neutral-300 capitalize">
          {JSON.stringify(nestedValue)}
        </div>
      </div>;
    }
  });
};

export const renderJSON = (json: object): React.ReactNode => {
  const rendered = Object.entries(json).map(([key, value]) => {
    return (
      <div
        key={key}
        className="flex flex-row gap-2 items-start justify-start text-sm"
      >
        <span className="text-secondary bg-primary p-1 px-2 rounded-sm capitalize">
          {normalizeString(key)}
        </span>

        <div
          className={`${typeof value === "object" && value !== null ? "p-2" : "p-1"} rounded-sm bg-neutral-300 capitalize flex flex-col gap-2`}
        >
          {Array.isArray(value)
            ? renderArray(value)
            : typeof value === "object" && value !== null
              ? renderObject(value)
              : typeof value === "string"
                ? normalizeString(value)
                : JSON.stringify(value)}
        </div>
      </div>
    );
  });

  return rendered;
};
