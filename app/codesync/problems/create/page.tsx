"use client";

import Input from "@/src/components/ui/fields/Input";
import Select from "@/src/components/ui/fields/Select";
import TextArea from "@/src/components/ui/fields/TextArea";
import useSelect from "@/src/hooks/useSelect";
import { FormProblem } from "@/src/interfaces/problem.interface";
import Link from "next/link";
import React from "react";
import {
  FaArrowLeft,
  FaCode,
  FaLink,
  FaPen,
  FaPuzzlePiece,
  FaRegNoteSticky,
} from "react-icons/fa6";

const Page = () => {
  const [problem, setProblem] = React.useState<FormProblem>({
    title: "",
    constraints: "",
    description: "",
    difficulty: "easy",
    editorial: "",
    input_format: "",
    output_format: "",
    slug: "",
  });

  const { select: difficulty, handleSelect: handleDifficulty } =
    useSelect<FormProblem>({ label: "Easy", value: "easy" }, setProblem);

  const handleProblem = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setProblem((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  return (
    <div className="w-full flex flex-col items-center justify-start min-h-full h-auto">
      <div className="w-full flex flex-col items-start justify-start max-w-(--breakpoint-l-l) gap-8">
        <Link
          href="/codesync/problems"
          className="text-primary font-bold flex flex-row items-center 
                    justify-center gap-2 hover:border-b px-1"
        >
          <FaArrowLeft />
          All Problems
        </Link>

        <div className="w-full flex flex-col items-center justify-center gap-4">
          <div className="w-full p-4 t:p-6 rounded-md bg-primary text-secondary font-bold t:text-lg">
            Create Problem
          </div>

          <form className="flex flex-col items-center justify-center w-full gap-8">
            <div className="w-full flex flex-col items-start justify-start">
              <div className="p-4 bg-primary/80 w-full rounded-t-md font-medium text-secondary">
                Basic Information
              </div>

              <div className="w-full flex flex-col items-start justify-start gap-4 p-2 border-primary/50 border rounded-b-md t:p-4">
                <Input
                  id="title"
                  name="title"
                  onChange={handleProblem}
                  type="text"
                  value={problem.title}
                  label="Title"
                  icon={<FaPuzzlePiece />}
                  required={true}
                />

                <Input
                  id="slug"
                  name="slug"
                  onChange={handleProblem}
                  type="text"
                  value={problem.slug}
                  label="Slug"
                  icon={<FaLink />}
                  required={true}
                />

                <Select
                  label="Difficulty"
                  id="difficulty"
                  name="difficulty"
                  activeLabel={difficulty.label}
                  onChange={handleDifficulty}
                  options={[
                    { label: "Easy", value: "easy" },
                    { label: "Medium", value: "medium" },
                    { label: "Hard", value: "hard" },
                  ]}
                  value={difficulty.value}
                />
              </div>
            </div>

            <div className="w-full flex flex-col items-start justify-start">
              <div className="p-4 bg-primary/80 w-full rounded-t-md font-medium text-secondary">
                Problem Content
              </div>

              <div className="w-full flex flex-col items-start justify-start gap-4 p-2 border-primary/50 border rounded-b-md t:p-4">
                <TextArea
                  id="description"
                  name="description"
                  onChange={handleProblem}
                  value={problem.description}
                  label="Description"
                  columns={6}
                  required={true}
                  icon={<FaRegNoteSticky />}
                />

                <TextArea
                  id="editorial"
                  name="editorial"
                  onChange={handleProblem}
                  value={problem.editorial}
                  label="Editorial"
                  columns={6}
                  required={true}
                  icon={<FaPen />}
                />
              </div>
            </div>

            <div className="w-full flex flex-col items-start justify-start">
              <div className="p-4 bg-primary/80 w-full rounded-t-md font-medium text-secondary">
                Function Contract
              </div>

              <div className="w-full flex flex-col items-start justify-start gap-4 p-2 border-primary/50 border rounded-b-md t:p-4">
                <TextArea
                  id="input_format"
                  name="input_format"
                  onChange={handleProblem}
                  value={problem.input_format}
                  label="Input Format"
                  columns={6}
                  required={true}
                  icon={<FaCode />}
                />

                <TextArea
                  id="output_format"
                  name="output_format"
                  onChange={handleProblem}
                  value={problem.output_format}
                  label="Output Format"
                  columns={6}
                  required={true}
                  icon={<FaCode />}
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
        </div>
      </div>
    </div>
  );
};

export default Page;
