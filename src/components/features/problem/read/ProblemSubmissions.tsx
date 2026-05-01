import Table from "@/src/components/ui/containers/Table";
import {
  GetAllSubmissionsResponse,
  SubmissionList,
} from "@/src/interfaces/submission.interface";

import { useParams } from "next/navigation";
import React from "react";
import { DateTime } from "luxon";
import { normalizeString } from "@/src/utils/normalizer.util";

const ProblemSubmissions = () => {
  const [submissions, setSubmissions] = React.useState<SubmissionList[]>([]);

  const params: { slug?: string } | null = useParams();

  const getSubmission = async (id: number) => {
    try {
      const response = await fetch(`/api/submission/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resolve = await response.json();

      console.log(resolve);
    } catch (error) {
      console.log(error);
    }
  };

  const mappedSubmission = submissions.map((submission) => {
    return (
      <button
        key={submission.id}
        onClick={() => getSubmission(submission.id)}
        className="w-full not-last:border-b-2 border-neutral-400 transition-all
                  hover:bg-neutral-200 first:rounded-t-md last:rounded-b-md text-left"
      >
        <p className="w-full grid grid-cols-5 p-2 gap-4 text-sm *:p-2">
          <span className="capitalize">
            {normalizeString(submission.status)}
          </span>
          <span className="capitalize">{submission.language}</span>
          <span>{submission.execution_time_ms} ms</span>
          <span>{submission.memory_used_mb} mb</span>
          <span>{DateTime.fromISO(submission.created_at).toFormat("DDD")}</span>
        </p>
      </button>
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
      headers={[
        "status",
        "language",
        "execution_time_ms",
        "memory_used_mb",
        "created_at",
      ]}
      data={mappedSubmission}
    />
  );
};

export default ProblemSubmissions;
