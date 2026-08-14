import Table from "@/src/components/ui/containers/Table";
import {
  GetAllSubmissionsResponse,
  SubmissionList,
} from "@/src/interfaces/submission.interface";
import { getErrorMessage } from "@/src/utils/general.util";
import { normalizeString } from "@/src/utils/normalizer.util";
import { errorToast } from "@/src/utils/toast.util";
import { DateTime } from "luxon";
import { useParams } from "next/navigation";
import React from "react";

// Lists the problem's submission history; clicking a row loads its result.
const ProblemSubmissions = (props: {
  getSubmission: (id: number) => Promise<void>;
}) => {
  const [submissions, setSubmissions] = React.useState<SubmissionList[]>([]);

  const params: { slug?: string } | null = useParams();

  // Loads the submission history on mount / slug change.
  React.useEffect(() => {
    const getSubmissions = async () => {
      try {
        if (!params?.slug) return;

        const query = new URLSearchParams({
          problem: params.slug,
          source: "problem",
        }).toString();

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
        errorToast(getErrorMessage(error));
      }
    };

    getSubmissions();
  }, [params?.slug]);

  const mappedSubmission = submissions.map((submission) => {
    return (
      <button
        key={submission.id}
        onClick={() => props.getSubmission(submission.id)}
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
          <span>{DateTime.fromSQL(submission.created_at).toFormat("DDD")}</span>
        </p>
      </button>
    );
  });

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
