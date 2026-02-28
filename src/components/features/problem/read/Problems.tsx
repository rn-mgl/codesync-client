"use client";

import Table from "@/src/components/ui/container/Table";
import {
  GetAllProblemsResponse,
  ProblemList,
} from "@/src/interfaces/problem.interface";
import React from "react";

const Problems = () => {
  const [problems, setProblems] = React.useState<ProblemList[]>([]);

  const getProblems = React.useCallback(async () => {
    try {
      const response = await fetch("/api/problem", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resolve: GetAllProblemsResponse = await response.json();

      if (!resolve.success) {
        throw new Error(resolve.message);
      }

      setProblems(resolve.data.problems);
    } catch (err) {
      console.error(err);
    }

    return;
  }, []);

  React.useEffect(() => {
    getProblems();
  }, [getProblems]);

  return (
    <Table<ProblemList>
      headers={["id", "title", "difficulty", "acceptance_rate"]}
      data={problems}
    />
  );
};

export default Problems;
