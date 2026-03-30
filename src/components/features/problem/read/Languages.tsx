import {
  LanguageModal,
  SupportedLanguages,
} from "@/src/interfaces/language.interface";
import React from "react";

const Languages = (props: LanguageModal) => {
  const languages: SupportedLanguages[] = React.useMemo(
    () => ["javascript", "php"],
    [],
  );

  const mappedLanguages = languages.map((language) => {
    return (
      <button
        key={language}
        onClick={() => {
          props.selectLanguage(language);
          props.closeModal();
        }}
        className={`p-2 rounded-md capitalize text-xs
                    ${props.currentLanguage === language ? "bg-primary text-secondary" : "bg-neutral-200 text-primary"}`}
      >
        {language}
      </button>
    );
  });

  return (
    <div
      className="w-full rounded-md flex flex-col items-center justify-center absolute top-0 translate-y-10
                  left-0 z-30 backdrop-blur-md bg-linear-to-b from-secondary/20 to-secondary/50 animate-fade"
    >
      <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-2">
        <div className="w-full h-fit bg-secondary rounded-lg p-4 gap-2 flex">
          {mappedLanguages}
        </div>
      </div>
    </div>
  );
};

export default Languages;
