import { APIResponse } from "./api.interface";

type JOB_STATUSES =
  | "active"
  | "completed"
  | "delayed"
  | "failed"
  | "paused"
  | "prioritized"
  | "waiting"
  | "waiting-children";

export type JobStatusCount = Record<JOB_STATUSES, number>;

export interface JobsTypeCount {
  background: JobStatusCount;
  listener: JobStatusCount;
}

export type GetAllJobsCount = APIResponse<{ counts: JobsTypeCount }>;
