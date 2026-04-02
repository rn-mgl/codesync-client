"use client";

import Input from "@/src/components/ui/fields/Input";
import TextArea from "@/src/components/ui/fields/TextArea";
import Toggle from "@/src/components/ui/fields/Toggle";
import { getErrorMessage } from "@/src/utils/general.util";
import {
  GetTestCaseResponse,
  TestCaseForm,
  TestCasePayload,
  UpdateTestCaseResponse,
} from "@/src/interfaces/test-case.interface";
import { useParams } from "next/navigation";
import React from "react";
import { FaCode, FaLink } from "react-icons/fa";
import { FaMemory, FaRegClock } from "react-icons/fa6";
import { toast } from "sonner";

const UpdateTestCase = () => {
  const [testCase, setTestCase] = React.useState<TestCaseForm>({
    expected_output: "",
    input: "",
    problem: "",
    memory_limit_mb: "",
    order_index: "",
    time_limit_ms: "",
    is_sample: true,
    is_hidden: false,
  });

  const params: { id?: string } | null = useParams();

  const handleTestCase = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name } = e.target;
    const value =
      e.target instanceof HTMLInputElement && e.target.type === "checkbox"
        ? e.target.checked
        : e.target.value;

    setTestCase((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleUpdate = async (e: React.SubmitEvent) => {
    e.preventDefault();

    try {
      if (!params || !params.id) return;

      const payload: TestCasePayload = {
        ...testCase,
        memory_limit_mb: Number(testCase.memory_limit_mb),
        order_index: Number(testCase.order_index),
        time_limit_ms: Number(testCase.time_limit_ms),
      };

      const response = await fetch(`/api/test-case/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ testCase: payload }),
      });

      const resolve: UpdateTestCaseResponse = await response.json();

      if (!resolve.success) {
        throw new Error(resolve.message);
      }

      const { data } = resolve;

      toast(data.message);
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast(message);
      console.error(error);
    }
  };

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

      setTestCase({
        problem: test_case.slug,
        expected_output: JSON.stringify(test_case.expected_output, null, 2),
        input: JSON.stringify(test_case.input, null, 2),
        memory_limit_mb: String(test_case.memory_limit_mb),
        order_index: String(test_case.order_index),
        time_limit_ms: String(test_case.time_limit_ms),
        is_sample: test_case.is_sample,
        is_hidden: test_case.is_hidden,
      });
    } catch (error) {
      console.log(error);
    }
  }, [params]);

  React.useEffect(() => {
    getTestCase();
  }, [getTestCase]);

  return (
    <form
      onSubmit={(e) => handleUpdate(e)}
      className="flex flex-col items-center justify-center w-full gap-8"
    >
      <div className="w-full flex flex-col items-start justify-start">
        <div className="p-4 bg-primary/80 w-full rounded-t-md font-medium text-secondary">
          Related Problem
        </div>

        <div className="w-full flex flex-col items-start justify-start gap-4 p-2 border-primary/50 border rounded-b-md t:p-4">
          <Input
            id="problem"
            name="problem"
            onChange={handleTestCase}
            type="text"
            value={testCase.problem}
            label="Problem"
            icon={<FaLink />}
            required={true}
          />
        </div>
      </div>

      <div className="w-full flex flex-col items-start justify-start">
        <div className="p-4 bg-primary/80 w-full rounded-t-md font-medium text-secondary">
          Function Contract
        </div>

        <div className="w-full flex flex-col items-start justify-start gap-4 p-2 border-primary/50 border rounded-b-md t:p-4">
          <TextArea
            id="input"
            name="input"
            onChange={handleTestCase}
            value={testCase.input}
            label="Input"
            columns={6}
            required={true}
            icon={<FaCode />}
          />

          <TextArea
            id="expected_output"
            name="expected_output"
            onChange={handleTestCase}
            value={testCase.expected_output}
            label="Expected Output"
            columns={6}
            required={true}
            icon={<FaCode />}
          />

          <Input
            id="time_limit_ms"
            name="time_limit_ms"
            onChange={handleTestCase}
            type="text"
            value={testCase.time_limit_ms}
            label="Time Limit (ms)"
            icon={<FaRegClock />}
            required={true}
          />

          <Input
            id="memory_limit_mb"
            name="memory_limit_mb"
            onChange={handleTestCase}
            type="text"
            value={testCase.memory_limit_mb}
            label="Memory Limit (mb)"
            icon={<FaMemory />}
            required={true}
          />

          <Toggle
            id="is_sample"
            name="is_sample"
            label="Display as Sample"
            checked={testCase.is_sample}
            onChange={handleTestCase}
          />

          <Toggle
            id="is_hidden"
            name="is_hidden"
            label="Use as Test"
            checked={testCase.is_hidden}
            onChange={handleTestCase}
          />
        </div>
      </div>

      <div className="w-full flex flex-col items-start justify-start">
        <div className="p-4 bg-primary/80 w-full rounded-t-md font-medium text-secondary">
          Additional Information
        </div>

        <div className="w-full flex flex-col items-start justify-start gap-4 p-2 border-primary/50 border rounded-b-md t:p-4">
          <Input
            id="order_index"
            name="order_index"
            onChange={handleTestCase}
            type="number"
            value={testCase.order_index}
            label="Order Index"
            icon={<FaLink />}
            required={true}
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

export default UpdateTestCase;
