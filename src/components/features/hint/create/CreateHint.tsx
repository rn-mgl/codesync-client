"use client";

import Input from "@/src/components/ui/fields/Input";
import TextArea from "@/src/components/ui/fields/TextArea";
import { CreateHintResponse, HintForm } from "@/src/interfaces/hint.interface";
import { getErrorMessage } from "@/src/utils/general.util";
import React from "react";
import { FaLink } from "react-icons/fa";
import { FaLightbulb } from "react-icons/fa6";
import { toast } from "sonner";

const CreateHint = () => {
  const [hint, setHint] = React.useState<HintForm>({
    hint: "",
    level: 0,
    order_index: 0,
    problem: "",
  });

  const handleHint = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setHint((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleCreate = async (e: React.SubmitEvent<HTMLFormElement>) => {
    try {
      const response = await fetch(`/api/hint`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hint),
      });

      const resolve: CreateHintResponse = await response.json();

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
            id="problem"
            name="problem"
            onChange={handleHint}
            type="text"
            value={hint.problem}
            label="Problem"
            icon={<FaLink />}
            required={true}
          />

          <TextArea
            id="hint"
            name="hint"
            onChange={handleHint}
            value={hint.hint}
            label="Hint"
            columns={6}
            required={true}
            icon={<FaLightbulb />}
          />

          <Input
            id="level"
            name="level"
            onChange={handleHint}
            type="number"
            value={hint.level}
            label="Level"
            icon={<FaLink />}
            required={true}
          />

          <Input
            id="order_index"
            name="order_index"
            onChange={handleHint}
            type="number"
            value={hint.order_index}
            label="Level"
            icon={<FaLink />}
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

export default CreateHint;
