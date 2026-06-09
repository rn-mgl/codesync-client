"use client";

import Input from "@/src/components/ui/fields/Input";
import TextArea from "@/src/components/ui/fields/TextArea";
import {
  UpdateHintResponse,
  HintForm,
  GetHintResponse,
} from "@/src/interfaces/hint.interface";
import { getErrorMessage } from "@/src/utils/general.util";
import { useParams } from "next/navigation";
import React from "react";
import { FaLink } from "react-icons/fa";
import { FaArrowDown19, FaArrowTrendUp, FaLightbulb } from "react-icons/fa6";
import { toast } from "sonner";

const UpdateHint = () => {
  const [hint, setHint] = React.useState<HintForm>({
    hint: "",
    level: 0,
    order_index: 0,
    problem: "",
  });

  const params: { id?: string } | null = useParams();

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

  const handleUpdate = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!params?.id) return;

      const response = await fetch(`/api/hint/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hint }),
      });

      const resolve: UpdateHintResponse = await response.json();

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

  React.useEffect(() => {
    const getHint = async () => {
      try {
        if (!params?.id) return;

        const response = await fetch(`/api/hint/${params.id}`, {
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

        setHint((prev) => {
          return {
            ...prev,
            hint: hint.hint,
            level: hint.level,
            order_index: hint.order_index,
            problem: hint.slug,
          };
        });
      } catch (error) {
        console.log(error);
      }
    };

    getHint();
  }, [params?.id]);

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
            icon={<FaArrowTrendUp />}
            required={true}
          />

          <Input
            id="order_index"
            name="order_index"
            onChange={handleHint}
            type="number"
            value={hint.order_index}
            label="Order Index"
            icon={<FaArrowDown19 />}
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

export default UpdateHint;
