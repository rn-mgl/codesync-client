import { InputFormat } from "../interfaces/problem.interface";

export const generateBoilerPlate = (inputFormat: InputFormat) => {
  const style = inputFormat.style;
  const name = inputFormat.name;
  const parameters = inputFormat.params.map((param) => param.name).join(", ");

  const boilerPlate = `${style} ${name} (${parameters}) {\n\t\n}`;

  return boilerPlate;
};
