interface FullProblem {
  id: number;
  title: string;
  slug: string;
  description: string;
  input_format: string;
  output_format: string;
  constraints: string;
  editorial: string;
  difficulty: "easy" | "medium" | "hard";
}

export type FormProblem = Omit<FullProblem, "id">;
