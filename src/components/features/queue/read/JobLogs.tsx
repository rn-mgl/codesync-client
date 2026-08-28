"use client";

import Input from "@/src/components/ui/fields/Input";
import ListLoader from "@/src/components/ui/loader/ListLoader";
import {
  GetJobLogsResponse,
  JOB_TYPES,
  QueueJobLogs,
} from "@/src/interfaces/queue.interface";
import { getErrorMessage } from "@/src/utils/general.util";
import { normalizeString } from "@/src/utils/normalizer.util";
import { errorToast } from "@/src/utils/toast.util";
import { FaMagnifyingGlass, FaXmark } from "react-icons/fa6";
import React from "react";

const JobLogs = (props: {
  id: string;
  type: JOB_TYPES;
  closeModal: () => void;
}) => {
  const [logs, setLogs] = React.useState<QueueJobLogs>({
    count: 0,
    logs: [],
  });
  const [loading, setLoading] = React.useState(true);
  const [searchValue, setSearchValue] = React.useState("");

  React.useEffect(() => {
    if (!props.id) return;

    const getLogs = async () => {
      setLoading(true);

      try {
        const searchParams = {
          action: "logs",
          type: props.type,
        };

        const query = new URLSearchParams(searchParams).toString();

        const response = await fetch(`/api/queue/${props.id}?${query}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const resolve: GetJobLogsResponse = await response.json();

        if (!resolve.success) {
          throw new Error(resolve.message);
        }

        const { logs } = resolve.data;

        setLogs(logs);
      } catch (error) {
        errorToast(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    getLogs();
  }, [props.id, props.type]);

  const searchTerm = searchValue.trim().toLowerCase();

  const filteredLogs = searchTerm
    ? logs.logs.filter((log) => log.toLowerCase().includes(searchTerm))
    : logs.logs;

  const mappedLogs = filteredLogs.map((log, index) => (
    <p
      key={index}
      className="w-full not-last:border-b-2 border-neutral-400 text-sm p-2"
    >
      {log}
    </p>
  ));

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center fixed top-0 
                      left-0 z-30 backdrop-blur-md bg-linear-to-b from-primary/20 to-accent/20 animate-fade"
    >
      <div className="w-full h-full flex flex-col items-center justify-center max-w-(--breakpoint-l-l) p-4 gap-2">
        <div className="w-full rounded-lg capitalize bg-primary text-secondary font-bold flex items-center justify-between p-4">
          <h1>Job Logs - {normalizeString(props.id)}</h1>

          <button
            onClick={props.closeModal}
            className="p-2 rounded-full hover:bg-secondary/20"
          >
            <FaXmark />
          </button>
        </div>

        <div className="w-full h-auto max-h-full bg-secondary rounded-lg p-4 flex flex-col items-start justify-start gap-4">
          <div className="w-full flex flex-col items-start justify-start">
            <div className="p-4 bg-primary/80 w-full rounded-t-md font-medium text-secondary flex items-center justify-between">
              Logs
              <span>
                {searchTerm ? `${filteredLogs.length} / ${logs.count}` : logs.count}
              </span>
            </div>

            <div className="w-full flex flex-col items-start justify-start gap-4 p-2 border border-neutral-400 rounded-b-md t:p-4">
              <Input
                id="searchValue"
                name="searchValue"
                type="text"
                placeholder="Search logs"
                icon={<FaMagnifyingGlass />}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full min-h-40 max-h-full flex flex-col items-start justify-start overflow-y-auto">
            {loading ? (
              <ListLoader />
            ) : mappedLogs.length > 0 ? (
              mappedLogs
            ) : (
              <p className="text-sm italic text-center w-full py-2">
                {searchTerm
                  ? "No logs match your search."
                  : "No logs to display yet."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobLogs;