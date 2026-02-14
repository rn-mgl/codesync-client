import { HTMLInputTypeAttribute, ReactElement } from "react";

export interface InputFieldInterface {
  type: HTMLInputTypeAttribute;
  name: string;
  id: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  required?: boolean;
  icon?: ReactElement;
}
