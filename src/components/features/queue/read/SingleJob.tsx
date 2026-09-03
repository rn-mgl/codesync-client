"use client";

import ListLoader from "@/src/components/ui/loader/ListLoader";
import { renderJSON } from "@/src/components/features/achievement/read/JsonRenderer";
import { GetJobResponse, JobData } from "@/src/interfaces/queue.interface";
import { getErrorMessage } from "@/src/utils/general.util";
import { normalizeString } from "@/src/utils/normalizer.util";
import { errorToast } from "@/src/utils/toast.util";
import { FaXmark } from "react-icons/fa6";
import { DateTime } from "luxon";
import React from "react";

const SingleJob = (props: {
  id: string;
  type: string;
  closeModal: () => void;
}) => {
  const [job, setJob] = React.useState<JobData | null>(null);

  const formatDelay = (delay: number | null | undefined) => {
    if (typeof delay !== "number") return delay;

    const totalSeconds = Math.max(0, Math.round(delay / 1000));

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const units: [number, string][] = [
      [days, "day"],
      [hours, "hour"],
      [minutes, "minute"],
      [seconds, "second"],
    ];

    const parts = units
      .filter(([value]) => value > 0)
      .map(([value, unit]) => `${value} ${unit}${value > 1 ? "s" : ""}`);

    return parts.length > 0 ? parts.join(", ") : "0 seconds";
  };

  const formatTimestamp = (timestamp: number | null | undefined) => {
    return typeof timestamp === "number"
      ? DateTime.fromMillis(timestamp).toFormat("DDD HH:mm:ss")
      : timestamp;
  };

  const renderJob = (job: JobData) => {
    const displayableJob = {
      ...job,
      timestamp: formatTimestamp(job.timestamp),
      processedOn: formatTimestamp(job.processedOn),
      finishedOn: formatTimestamp(job.finishedOn),
      delay: formatDelay(job.delay),
      opts: {
        ...job.opts,
        timestamp: formatTimestamp(job.opts.timestamp),
        prevMillis: formatTimestamp(job.opts.prevMillis),
        delay: formatDelay(job.opts.delay),
        repeat: job.opts.repeat
          ? {
              ...job.opts.repeat,
              delay: formatDelay(job.opts.repeat.delay),
              prevMillis: formatTimestamp(job.opts.repeat.prevMillis),
            }
          : undefined,
      },
    };

    return renderJSON(displayableJob);
  };

  React.useEffect(() => {
    if (!props.id) return;

    const getJob = async () => {
      try {
        const searchParams = {
          type: props.type,
          action: "details",
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
          {!job ? <ListLoader /> : renderJob(job)}
        </div>
      </div>
    </div>
  );
};

export default SingleJob;
