import { ApiResponse } from "./api.interface";

export interface BaseTopic {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export interface TopicForm extends Pick<
  BaseTopic,
  "name" | "slug" | "description"
> {
  icon: File | null;
}

export type CreateTopicResponse = ApiResponse<{ message: string }>;
