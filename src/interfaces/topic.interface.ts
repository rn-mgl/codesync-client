import { APIPaginateResponse, APIResponse } from "@/interfaces/api.interface";

export interface BaseTopic {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export type TopicForm = Omit<BaseTopic, "id">;

export type CreateTopicResponse = APIResponse<{ message: string }>;

export type GetAllTopicsResponse = APIResponse<
  {
    topics: BaseTopic[];
  } & APIPaginateResponse
>;

export type GetTopicResponse = APIResponse<{ topic: BaseTopic }>;

export type UpdateTopicResponse = APIResponse<{ message: string }>;
