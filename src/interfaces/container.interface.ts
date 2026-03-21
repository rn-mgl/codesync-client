import { JSX } from "react";

export interface TableProps<T extends Record<string, unknown>> {
  headers: (keyof T & string)[];
  data: JSX.Element[];
}

interface BaseDisplayField {
  value: string | number;
  label?: string;
  icon?: React.ReactElement;
}

export type DisplayInputFieldProps = BaseDisplayField;

export type DisplayTextAreaProps = BaseDisplayField;
