import { JSX } from "react";

export interface ITable<T extends Record<string, unknown>> {
  headers: (keyof T & string)[];
  data: JSX.Element[];
}

interface BaseDisplayField {
  value: string | number;
  label?: string;
  icon?: React.ReactElement;
}

export type IDisplayInputField = BaseDisplayField;

export type IDisplayTextArea = BaseDisplayField;
