"use client";

import DisplayInputField from "@/src/components/ui/containers/DisplayInputField";
import DisplayTextArea from "@/src/components/ui/containers/DisplayTextArea";
import DisplayToggle from "@/src/components/ui/containers/DisplayToggle";
import Delete from "@/src/components/ui/forms/Delete";
import {
  GetTestCaseResponse,
  TestCaseDetails,
} from "@/src/interfaces/test-case.interface";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { FaArrowLeft, FaCode, FaRegClock, FaRegEdit } from "react-icons/fa";
import { FaLink, FaMemory, FaRegTrashCan } from "react-icons/fa6";

const SingleTestCase = () => {
  const [testCase, setTestCase] = React.useState<TestCaseDetails>({
    expected_output: "",
    id: 0,
    input: "",
    memory_limit_mb: 0,
    order_index: 0,
    problem_id: 0,
    time_limit_ms: 0,
    slug: "",
    title: "",
    is_sample: true,
    is_hidden: false,
  });

  const [canDelete, setCanDelete] = React.useState(false);

  const params: { id?: string } | null = useParams();

  const router = useRouter();

  const getTestCase = React.useCallback(async () => {
    try {
      if (!params || !params.id) return;

      const response = await fetch(`/api/test-case/${params.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resolve: GetTestCaseResponse = await response.json();

      if (!resolve.success) {
        throw new Error(resolve.message);
      }

      const { test_case } = resolve.data;

      setTestCase(test_case);
    } catch (error) {
      console.log(error);
    }
  }, [params]);

  const handleCanDelete = () => {
    setCanDelete((prev) => !prev);
  };

  React.useEffect(() => {
    getTestCase();
  }, [getTestCase]);

  return (
    <div className="flex flex-col items-start justify-start w-full gap-8">
      {canDelete && (
        <Delete
          closeForm={handleCanDelete}
          endpoint={`/test-case/${params?.id}`}
          label="Test Case"
          postDeleteAction={() => router.push("/codesync/test-cases")}
        />
      )}
      <div className="w-full flex justify-between">
        <Link
          href="/codesync/test-cases"
          className="text-primary font-bold flex flex-row items-center 
                    justify-center gap-2 hover:border-b px-1 w-fit"
        >
          <FaArrowLeft />
          All Test Cases
        </Link>

        <div>
          <div className="flex gap-2">
            <Link
              title="Edit"
              href={`/codesync/test-cases/${params?.id}/edit`}
              className="p-2 rounded-full bg-inherit hover:text-blue-800 flex flex-col items-center justify-center"
            >
              <FaRegEdit />
            </Link>

            <button
              title="Delete"
              onClick={handleCanDelete}
              className="p-2 rounded-full bg-inherit hover:text-red-800 flex flex-col items-center justify-center"
            >
              <FaRegTrashCan />
            </button>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col items-start justify-start">
        <div className="p-4 bg-primary/80 w-full rounded-t-md font-medium text-secondary">
          Related Problem
        </div>

        <div className="w-full flex flex-col items-start justify-start gap-4 p-2 border-primary/50 border rounded-b-md t:p-4">
          <DisplayInputField
            value={`${testCase.title} (${testCase.slug})`}
            icon={<FaLink />}
          />
        </div>
      </div>

      <div className="w-full flex flex-col items-start justify-start">
        <div className="p-4 bg-primary/80 w-full rounded-t-md font-medium text-secondary">
          Test Case Contract
        </div>

        <div className="w-full flex flex-col items-start justify-start gap-4 p-2 border-primary/50 border rounded-b-md t:p-4">
          <DisplayTextArea
            label="Input"
            value={JSON.stringify(testCase.input, null, 2)}
            icon={<FaCode />}
          />

          <DisplayTextArea
            label="Expected Output"
            value={JSON.stringify(testCase.expected_output, null, 2)}
            icon={<FaCode />}
          />

          <DisplayInputField
            label="Time Limit (ms)"
            value={`${testCase.time_limit_ms}`}
            icon={<FaRegClock />}
          />

          <DisplayInputField
            label="Memory Limit (mb)"
            value={`${testCase.memory_limit_mb}`}
            icon={<FaMemory />}
          />

          <DisplayToggle
            label="Display as Sample"
            checked={testCase.is_sample}
          />

          <DisplayToggle label="Use as Test" checked={testCase.is_hidden} />
        </div>
      </div>

      <div className="w-full flex flex-col items-start justify-start">
        <div className="p-4 bg-primary/80 w-full rounded-t-md font-medium text-secondary">
          Additional Information
        </div>

        <div className="w-full flex flex-col items-start justify-start gap-4 p-2 border-primary/50 border rounded-b-md t:p-4">
          <DisplayInputField
            label="Order Index"
            value={testCase.order_index}
            icon={<FaLink />}
          />
        </div>
      </div>
    </div>
  );
};

export default SingleTestCase;
