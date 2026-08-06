import React from "react";
import { OptionValue } from "@/interfaces/field.interface";

export interface PaginateProperties {
  limit: number;
  canSelectLimit: boolean;
  page: number;
  pages: number;
  handleLimit: (limit: number) => void;
  handlePage: (page: number) => void;
  handleCanSelectLimit: () => void;
}

export interface SearchFilterOption {
  label: string;
  value: string;
}

export interface SortFilterOption {
  label: string;
  value: string;
}

export interface SearchFilterProperties {
  searchKey: string;
  searchValue: string;
  activeLabel: string;
  options: SearchFilterOption[];
  placeholder?: string;
  handleSearchValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchKey: (option: OptionValue) => void;
}

export interface SortFilterProperties {
  sortKey: string;
  isAsc: boolean;
  activeLabel: string;
  options: SearchFilterOption[];
  placeholder?: string;
  handleSortKey: (option: OptionValue) => void;
  handleIsAsc: () => void;
}
