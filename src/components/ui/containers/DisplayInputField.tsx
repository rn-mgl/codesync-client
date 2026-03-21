import { IDisplayInputField } from "@/src/interfaces/container.interface";

const DisplayInputField = (props: IDisplayInputField) => {
  return (
    <div className="w-full flex flex-col items-start justify-center bg-secondary gap-1">
      {props.label ? (
        <label htmlFor="email" className="text-xs text-primary/80 font-medium">
          {props.label}
        </label>
      ) : null}

      <div className="w-full flex flex-col items-center justify-center relative">
        <div className="w-full p-2 px-3 rounded-md text-primary border-2 border-neutral-400 outline-none">
          <p>{props.value}</p>
        </div>

        {props.icon ? (
          <div className="absolute right-0.5 rounded-sm bg-inherit p-2.5 text-neutral-500">
            {props.icon}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default DisplayInputField;
