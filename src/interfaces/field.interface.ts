import * as Monaco from "monaco-editor";
import { HTMLInputTypeAttribute, ReactElement } from "react";
import { SupportedLanguages } from "./language.interface";
import { Editor } from "@tiptap/react";

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

export interface OptionValue {
  label: string;
  value: string | number;
  target: string;
}

export interface SelectField extends BaseFieldProperties {
  options: Array<{ label: string; value: string | number }>;
  activeLabel: string;
  onChange: (option: OptionValue) => void;
}

export interface TextAreaField extends BaseFieldProperties {
  columns?: number;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export interface ToggleField extends Omit<
  BaseFieldProperties,
  "icon" | "value"
> {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface CodeEditorProps {
  ref: React.RefObject<Monaco.editor.IStandaloneCodeEditor | null>;
  boilerPlate: string;
  language: SupportedLanguages;
  readOnly?: boolean;
}

export interface RichTextEditorProps {
  ref: React.RefObject<Editor | null>;
}
