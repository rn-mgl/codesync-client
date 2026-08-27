"use client";

import Input from "@/src/components/ui/fields/Input";
import ListLoader from "@/src/components/ui/loader/ListLoader";
import TextArea from "@/src/components/ui/fields/TextArea";
import {
  GetJobResponse,
  JobModifyResponse,
  JOB_MODIFY_ACTIONS,
  JOB_TYPES,
} from "@/src/interfaces/queue.interface";
import { getErrorMessage } from "@/src/utils/general.util";
import { normalizeString } from "@/src/utils/normalizer.util";
import { errorToast, successToast } from "@/src/utils/toast.util";
import { FaArrowUp, FaRotateRight, FaTrashCan, FaXmark } from "react-icons/fa6";
import React from "react";

const ACTIONS = [
  {
    action: "discard" as JOB_MODIFY_ACTIONS,
    icon: <FaTrashCan />,
    className: "bg-danger",
  },
  {
    action: "promote" as JOB_MODIFY_ACTIONS,
    icon: <FaArrowUp />,
    className: "bg-accent",
  },
  {
    action: "retry" as JOB_MODIFY_ACTIONS,
    icon: <FaRotateRight />,
    className: "bg-neutral-500",
  },
];

const EditJob = (props: {
  id: string;
  type: JOB_TYPES;
  closeModal: () => void;
}) => {
  const [name, setName] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [priority, setPriority] = React.useState("");
  const [data, setData] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!props.id) return;

    const getJob = async () => {
      setLoading(true);

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

        const resolved = resolve.data.job;

        setName(resolved.name);
        setStatus(resolved.status);
        setPriority(
          resolved.priority !== undefined ? String(resolved.priority) : "",
        );
        setData(JSON.stringify(resolved.data, null, 2));
      } catch (error) {
        errorToast(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    getJob();
  }, [props.id, props.type]);

  const handleSubmission = async (action: JOB_MODIFY_ACTIONS) => {
    try {
      const queue: Record<string, unknown> = {
        type: props.type,
        action,
      };

      if (action === "update_data") {
        queue.data = data;
      } else if (action === "change_priority") {
        queue.priority = Number(priority);
      }

      const response = await fetch(`/api/queue/${props.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ queue }),
      });

      const resolve: JobModifyResponse = await response.json();

      if (!resolve.success) {
        throw new Error(resolve.message);
      }

      successToast(resolve.data.message);

      if (action === "discard" || action === "promote" || action === "retry") {
        props.closeModal();
      }
    } catch (error) {
      errorToast(getErrorMessage(error));
    }
  };

  const mappedActions = ACTIONS.filter(
    (action) => action.action !== "retry" || status === "failed",
  ).map((action) => (
    <button
      key={action.action}
      onClick={() => handleSubmission(action.action)}
      className={`p-2 rounded-md ${action.className} text-secondary font-bold capitalize flex items-center justify-center gap-2 px-4`}
    >
      <span>{action.action}</span>
      {action.icon}
    </button>
  ));

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center fixed top-0 
                      left-0 z-30 backdrop-blur-md bg-linear-to-b from-primary/20 to-accent/20 animate-fade"
    >
      <div className="w-full h-full flex flex-col items-center justify-center max-w-(--breakpoint-l-l) p-4 gap-2">
        <div className="w-full rounded-lg capitalize bg-primary text-secondary font-bold flex items-center justify-between p-4">
          <h1>Edit Job - {normalizeString(name)}</h1>

          <button
            onClick={props.closeModal}
            className="p-2 rounded-full hover:bg-secondary/20"
          >
            <FaXmark />
          </button>
        </div>

        <div className="w-full h-auto max-h-full bg-secondary rounded-lg p-4 flex flex-col items-start justify-start gap-4 overflow-y-auto">
          {loading ? (
            <ListLoader />
          ) : (
            <>
              <div className="w-full flex flex-col items-start justify-start">
                <div className="p-4 bg-primary/80 w-full rounded-t-md font-medium text-secondary">
                  Job Data
                </div>

                <div className="w-full flex flex-col items-start justify-start gap-4 p-2 border border-neutral-400 rounded-b-md t:p-4">
                  <div className="w-full flex flex-col items-start justify-start gap-1">
                    <Input
                      id="priority"
                      name="priority"
                      onChange={(e) => setPriority(e.target.value)}
                      type="number"
                      value={priority}
                      label="Priority"
                    />

                    <button
                      onClick={() => handleSubmission("change_priority")}
                      className="w-full p-2 rounded-md bg-primary text-secondary text-sm font-bold mt-2"
                    >
                      Update Priority
                    </button>
                  </div>

                  <div className="w-full flex flex-col items-start justify-start gap-1">
                    <TextArea
                      id="data"
                      name="data"
                      onChange={(e) => setData(e.target.value)}
                      value={data}
                      label="Data"
                      columns={6}
                    />

                    <button
                      onClick={() => handleSubmission("update_data")}
                      className="w-full p-2 rounded-md bg-primary text-secondary text-sm font-bold mt-2"
                    >
                      Update Data
                    </button>
                  </div>
                </div>
              </div>

              <div className="w-full border-b-2 border-neutral-400" />

              <div className="w-full flex items-center justify-center gap-4">
                {mappedActions}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditJob;
