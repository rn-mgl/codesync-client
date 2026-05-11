"use client";

import File from "@/src/components/ui/fields/File";
import Input from "@/src/components/ui/fields/Input";
import TextArea from "@/src/components/ui/fields/TextArea";
import useFile from "@/src/hooks/useFile";
import {
  CreateTopicResponse,
  TopicForm,
} from "@/src/interfaces/topic.interface";
import { getErrorMessage } from "@/src/utils/general.util";
import { useSession } from "next-auth/react";
import React from "react";
import { FaLink } from "react-icons/fa";
import { FaA, FaNoteSticky } from "react-icons/fa6";
import { toast } from "sonner";

const CreateTopic = () => {
  const [topic, setTopic] = React.useState<TopicForm>({
    name: "",
    slug: "",
    description: "",
    icon: null,
  });

  useSession({ required: true });

  const { fileRef, localFile, handleLocalFile, removeLocalFile } =
    useFile(setTopic);

  const handleTopic = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setTopic((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleCreate = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!localFile.file) {
        throw new Error(`Icon is required.`);
      }

      const formData = new FormData();

      formData.set("name", topic.name);
      formData.set("slug", topic.slug);
      formData.set("description", topic.description);
      formData.set("icon", localFile.file);

      const response = await fetch(`/api/topic`, {
        method: "POST",
        body: formData,
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

          <File
            file={localFile}
            fileRef={fileRef}
            handleFile={handleLocalFile}
            removeFile={removeLocalFile}
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
