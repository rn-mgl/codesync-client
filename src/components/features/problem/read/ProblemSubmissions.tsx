import {
  BaseSubmission,
  GetAllSubmissionsResponse,
} from "@/src/interfaces/submission.interface";

import { useParams } from "next/navigation";
import React from "react";

const ProblemSubmissions = () => {
  const [submission, setSubmissions] = React.useState<BaseSubmission[]>([]);

  const params: { slug?: string } | null = useParams();

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

  console.log(submission);

  return <div>ProblemSubmissions</div>;
};

export default ProblemSubmissions;
