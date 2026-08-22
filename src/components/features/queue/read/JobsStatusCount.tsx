"use client";
import {
  GetAllJobsCount,
  JobStatusCount,
  JobsTypeCount,
} from "@/src/interfaces/queue.interface";
import { normalizeString } from "@/src/utils/normalizer.util";
import Link from "next/link";
import React from "react";

const JobsStatusCount = () => {
  const [jobs, setJobs] = React.useState<JobsTypeCount>({
    background: {
      active: 1,
      completed: 0,
      delayed: 11,
      failed: 0,
      paused: 0,
      prioritized: 0,
      waiting: 0,
      "waiting-children": 0,
    },
    listener: {
      active: 1,
      completed: 0,
      delayed: 11,
      failed: 0,
      paused: 0,
      prioritized: 0,
      waiting: 0,
      "waiting-children": 0,
    },
  });

  React.useEffect(() => {
    const getJobs = async () => {
      try {
        const response = await fetch(`/api/queue?action=count`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const resolve: GetAllJobsCount = await response.json();

        if (!resolve.success) {
          throw new Error(resolve.message);
        }

        const { counts } = resolve.data;

        setJobs(counts);
      } catch (error) {
        console.log(error);
      }
    };

    getJobs();
  }, []);

  const mappedJobs = Object.entries(jobs).map(([jobType, statuses]) => (
    <section
      key={jobType}
      className="w-full flex flex-col items-start justify-start gap-4"
    >
      <div className="w-full rounded-lg capitalize bg-primary text-secondary font-bold flex items-center justify-between p-4">
        <h1>{normalizeString(jobType)}</h1>
      </div>

      <div className="w-full grid grid-cols-1 items-start justify-start gap-4 t:grid-cols-2 l-s:grid-cols-4">
        {Object.entries(statuses as JobStatusCount).map(([status, count]) => (
          <Link
            href={`/codesync/queue?action=list&status=${status}&type=${jobType}`}
            key={status}
            className="w-full flex flex-col items-start justify-center gap-2 p-4 bg-neutral-200 rounded-md"
          >
            <p className="text-sm capitalize">{normalizeString(status)}</p>
            <span className="bg-secondary p-1 px-2 rounded-md text-sm self-stretch text-center font-bold">
              {count}
            </span>
          </Link>
        ))}
      </div>
    </section>
  ));

  return (
    <div className="w-full flex flex-col items-start justify-start gap-4">
      {mappedJobs}
    </div>
  );
};

export default JobsStatusCount;
