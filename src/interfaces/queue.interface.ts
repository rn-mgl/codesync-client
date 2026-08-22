import { APIResponse } from "./api.interface";

export type JOB_STATUSES =
  | "active"
  | "completed"
  | "delayed"
  | "failed"
  | "paused"
  | "prioritized"
  | "waiting"
  | "waiting-children";

export type JOB_TYPES = "listener" | "background";

export type JOB_ACTIONS = "list" | "count";

export type JobStatusCount = Record<JOB_STATUSES, number>;

export interface JobsTypeCount {
  background: JobStatusCount;
  listener: JobStatusCount;
}

export type GetAllJobsCount = APIResponse<{ counts: JobsTypeCount }>;
