import {
  SearchFilterOption,
  SortFilterOption,
} from "@/interfaces/filter.interface";

export const PROBLEM_SEARCH_OPTIONS: SearchFilterOption[] = [
  { label: "Title", value: "title" },
  { label: "Difficulty", value: "difficulty" },
];

export const PROBLEM_SORT_OPTIONS: SortFilterOption[] = [
  { label: "Title", value: "title" },
  { label: "Difficulty", value: "difficulty" },
  { label: "ID", value: "id" },
];

export const TOPIC_SEARCH_OPTIONS: SearchFilterOption[] = [
  { label: "Name", value: "name" },
  { label: "Description", value: "description" },
];

export const TOPIC_SORT_OPTIONS: SortFilterOption[] = [
  { label: "Name", value: "name" },
  { label: "Description", value: "description" },
];

export const ACHIEVEMENT_SEARCH_OPTIONS: SearchFilterOption[] = [
  { label: "Name", value: "name" },
  { label: "Description", value: "description" },
  { label: "Category", value: "category" },
  { label: "Points", value: "points" },
];

export const ACHIEVEMENT_SORT_OPTIONS: SortFilterOption[] = [
  { label: "Name", value: "name" },
  { label: "Category", value: "category" },
  { label: "Points", value: "points" },
];

export const HINT_SEARCH_OPTIONS: SearchFilterOption[] = [
  { label: "Problem", value: "problem" },
];

export const HINT_SORT_OPTIONS: SortFilterOption[] = [
  { label: "Problem", value: "problem" },
  { label: "Count", value: "count" },
];

export const TEST_CASE_SEARCH_OPTIONS: SearchFilterOption[] = [
  { label: "Problem", value: "problem" },
];

export const TEST_CASE_SORT_OPTIONS: SortFilterOption[] = [
  { label: "Problem", value: "problem" },
  { label: "Count", value: "count" },
];

export const PROBLEM_TEST_CASE_SEARCH_OPTIONS: SearchFilterOption[] = [
  { label: "Expected Output", value: "expected_output" },
  { label: "ID", value: "id" },
];

export const PROBLEM_TEST_CASE_SORT_OPTIONS: SortFilterOption[] = [
  { label: "ID", value: "id" },
  { label: "Time Limit", value: "time_limit_ms" },
  { label: "Memory Limit", value: "memory_limit_mb" },
];

export const JOB_SEARCH_OPTIONS: SearchFilterOption[] = [
  { label: "Name", value: "name" },
  { label: "ID", value: "id" },
];

export const JOB_SORT_OPTIONS: SortFilterOption[] = [
  { label: "Name", value: "name" },
  { label: "Timestamp", value: "timestamp" },
  { label: "Processed On", value: "processedOn" },
];
