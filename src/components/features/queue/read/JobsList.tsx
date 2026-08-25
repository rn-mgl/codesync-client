"use client";

import Table from "@/src/components/ui/containers/Table";
import SearchFilter from "@/src/components/ui/filters/SearchFilter";
import SortFilter from "@/src/components/ui/filters/SortFilter";
import {
  JOB_SEARCH_OPTIONS,
  JOB_SORT_OPTIONS,
} from "@/src/configs/filter.config";
import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import {
  GetAllJobsListResponse,
  JOB_STATUSES,
  JOB_TYPES,
  JobData,
} from "@/src/interfaces/queue.interface";
import { getErrorMessage } from "@/src/utils/general.util";
import { normalizeString } from "@/src/utils/normalizer.util";
import { errorToast } from "@/src/utils/toast.util";
import { DateTime } from "luxon";
import Link from "next/link";
import React from "react";
import { FaEdit } from "react-icons/fa";
import { FaArrowLeft, FaEllipsis, FaTrash } from "react-icons/fa6";
import SingleJob from "./SingleJob";

const JobsList = (props: { type: JOB_TYPES; status: JOB_STATUSES }) => {
  const [jobs, setJobs] = React.useState<JobData[]>([]);
  const [selectedJob, setSelectedJob] = React.useState("");
  const [canEditJob, setCanEditJob] = React.useState("");
  const [canDeleteJob, setCanDeleteJob] = React.useState("");

  const {
    searchKey,
    searchValue,
    searchLabel,
    handleSearchKey,
    handleSearchValue,
    filter,
  } = useSearch(JOB_SEARCH_OPTIONS, "name");

  const { sortLabel, isAsc, sortKey, handleIsAsc, handleSortKey, sort } =
    useSort(JOB_SORT_OPTIONS, "timestamp");

  const handleSelectedJob = (id: string) => {
    setSelectedJob((prev) => (id === prev ? "" : id));
  };

  const handleCanEditJob = (id: string) => {
    setCanEditJob((prev) => (id === prev ? "" : id));
  };

  const handleCanDeleteJob = (id: string) => {
    setCanDeleteJob((prev) => (id === prev ? "" : id));
  };

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

        const resolve: GetAllJobsListResponse = await response.json();

        if (!resolve.success) {
          throw new Error(resolve.message);
        }

        const { jobs } = resolve.data;

        setJobs(jobs);
      } catch (error) {
        errorToast(getErrorMessage(error));
      }
    };

    getJobs();
  }, [props.type, props.status]);

  const mappedJobs = sort(filter(jobs)).map((job) => (
    <div
      key={job.id}
      className="w-full not-last:border-b-2 border-neutral-400 transition-all
                hover:bg-neutral-200 first:rounded-t-md last:rounded-b-md text-left"
    >
      <p className="w-full grid grid-cols-6 items-center p-2 gap-4 text-sm *:p-2">
        <span>{job.opts.prevMillis}</span>
        <span className="capitalize">{normalizeString(job.name)}</span>
        <span className="capitalize">
          {typeof job.progress === "number" ? job.progress : "-"}
        </span>
        <span>{DateTime.fromMillis(job.timestamp).toFormat("DDD")}</span>
        <span>
          {job.processedOn
            ? DateTime.fromMillis(job.processedOn).toFormat("DDD")
            : "-"}
        </span>
        <span className="flex items-center justify-start gap-2">
          <button
            onClick={() => handleSelectedJob(job.id)}
            className="p-2 rounded-md bg-secondary"
          >
            <FaEllipsis />
          </button>

          <button
            onClick={() => handleCanEditJob(job.id)}
            className="p-2 rounded-md bg-secondary hover:text-green-600"
          >
            <FaEdit />
          </button>

          <button
            onClick={() => handleCanDeleteJob(job.id)}
            className="p-2 rounded-md bg-secondary hover:text-red-600"
          >
            <FaTrash />
          </button>
        </span>
      </p>
    </div>
  ));

  return (
    <div className="w-full flex flex-col items-start justify-start gap-8">
      {selectedJob && (
        <SingleJob
          type={props.type}
          id={selectedJob}
          closeModal={() => handleSelectedJob(selectedJob)}
        />
      )}

      <div className="w-full flex justify-between items-center">
        <Link
          href="/codesync/queue"
          className="text-primary font-bold flex flex-row items-center
                    justify-center gap-2 hover:border-b px-1 w-fit"
        >
          <FaArrowLeft />
          All Jobs
        </Link>

        <p className="font-bold capitalize">
          {normalizeString(props.status)} {props.type} Jobs
        </p>
      </div>

      <div className="w-full flex flex-col items-center justify-start gap-2 t:flex-row t:justify-between">
        <SearchFilter
          searchKey={searchKey}
          searchValue={searchValue}
          searchLabel={searchLabel}
          options={JOB_SEARCH_OPTIONS}
          handleSearchKey={handleSearchKey}
          handleSearchValue={handleSearchValue}
        />

        <SortFilter
          sortLabel={sortLabel}
          handleIsAsc={handleIsAsc}
          handleSortKey={handleSortKey}
          isAsc={isAsc}
          options={JOB_SORT_OPTIONS}
          sortKey={sortKey}
        />
      </div>

      <Table<JobData>
        headers={[
          "id",
          "name",
          "progress",
          "timestamp",
          "processedOn",
          "action",
        ]}
        data={mappedJobs}
      />
    </div>
  );
};

export default JobsList;
