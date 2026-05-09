"use client";

import CheckBox from "@/src/components/ui/fields/CheckBox";
import Input from "@/src/components/ui/fields/Input";
import RichTextEditor from "@/src/components/ui/fields/RichTextEditor";
import Select from "@/src/components/ui/fields/Select";
import TextArea from "@/src/components/ui/fields/TextArea";
import useSelect from "@/src/hooks/useSelect";
import {
  GetProblemResponse,
  ProblemForm,
  ProblemPayload,
  UpdateProblemResponse,
} from "@/src/interfaces/problem.interface";
import {
  BaseTopic,
  GetAllTopicsResponse,
} from "@/src/interfaces/topic.interface";
import { Editor } from "@tiptap/react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React from "react";
import { FaCode, FaLink, FaPuzzlePiece } from "react-icons/fa6";
import { toast } from "sonner";

const UpdateProblem = () => {
  const [problem, setProblem] = React.useState<ProblemForm>({
    title: "",
    constraints: "",
    description: "",
    difficulty: "easy",
    editorial: "",
    input_format: "",
    output_format: "",
    slug: "",
  });
  const [topics, setTopics] = React.useState<BaseTopic[]>([]);
  const [selectedTopics, setSelectedTopics] = React.useState<string[]>([]);

  const { select: difficulty, handleSelect: handleDifficulty } =
    useSelect<ProblemForm>({ label: "Easy", value: "easy" }, setProblem);

  const editorialRef = React.useRef<Editor | null>(null);
  const descriptionRef = React.useRef<Editor | null>(null);

  useSession({ required: true });

  const params: { slug?: string } | null = useParams();

  const topicOptions = topics.map((topic) => ({
    label: topic.name,
    value: topic.slug,
  }));

  const handleCheck = (value: string | number) => {
    setSelectedTopics((prev) =>
      prev.includes(String(value))
        ? [
            ...prev.slice(0, prev.indexOf(String(value))),
            ...prev.slice(prev.indexOf(String(value)) + 1),
          ]
        : [...prev, String(value)],
    );
  };

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

  const handleUpdate = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!params?.slug) return;

      const problemPayload: ProblemPayload & { topics: string[] } = {
        ...problem,
        editorial: editorialRef.current?.getHTML() ?? problem.editorial,
        description: descriptionRef.current?.getHTML() ?? problem.description,
        topics: selectedTopics,
      };

      const response = await fetch(`/api/problem/${params.slug}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ problem: problemPayload }),
      });

      const resolve: UpdateProblemResponse = await response.json();

      if (!resolve.success) {
        throw new Error(resolve.message);
      }

      const data = resolve.data;

      toast(data.message);
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    const getProblem = async () => {
      try {
        if (!params?.slug) return;

        const response = await fetch(`/api/problem/${params.slug}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const resolve: GetProblemResponse & GetAllTopicsResponse =
          await response.json();

        if (!resolve.success) {
          throw new Error(resolve.message);
        }

        const { problem, topics } = resolve.data;

        setProblem({
          title: problem.title,
          constraints: JSON.stringify(problem.constraints, null, 2),
          description: problem.description,
          difficulty: problem.difficulty,
          editorial: problem.editorial,
          input_format: JSON.stringify(problem.input_format, null, 2),
          output_format: JSON.stringify(problem.output_format, null, 2),
          slug: problem.slug,
        });

        setSelectedTopics(topics.map((topic) => topic.slug));
      } catch (err) {
        console.error(err);
      }
    };

    getProblem();
  }, [params?.slug]);

  React.useEffect(() => {
    const getTopics = async () => {
      try {
        const response = await fetch(`/api/topic`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const resolve: GetAllTopicsResponse = await response.json();

        if (!resolve.success) {
          throw new Error(resolve.message);
        }

        const { topics } = resolve.data;

        setTopics(topics);
      } catch (err) {
        console.error(err);
      }
    };

    getTopics();
  }, []);

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
          Additional Information
        </div>

        <div className="w-full flex flex-col items-start justify-start gap-4 p-2 border-primary/50 border rounded-b-md t:p-4">
          <CheckBox
            options={topicOptions}
            id="topics"
            name="topics"
            label="Topics"
            selectedOptions={selectedTopics}
            handleCheck={handleCheck}
          />
        </div>
      </div>

      <div className="w-full flex flex-col items-start justify-start">
        <div className="p-4 bg-primary/80 w-full rounded-t-md font-medium text-secondary">
          Problem Content
        </div>

        <div className="w-full flex flex-col items-start justify-start gap-4 p-2 border-primary/50 border rounded-b-md t:p-4">
          <div className="w-full flex flex-col items-start justify-center bg-secondary gap-1">
            <label className="text-xs text-primary/80 font-medium">
              Description
            </label>

            {problem.description && (
              <RichTextEditor
                initialValue={problem.description}
                ref={descriptionRef}
              />
            )}
          </div>

          <div className="w-full flex flex-col items-start justify-center bg-secondary gap-1">
            <label className="text-xs text-primary/80 font-medium">
              Editorial
            </label>

            {problem.editorial && (
              <RichTextEditor
                initialValue={problem.editorial}
                ref={editorialRef}
              />
            )}
          </div>
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

          <TextArea
            id="constraints"
            name="constraints"
            onChange={handleProblem}
            value={problem.constraints}
            label="Constraints"
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
        Update
      </button>
    </form>
  );
};

export default UpdateProblem;
