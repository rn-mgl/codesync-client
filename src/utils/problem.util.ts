import { SupportedLanguages } from "../interfaces/language.interface";
import { InputFormat } from "../interfaces/problem.interface";

export const generateBoilerPlate = (
  inputFormat: InputFormat,
  language: SupportedLanguages,
) => {
  const style = inputFormat.style; // function or class
  const name = inputFormat.name; // function or class name

  let boilerPlate: string = "";
  let parameters: string = "";

  switch (language) {
    case "javascript":
      parameters = inputFormat.params.map((param) => param.name).join(", "); // parameters
      boilerPlate = `${style} ${name} (${parameters}) {\n\t\n}`;
      break;
    case "php":
      parameters = inputFormat.params
        .map((param) => `$${param.name}`)
        .join(", ");
      boilerPlate = `<?php\n\n${style} ${name} (${parameters}) {\n\t\n}\n\n?>`;
      break;
  }

  return boilerPlate;
};
