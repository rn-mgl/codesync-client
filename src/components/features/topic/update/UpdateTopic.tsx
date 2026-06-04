"use client";

import File from "@/src/components/ui/fields/File";
import Input from "@/src/components/ui/fields/Input";
import TextArea from "@/src/components/ui/fields/TextArea";
import useFile from "@/src/hooks/useFile";
import {
  GetTopicResponse,
  TopicForm,
  UpdateTopicResponse,
} from "@/src/interfaces/topic.interface";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React from "react";
import { FaLink } from "react-icons/fa";
import { FaA, FaNoteSticky } from "react-icons/fa6";
import { toast } from "sonner";

const UpdateTopic = () => {
  const [topic, setTopic] = React.useState<TopicForm>({
    description: "",
    icon: null,
    name: "",
    slug: "",
  });

  useSession({ required: true });

  const params: { slug?: string } | null = useParams();

  const {
    fileRef,
    localFile,
    handleLocalFile,
    removeLocalFile,
    removeUploadedFile,
  } = useFile(setTopic);

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

  const handleUpdate = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!params?.slug) return;

      if (!topic.icon && !localFile.file) return;

      const formData = new FormData();

      formData.set("name", topic.name);
      formData.set("description", topic.description);
      formData.set("slug", topic.slug);
      formData.set(
        "icon",
        localFile.file
          ? localFile.file
          : typeof topic.icon === "string"
            ? topic.icon
            : "",
      );

      const response = await fetch(`/api/topic/${params?.slug}`, {
        method: "PATCH",
        body: formData,
      });

      const resolve: UpdateTopicResponse = await response.json();

      if (!resolve.success) {
        throw new Error(resolve.message);
      }

      const { message } = resolve.data;

      toast(message);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    const getTopic = async () => {
      try {
        if (!params?.slug) return;

        const response = await fetch(`/api/topic/${params?.slug}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const resolve: GetTopicResponse = await response.json();

        if (!resolve.success) {
          throw new Error(resolve.message);
        }

        const { topic } = resolve.data;

        setTopic({
          icon: topic.icon,
          description: topic.description,
          name: topic.name,
          slug: topic.slug,
        });
      } catch (error) {
        console.log(error);
      }
    };

    getTopic();
  }, [params?.slug]);

  return (
    <form
      onSubmit={(e) => handleUpdate(e)}
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
            file={
              localFile.file
                ? localFile
                : typeof topic.icon === "string"
                  ? topic.icon
                  : ""
            }
            id="icon"
            name="icon"
            fileRef={fileRef}
            handleFile={handleLocalFile}
            removeFile={
              localFile.file
                ? removeLocalFile
                : typeof topic.icon === "string"
                  ? () => removeUploadedFile("icon")
                  : removeLocalFile
            }
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full p-2 rounded-md bg-primary font-black text-secondary"
      >
        Update
      </button>
    </form>
  );
};

export default UpdateTopic;
