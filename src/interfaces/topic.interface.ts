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
