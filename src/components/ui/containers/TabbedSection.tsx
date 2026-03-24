import { TabbedSectionProps } from "@/src/interfaces/container.interface";
import React from "react";

const TabbedSection = (props: TabbedSectionProps) => {
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleTabIndex = (index: number) => {
    setTabIndex(index);
  };

  const mappedTabs = props.content.map((_, index) => {
    return (
      <button
        key={index}
        onClick={() => handleTabIndex(index)}
        className={`p-2 rounded-md text-xs font-medium border-2 border-neutral-400 transition-all text-nowrap
                    ${tabIndex === index ? "bg-primary text-secondary" : "bg-neutral-200"}`}
      >
        {props.label} {index + 1}
      </button>
    );
  });

  return (
    <div className="w-full h-full flex flex-col items-start justify-start gap-2 border p-2 rounded-md border-neutral-400">
      <div className="w-full flex items-start justify-start gap-2 overflow-x-auto overflow-y-hidden min-h-fit">
        {mappedTabs}
      </div>

      <div className="w-full h-full flex flex-col items-start justify-start gap-2">
        {props.content[tabIndex]}
      </div>
    </div>
  );
};

export default TabbedSection;
