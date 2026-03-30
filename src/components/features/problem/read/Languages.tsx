import {
  LanguageModal,
  SupportedLanguages,
} from "@/src/interfaces/language.interface";
import React from "react";
import { FaXmark } from "react-icons/fa6";

const Languages = (props: LanguageModal) => {
  const languages: SupportedLanguages[] = React.useMemo(
    () => ["javascript", "php"],
    [],
  );

  const mappedLanguages = languages.map((language) => {
    return (
      <button
        key={language}
        onClick={() => props.selectLanguage(language)}
        className={`p-2 rounded-md capitalize text-sm 
                    ${props.currentLanguage === language ? "bg-primary text-secondary" : "bg-neutral-200 text-primary"}`}
      >
        {language}
      </button>
    );
  });

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center fixed top-0 
                  left-0 z-30 backdrop-blur-md bg-linear-to-b from-primary/20 to-primary/50 animate-fade"
    >
      <div className="w-full h-full flex flex-col items-center justify-center max-w-(--breakpoint-t) p-4 gap-2">
        <div className="w-full rounded-lg bg-primary text-secondary font-bold flex items-center justify-between p-4">
          <h1>Select Language</h1>

          <button
            onClick={props.closeModal}
            className="p-2 rounded-full hover:bg-secondary/20"
          >
            <FaXmark />
          </button>
        </div>
        <div className="w-full h-fit bg-secondary rounded-lg p-4 gap-2 flex">
          {mappedLanguages}
        </div>
      </div>
    </div>
  );
};

export default Languages;
