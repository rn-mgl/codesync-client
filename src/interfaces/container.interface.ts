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

export interface DisplayToggleProps extends Omit<BaseDisplayField, "value"> {
  checked: boolean;
}

export interface TabbedSectionProps {
  content: JSX.Element[];
  label: string;
}
