import { InputFormat } from "../interfaces/problem.interface";

export const generateBoilerPlate = (inputFormat: InputFormat) => {
  const style = inputFormat.style; // function or class
  const name = inputFormat.name; // function or class name
  const parameters = inputFormat.params.map((param) => param.name).join(", "); // parameters

  const boilerPlate = `${style} ${name} (${parameters}) {\n\t\n}`;

  return boilerPlate;
};
