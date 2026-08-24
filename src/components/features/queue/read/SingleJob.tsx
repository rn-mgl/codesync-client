"use client";

import BlockLoader from "@/src/components/ui/loader/BlockLoader";
import { renderJSON } from "@/src/components/features/achievement/read/JsonRenderer";
import { GetJobResponse, JobData } from "@/src/interfaces/queue.interface";
import { getErrorMessage } from "@/src/utils/general.util";
import { normalizeString } from "@/src/utils/normalizer.util";
import { errorToast } from "@/src/utils/toast.util";
import { FaXmark } from "react-icons/fa6";
import React from "react";

const SingleJob = (props: {
  id: string;
  type: string;
  closeModal: () => void;
}) => {
  const [job, setJob] = React.useState<JobData | null>(null);

  React.useEffect(() => {
    if (!props.id) return;

    const getJob = async () => {
      try {
        const searchParams = {
          type: props.type,
        };

        const query = new URLSearchParams(searchParams).toString();

        const response = await fetch(`/api/queue/${props.id}?${query}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const resolve: GetJobResponse = await response.json();

        if (!resolve.success) {
          throw new Error(resolve.message);
        }

        const { job } = resolve.data;

        console.log("raw job:", JSON.stringify(job));

        setJob(job);
      } catch (error) {
        errorToast(getErrorMessage(error));
      }
    };

    getJob();
  }, [props.id, props.type]);

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center fixed top-0 
                      left-0 z-30 backdrop-blur-md bg-linear-to-b from-primary/20 to-accent/20 animate-fade"
    >
      <div className="w-full h-full flex flex-col items-center justify-center max-w-(--breakpoint-l-l) p-4 gap-2">
        <div className="w-full rounded-lg capitalize bg-primary text-secondary font-bold flex items-center justify-between p-4">
          <h1>
            {job ? `Job Details - ${normalizeString(job.name)}` : "Job Details"}
          </h1>

          <button
            onClick={props.closeModal}
            className="p-2 rounded-full hover:bg-secondary/20"
          >
            <FaXmark />
          </button>
        </div>

        <div className="w-full h-auto max-h-full bg-secondary rounded-lg p-8 flex flex-col items-start justify-start overflow-y-auto">
          {!job ? <BlockLoader count={5} /> : renderJSON(job)}
        </div>
      </div>
    </div>
  );
};

export default SingleJob;
