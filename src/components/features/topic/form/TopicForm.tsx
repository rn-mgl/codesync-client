"use client";

import Input from "@/src/components/ui/fields/Input";
import TextArea from "@/src/components/ui/fields/TextArea";
import BlockLoader from "@/src/components/ui/loader/BlockLoader";
import {
  CreateTopicResponse,
  GetTopicResponse,
  TopicForm as ITopicForm,
  TopicFormProps,
  UpdateTopicResponse,
} from "@/src/interfaces/topic.interface";
import { getErrorMessage } from "@/src/utils/general.util";
import { successToast, errorToast } from "@/src/utils/toast.util";
import { useSession } from "next-auth/react";
import React from "react";
import { FaLink } from "react-icons/fa";
import { FaA, FaNoteSticky, FaTag } from "react-icons/fa6";

const TopicForm: React.FC<TopicFormProps> = (props) => {
  const { mode } = props;
  const slug = mode === "update" ? props.slug : undefined;
  const initialTopic = props.initialTopic;
  const onSuccess = props.onSuccess;
  const [loading, setLoading] = React.useState(mode === "update");
  const [saving, setSaving] = React.useState(false);
  const [topic, setTopic] = React.useState<ITopicForm>(
    initialTopic || {
      name: "",
      slug: "",
      description: "",
      icon: "",
    },
  );

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

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (saving) return;

    setSaving(true);

    try {
      if (mode === "create") {
        const response = await fetch(`/api/topic`, {
          method: "POST",
          body: JSON.stringify({ topic }),
        });

        const resolve: CreateTopicResponse = await response.json();

        if (!resolve.success) {
          throw new Error(resolve.message);
        }

        const { message } = resolve.data;
        successToast(message);
        onSuccess?.(message);
      } else if (mode === "update") {
        if (!slug) return;

        const response = await fetch(`/api/topic/${slug}`, {
          method: "PATCH",
          body: JSON.stringify({ topic }),
        });

        const resolve: UpdateTopicResponse = await response.json();

        if (!resolve.success) {
          throw new Error(resolve.message);
        }

        const { message } = resolve.data;
        successToast(message);
        onSuccess?.(message);
      }
    } catch (error) {
      errorToast(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  React.useEffect(() => {
    if (mode !== "update") {
      return;
    }

    const getTopic = async () => {
      try {
        if (!slug) return;

        const response = await fetch(`/api/topic/${slug}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const resolve: GetTopicResponse = await response.json();

        if (!resolve.success) {
          throw new Error(resolve.message);
        }

        const { topic: fetchedTopic } = resolve.data;

        setTopic({
          icon: fetchedTopic.icon,
          description: fetchedTopic.description,
          name: fetchedTopic.name,
          slug: fetchedTopic.slug,
        });
      } catch (error) {
        errorToast(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    getTopic();
  }, [mode, slug]);

  if (loading) return <BlockLoader />;

  return (
    <form
      onSubmit={handleSubmit}
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
        disabled={saving}
        className="w-full p-2 rounded-md bg-primary font-black text-secondary disabled:opacity-50"
      >
        {saving
          ? mode === "create"
            ? "Creating..."
            : "Updating..."
          : mode === "create"
            ? "Create"
            : "Update"}
      </button>
    </form>
  );
};

export default TopicForm;
