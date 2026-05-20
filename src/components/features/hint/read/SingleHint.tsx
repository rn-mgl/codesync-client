"use client";

import DisplayInputField from "@/src/components/ui/containers/DisplayInputField";
import DisplayTextArea from "@/src/components/ui/containers/DisplayTextArea";
import Delete from "@/src/components/ui/forms/Delete";
import { BaseHint, GetHintResponse } from "@/src/interfaces/hint.interface";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { FaEdit } from "react-icons/fa";
import {
  FaArrowDown19,
  FaArrowLeft,
  FaArrowTrendUp,
  FaLightbulb,
  FaLink,
  FaTrashCan,
} from "react-icons/fa6";

const SingleHint = () => {
  const [hint, setHint] = React.useState<BaseHint>({
    id: 0,
    hint: "",
    level: 0,
    order_index: 0,
    problem_id: 0,
  });

  const [canDelete, setCanDelete] = React.useState(false);

  const params: { id?: string } | null = useParams();

  const router = useRouter();

  const handleCanDelete = () => {
    setCanDelete((prev) => !prev);
  };

  React.useEffect(() => {
    const getHint = async () => {
      try {
        if (!params?.id) return;

        const response = await fetch(`/api/hint/${params?.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const resolve: GetHintResponse = await response.json();

        if (!resolve.success) {
          throw new Error(resolve.message);
        }

        const { hint } = resolve.data;

        setHint(hint);
      } catch (error) {
        console.log(error);
      }
    };

    getHint();
  }, [params?.id]);

  return (
    <div className="flex flex-col items-start justify-start w-full gap-8">
      {canDelete && (
        <Delete
          closeForm={handleCanDelete}
          endpoint={`hint/${params?.id}`}
          label="Hint"
          postDeleteAction={() => router.push("/codesync/hints")}
        />
      )}
      <div className="w-full flex justify-between">
        <Link
          href="/codesync/hints"
          className="text-primary font-bold flex flex-row items-center 
                    justify-center gap-2 hover:border-b px-1 w-fit"
        >
          <FaArrowLeft />
          All Hints
        </Link>

        <div>
          <div className="flex gap-2">
            <Link
              title="Edit"
              href={`/codesync/hints/${params?.id}/edit`}
              className="p-2 rounded-full bg-inherit hover:text-accent flex flex-col items-center justify-center"
            >
              <FaEdit />
            </Link>

            <button
              title="Delete"
              // onClick={handleCanDelete}
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
            value={hint.problem_id}
            icon={<FaLink />}
            label="Problem"
          />

          <DisplayTextArea
            label="Hint"
            value={hint.hint}
            icon={<FaLightbulb />}
          />

          <DisplayInputField
            value={hint.level}
            icon={<FaArrowTrendUp />}
            label="Level"
          />

          <DisplayInputField
            value={hint.order_index}
            icon={<FaArrowDown19 />}
            label="Order Index"
          />
        </div>
      </div>
    </div>
  );
};

export default SingleHint;
