import { HTMLInputTypeAttribute, ReactElement } from "react";

interface BaseFieldProperties {
  name: string;
  id: string;
  value: string | number;
  label?: string;
  required?: boolean;
  icon?: ReactElement;
}
export interface InputField extends BaseFieldProperties {
  type: HTMLInputTypeAttribute;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface SelectField extends BaseFieldProperties {
  options: Array<{ label: string; value: string | number }>;
  activeLabel: string;
  onChange: (label: string, value: string | number, target: string) => void;
}
