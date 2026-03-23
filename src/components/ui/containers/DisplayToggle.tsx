import { DisplayToggleProps } from "@/src/interfaces/container.interface";

const DisplayToggle = (props: DisplayToggleProps) => {
  return (
    <div className="w-full flex flex-col items-start justify-center bg-secondary gap-1">
      {props.label ? (
        <label className="text-xs text-primary/80 font-medium">
          {props.label}
        </label>
      ) : null}

      <div className="w-full flex flex-col items-start justify-center relative">
        <label className="w-fit flex items-center justify-start">
          <div
            className={`p-1 rounded-md w-14 border-2 border-neutral-400 transition-all ${props.checked ? "bg-primary" : "bg-secondary"}`}
          >
            <div
              className={`w-5 h-5 rounded-sm transition-all ${props.checked ? "bg-secondary translate-x-6" : "bg-neutral-400 translate-x-0"}`}
            />
          </div>
        </label>
      </div>
    </div>
  );
};

export default DisplayToggle;
