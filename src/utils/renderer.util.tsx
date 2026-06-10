import { normalizeString } from "@/utils/normalizer.util";

export const renderArray = (array: unknown[]) => {
  return array.map((data, index) => {
    if (Array.isArray(data)) {
      return (
        <div key={index} className="rounded-sm capitalize flex flex-col gap-2">
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
        <div key={index} className="rounded-sm capitalize flex flex-col gap-2">
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
          className="flex flex-row items-start justify-start text-sm"
        >
          <span className="text-primary font-bold rounded-sm capitalize">
            {normalizeString(nestedKey)}:
          </span>

          <div className="rounded-sm capitalize flex flex-col gap-2">
            {Array.isArray(nestedValue)
              ? nestedValue.join(", ")
              : renderJSON(nestedValue)}
          </div>
        </div>
      );
    } else {
      <div
        key={nestedKey}
        className="flex flex-row items-start justify-start text-sm"
      >
        <span className="text-primary font-bold rounded-sm capitalize">
          {normalizeString(nestedKey)}:
        </span>

        <div className="rounded-sm capitalize">
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
        className="flex gap-1 flex-row items-start justify-start text-sm"
      >
        <span className="text-primary font-bold rounded-sm capitalize">
          {normalizeString(key)}:
        </span>

        <div className="rounded-sm capitalize flex flex-col gap-2">
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
