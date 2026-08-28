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

export type JOB_MODIFY_ACTIONS =
  | "update_data"
  | "change_priority"
  | "discard"
  | "promote"
  | "retry";

export type JobStatusCount = Record<JOB_STATUSES, number>;

export type JobsTypeCount = {
  background: JobStatusCount;
  listener: JobStatusCount;
};

export interface JobOptions {
  attempts: number;
  delay: number;
  jobId: string;
  prevMillis: number;
  repeat: { pattern: string; count: number };
  timestamp: number;
}

export type JobData = {
  id: string;
  name: string;
  data: unknown;
  status: string;
  progress: number | object;
  attemptsMade: number;
  priority?: number;
  timestamp: number;
  processedOn?: number | null;
  finishedOn?: number | null;
  returnvalue?: unknown;
  failedReason?: string | null;
  stacktrace?: string[];
  delay?: number;
  parent?: { id: string; queue: string };
  repeatJobKey?: string;
  opts: JobOptions;
};

export interface QueueJobLogs {
  logs: string[];
  count: number;
}

export type GetAllJobsCountResponse = APIResponse<{ counts: JobsTypeCount }>;
export type GetAllJobsListResponse = APIResponse<{ jobs: JobData[] }>;
export type GetJobResponse = APIResponse<{ job: JobData }>;
export type GetJobLogsResponse = APIResponse<{ logs: QueueJobLogs }>;
export type JobModifyResponse = APIResponse<{ message: string }>;
