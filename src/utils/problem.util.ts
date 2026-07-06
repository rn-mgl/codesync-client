import { SupportedLanguages } from "@/interfaces/language.interface";
import { InputFormat, OutputFormat } from "@/interfaces/problem.interface";

export const generateBoilerPlate = (
  inputFormat: InputFormat,
  outputFormat: OutputFormat,
  language: SupportedLanguages,
) => {
  const style = inputFormat.style; // function or class
  const name = inputFormat.name; // function or class name
  const methodName = inputFormat.method ?? "solve";

  let boilerPlate: string = "";
  let parameters: string = "";

  switch (language) {
    case "javascript":
      parameters = inputFormat.params.map((param) => param.name).join(", "); // parameters
      boilerPlate =
        style === "class"
          ? `class ${name} {\n\t${methodName}(${parameters}) {\n\t\t\n\t}\n}`
          : `function ${name}(${parameters}) {\n\t\n}`;
      break;
    case "php":
      parameters = inputFormat.params
        .map((param) => `$${param.name}`)
        .join(", ");
      boilerPlate =
        style === "class"
          ? `<?php\n\nclass ${name} {\n\tpublic function ${methodName}(${parameters}) {\n\t\t\n\t}\n}\n\n?>`
          : `<?php\n\nfunction ${name}(${parameters}) {\n\t\n}\n\n?>`;
      break;
    case "java":
      parameters = inputFormat.params
        .map((param) => `${getJavaType(param.type)} ${param.name}`)
        .join(", ");
      boilerPlate =
        style === "class"
          ? `static class ${name} {\n\tpublic ${getJavaType(outputFormat.type)} ${methodName}(${parameters}) {\n\t\t\n\t}\n}`
          : `static ${getJavaType(outputFormat.type)} ${name}(${parameters}) {\n\t\n}`;
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
    number: "int",
    double: "double",
    float: "float",
    boolean: "boolean",
    bool: "boolean",
    string: "String",
    char: "char",
    character: "char",
    object: "Object",
    treenode: "TreeNode",
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
