"use client";

import Input from "@/src/components/ui/fields/Input";
import TextArea from "@/src/components/ui/fields/TextArea";
import {
  CreateTopicResponse,
  TopicForm,
} from "@/src/interfaces/topic.interface";
import { getErrorMessage } from "@/src/utils/general.util";
import { useSession } from "next-auth/react";
import React from "react";
import { FaLink } from "react-icons/fa";
import { FaA, FaNoteSticky, FaTag } from "react-icons/fa6";
import { toast } from "sonner";

const CreateTopic = () => {
  const [topic, setTopic] = React.useState<TopicForm>({
    name: "",
    slug: "",
    description: "",
    icon: "",
  });

  useSession({ required: true });

  const handleTopic = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    let appliedValue = value;

    if (name === "icon" && !/\p{Extended_Pictographic}/u.test(appliedValue)) {
      appliedValue = "";
    }

    setTopic((prev) => {
      return {
        ...prev,
        [name]: appliedValue,
      };
    });
  };

  const handleCreate = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/topic`, {
        method: "POST",
        body: JSON.stringify({ topic }),
      });

      const resolve: CreateTopicResponse = await response.json();

      if (!resolve.success) {
        throw new Error(resolve.message);
      }

      const { message } = resolve.data;

      toast(message);
    } catch (error) {
      console.log(error);
      const message = getErrorMessage(error);
      toast(message);
    }
  };

  return (
    <form
      onSubmit={(e) => handleCreate(e)}
      className="flex flex-col items-center justify-center w-full gap-8"
    >
      <div className="w-full flex flex-col items-start justify-start">
        <div className="p-4 bg-primary/80 w-full rounded-t-md font-medium text-secondary">
          Basic Information
        </div>

        <div className="w-full flex flex-col items-start justify-start gap-4 p-2 border-primary/50 border rounded-b-md t:p-4">
          <Input
            id="name"
            name="name"
            onChange={handleTopic}
            type="text"
            value={topic.name}
            label="Name"
            icon={<FaA />}
            required={true}
          />

          <Input
            id="slug"
            name="slug"
            onChange={handleTopic}
            type="text"
            value={topic.slug}
            label="Slug"
            icon={<FaLink />}
            required={true}
          />

          <TextArea
            id="description"
            name="description"
            onChange={handleTopic}
            value={topic.description}
            label="Description"
            icon={<FaNoteSticky />}
            required={true}
          />

          <Input
            id="icon"
            name="icon"
            onChange={handleTopic}
            type="text"
            value={topic.icon}
            label="Icon"
            icon={<FaTag />}
            required={true}
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full p-2 rounded-md bg-primary font-black text-secondary"
      >
        Create
      </button>
    </form>
  );
};

export default CreateTopic;
