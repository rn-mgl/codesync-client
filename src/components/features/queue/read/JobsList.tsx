"use client";

import { JOB_STATUSES, JOB_TYPES } from "@/src/interfaces/queue.interface";
import React from "react";

const JobsList = (props: { type: JOB_TYPES; status: JOB_STATUSES }) => {
  React.useEffect(() => {
    const getJobs = async () => {
      try {
        const searchParams = {
          action: "list",
          type: props.type,
          status: props.status,
        };

        const query = new URLSearchParams(searchParams).toString();

        const response = await fetch(`/api/queue?${query}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const resolve = await response.json();

        if (!resolve.success) {
          throw new Error(resolve.message);
        }

        console.log(resolve);

        // const { counts } = resolve.data;

        // setJobs(counts);
      } catch (error) {
        console.log(error);
      }
    };

    getJobs();
  }, [props.type, props.status]);

  return <div>JobsList</div>;
};

export default JobsList;
