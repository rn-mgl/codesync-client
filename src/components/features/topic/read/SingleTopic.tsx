"use client";

import TopicLoader from "@/src/components/ui/loader/TopicLoader";
import DisplayInputField from "@/src/components/ui/containers/DisplayInputField";
import DisplayTextArea from "@/src/components/ui/containers/DisplayTextArea";
import Delete from "@/src/components/ui/forms/Delete";
import { BaseTopic, GetTopicResponse } from "@/src/interfaces/topic.interface";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { FaEdit } from "react-icons/fa";
import {
  FaA,
  FaArrowLeft,
  FaLink,
  FaNoteSticky,
  FaTag,
  FaTrashCan,
} from "react-icons/fa6";

const SingleTopic = () => {
  const [topic, setTopic] = React.useState<BaseTopic>({
    icon: "",
    description: "",
    id: 0,
    name: "",
    slug: "",
  });
  const [canDelete, setCanDelete] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const params: { slug?: string } | null = useParams();

  const router = useRouter();

  const handleCanDelete = () => {
    setCanDelete((prev) => !prev);
  };

  React.useEffect(() => {
    const getTopic = async () => {
      setLoading(true);

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

        setTopic(topic);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getTopic();
  }, [params?.slug]);

  return (
    <div className="flex flex-col items-start justify-start w-full gap-8">
      {canDelete && (
        <Delete
          closeForm={handleCanDelete}
          endpoint={`topic/${params?.slug}`}
          label="Topic"
          postDeleteAction={() => router.push("/codesync/topics")}
        />
      )}

      {loading ? (
        <TopicLoader />
      ) : (
        <>
          <div className="w-full flex justify-between">
            <Link
              href="/codesync/topics"
              className="text-primary font-bold flex flex-row items-center 
                        justify-center gap-2 hover:border-b px-1 w-fit"
            >
              <FaArrowLeft />
              All Topics
            </Link>

            <div>
              <div className="flex gap-2">
                <Link
                  title="Edit"
                  href={`/codesync/topics/${params?.slug}/edit`}
                  className="p-2 rounded-full bg-inherit hover:text-accent flex flex-col items-center justify-center"
                >
                  <FaEdit />
                </Link>

                <button
                  title="Delete"
                  onClick={handleCanDelete}
                  className="p-2 rounded-full bg-inherit hover:text-danger flex flex-col items-center justify-center"
                >
                  <FaTrashCan />
                </button>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col items-start justify-start">
            <div className="p-4 bg-primary/80 w-full rounded-t-md font-medium text-secondary">
              Basic Information
            </div>

            <div className="w-full flex flex-col items-start justify-start gap-4 p-2 border-primary/50 border rounded-b-md t:p-4">
              <DisplayInputField
                label="Name"
                value={`${topic.name}`}
                icon={<FaA />}
              />

              <DisplayInputField
                label="Slug"
                value={`${topic.slug}`}
                icon={<FaLink />}
              />

              <DisplayTextArea
                label="Description"
                value={topic.description}
                icon={<FaNoteSticky />}
              />

              <DisplayInputField
                label="Icon"
                value={`${topic.icon}`}
                icon={<FaTag />}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SingleTopic;
