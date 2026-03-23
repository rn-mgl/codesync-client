"use client";

import Input from "@/src/components/ui/fields/Input";
import TextArea from "@/src/components/ui/fields/TextArea";
import Toggle from "@/src/components/ui/fields/Toggle";
import { handleToastErrorMessage } from "@/src/helpers/util.helper";
import {
  CreateTestCaseResponse,
  TestCaseForm,
  TestCasePayload,
} from "@/src/interfaces/test-case.interface";
import { useSearchParams } from "next/navigation";
import React from "react";
import { FaCode, FaLink } from "react-icons/fa";
import { FaMemory, FaRegClock } from "react-icons/fa6";
import { toast } from "sonner";

const CreateTestCase = () => {
  const [testCase, setTestCase] = React.useState<TestCaseForm>({
    expected_output: "",
    input: "",
    problem: "",
    memory_limit_mb: "",
    order_index: "",
    time_limit_ms: "",
    is_hidden: false,
    is_sample: true,
  });

  const params = useSearchParams();

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

  const handleCreate = async (e: React.SubmitEvent) => {
    e.preventDefault();

    try {
      const payload: TestCasePayload = {
        ...testCase,
        time_limit_ms: Number(testCase.time_limit_ms),
        memory_limit_mb: Number(testCase.memory_limit_mb),
        order_index: Number(testCase.order_index),
      };

      const response = await fetch(`/api/test-case`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ testCase: payload }),
      });

      const resolve: CreateTestCaseResponse = await response.json();

      if (!resolve.success) {
        throw new Error(resolve.message);
      }

      const { data } = resolve;

      toast(data.message);
    } catch (error: unknown) {
      const message = handleToastErrorMessage(error);
      toast(message);
      console.error(error);
    }
  };

  React.useEffect(() => {
    if (!params || !params.get("problem")) return;

    const problem = params.get("problem");

    if (!problem) return;

    setTestCase((prev) => {
      return {
        ...prev,
        problem: problem,
      };
    });
  }, [params]);

  return (
    <form
      onSubmit={(e) => handleCreate(e)}
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
          Test Case Contract
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
            onChange={handleTestCase}
            name="is_sample"
            label="Display as Sample"
            checked={testCase.is_sample}
          />

          <Toggle
            id="is_hidden"
            onChange={handleTestCase}
            name="is_hidden"
            label="Use as Test"
            checked={testCase.is_hidden}
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

export default CreateTestCase;
