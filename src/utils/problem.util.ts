import { SupportedLanguages } from "../interfaces/language.interface";
import { InputFormat } from "../interfaces/problem.interface";

export const generateBoilerPlate = (
  inputFormat: InputFormat,
  language: SupportedLanguages,
) => {
  const style = inputFormat.style; // function or class
  const name = inputFormat.name; // function or class name
  const parameters = inputFormat.params.map((param) => param.name).join(", "); // parameters

  let boilerPlate: string = "";

  switch (language) {
    case "javascript":
      boilerPlate = `${style} ${name} (${parameters}) {\n\t\n}`;
      break;
    case "php":
      boilerPlate = `<?php\n\n${style} ${name} (${parameters}) {\n\t\n}\n\n?>`;
      break;
  }

  return boilerPlate;
};
