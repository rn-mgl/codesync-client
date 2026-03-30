export interface LanguageModal {
  currentLanguage: SupportedLanguages;
  closeModal: () => void;
  selectLanguage: (language: SupportedLanguages) => void;
}

export type SupportedLanguages = "javascript" | "php";
