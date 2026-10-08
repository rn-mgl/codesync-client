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

export type TopicFormMode = "create" | "update";

export interface TopicFormCreateProps {
  mode: "create";
  initialTopic?: TopicForm;
  onSuccess?: (message: string) => void;
}

export interface TopicFormUpdateProps {
  mode: "update";
  slug?: string;
  initialTopic?: TopicForm;
  onSuccess?: (message: string) => void;
}

export type TopicFormProps = TopicFormCreateProps | TopicFormUpdateProps;
