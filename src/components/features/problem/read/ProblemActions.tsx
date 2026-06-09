import { SupportedLanguages } from "@/src/interfaces/language.interface";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { FaEdit } from "react-icons/fa";
import { FaCode, FaFileCode, FaLightbulb, FaTrashCan } from "react-icons/fa6";
import Languages from "@/components/features/problem/read/Languages";

const ProblemActions = (props: {
  language: SupportedLanguages;
  handleCanDelete: () => void;
  handleCurrentLanguage: (language: SupportedLanguages) => void;
}) => {
  const [canSelectLanguage, setCanSelectLanguage] = React.useState(false);

  const params: { slug?: string } | null = useParams();

  const handleCanSelectLanguage = () => {
    setCanSelectLanguage((prev) => !prev);
  };

  return (
    <div className="w-full flex flex-row items-center justify-between gap-2 h-fit relative">
      <div className="flex gap-2 relative">
        <Link
          href={`/codesync/test-cases?problem=${params?.slug}`}
          title="Test Case"
          className="p-2 rounded-full bg-inherit hover:text-accent flex flex-col items-center justify-center"
        >
          <FaFileCode />
        </Link>
        <Link
          href={`/codesync/hints?problem=${params?.slug}`}
          title="Test Case"
          className="p-2 rounded-full bg-inherit hover:text-accent flex flex-col items-center justify-center"
        >
          <FaLightbulb />
        </Link>
        <button
          title="Language"
          onClick={handleCanSelectLanguage}
          className={`p-2 rounded-full bg-inherit justify-center flex flex-row items-center 
                          gap-1 transition-all ${canSelectLanguage ? "bg-primary text-secondary" : "bg-secondary text-primary"}`}
        >
          <FaCode />
          <span className="text-xs capitalize">{props.language}</span>
        </button>
      </div>

      <div className="flex gap-2">
        <Link
          title="Edit"
          href={`/codesync/problems/${params?.slug}/edit`}
          className="p-2 rounded-full bg-inherit hover:text-accent flex flex-col items-center justify-center"
        >
          <FaEdit />
        </Link>

        <button
          title="Delete"
          onClick={props.handleCanDelete}
          className="p-2 rounded-full bg-inherit hover:text-danger flex flex-col items-center justify-center"
        >
          <FaTrashCan />
        </button>
      </div>

      {canSelectLanguage && (
        <Languages
          currentLanguage={props.language}
          closeModal={handleCanSelectLanguage}
          selectLanguage={props.handleCurrentLanguage}
        />
      )}
    </div>
  );
};

export default ProblemActions;
