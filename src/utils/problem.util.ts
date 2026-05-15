import { SupportedLanguages } from "@/interfaces/language.interface";
import { InputFormat } from "@/interfaces/problem.interface";

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
    case "java":
      parameters = inputFormat.params
        .map((param) => `${getJavaType(param.type)} ${param.name}`)
        .join(", ");
      boilerPlate = `static Object ${name}(${parameters}) {\n\t\n}`;
      break;
  }

  return boilerPlate;
};

const getJavaType = (type: string): string => {
  const normalized = type.toLowerCase().replace(/\s+/g, "");

  const mappedTypes: Record<string, string> = {
    int: "int",
    integer: "int",
    long: "long",
    number: "double",
    double: "double",
    float: "float",
    boolean: "boolean",
    bool: "boolean",
    string: "String",
    char: "char",
    character: "char",
    object: "Object",
    void: "void",
  };

  if (mappedTypes[normalized]) {
    return mappedTypes[normalized];
  }

  if (normalized.endsWith("[]")) {
    return `${getJavaType(normalized.slice(0, -2))}[]`;
  }

  return type;
};
