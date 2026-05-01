import Table from "@/src/components/ui/containers/Table";
import {
  GetAllSubmissionsResponse,
  SubmissionList,
} from "@/src/interfaces/submission.interface";

import { useParams } from "next/navigation";
import React from "react";

const ProblemSubmissions = () => {
  const [submissions, setSubmissions] = React.useState<SubmissionList[]>([]);

  const params: { slug?: string } | null = useParams();

  const mappedSubmission = submissions.map((submission) => {
    return (
      <div
        key={submission.id}
        className="w-full not-last:border-b-2 border-neutral-400 transition-all
                  hover:bg-neutral-200 first:rounded-t-md last:rounded-b-md"
      >
        <div className="w-full grid grid-cols-4 p-2 gap-4 text-sm *:p-2">
          <p>{submission.id}</p>
          <p className="capitalize">{submission.language}</p>
          <p>{submission.execution_time_ms}</p>
          <p>{submission.memory_used_mb}</p>
        </div>
      </div>
    );
  });

  React.useEffect(() => {
    const getSubmission = async () => {
      try {
        if (!params?.slug) return;

        const searchParams = {
          problem: params.slug,
        };

        const query = new URLSearchParams(searchParams).toString();

        const response = await fetch(`/api/submission?${query}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const resolve: GetAllSubmissionsResponse = await response.json();

        if (!resolve.success) {
          throw new Error(resolve.message);
        }

        const { submissions } = resolve.data;

        setSubmissions(submissions);
      } catch (error) {
        console.log(error);
      }
    };

    getSubmission();
  }, [params?.slug]);

  return (
    <Table<SubmissionList>
      headers={["id", "language", "execution_time_ms", "memory_used_mb"]}
      data={mappedSubmission}
    />
  );
};

export default ProblemSubmissions;
