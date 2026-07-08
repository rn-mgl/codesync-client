import { ApiResponse } from "@/interfaces/api.interface";

export interface BaseTopic {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export type TopicForm = Omit<BaseTopic, "id">;

export type CreateTopicResponse = ApiResponse<{ message: string }>;

export type GetAllTopicsResponse = ApiResponse<{ topics: BaseTopic[] }>;

export type GetTopicResponse = ApiResponse<{ topic: BaseTopic }>;

export type UpdateTopicResponse = ApiResponse<{ message: string }>;
