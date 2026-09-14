"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import { FaTrashCan, FaWandMagicSparkles } from "react-icons/fa6";

const SingleRole = () => {
  const params: { id?: string } | null = useParams();

  return (
    <div className="flex flex-col items-start justify-start w-full gap-8">
      <div className="w-full flex justify-between">
        <Link
          href="/codesync/roles"
          className="text-primary font-bold flex flex-row items-center 
                        justify-center gap-2 hover:border-b px-1 w-fit"
        >
          <FaArrowLeft />
          All Topics
        </Link>

        <div>
          <div className="flex gap-2">
            <button
              title="Validate"
              //   onClick={handleCanValidate}
              className="p-2 rounded-full bg-inherit hover:text-info flex flex-col items-center justify-center"
            >
              <FaWandMagicSparkles />
            </button>

            <Link
              title="Edit"
              href={`/codesync/topics/${params?.id}/edit`}
              className="p-2 rounded-full bg-inherit hover:text-accent flex flex-col items-center justify-center"
            >
              <FaEdit />
            </Link>

            <button
              title="Delete"
              //   onClick={handleCanDelete}
              className="p-2 rounded-full bg-inherit hover:text-danger flex flex-col items-center justify-center"
            >
              <FaTrashCan />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleRole;
