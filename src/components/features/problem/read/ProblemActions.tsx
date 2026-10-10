import { canAccess } from "@/src/configs/access.config";
import { SupportedLanguages } from "@/src/interfaces/language.interface";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { FaEdit } from "react-icons/fa";
import {
  FaCode,
  FaFileCode,
  FaLightbulb,
  FaTrashCan,
  FaWandMagicSparkles,
} from "react-icons/fa6";
import Languages from "@/components/features/problem/read/Languages";
import { useSession } from "next-auth/react";

// Toolbar above the code editor: links to the problem's test cases/hint,
// a language picker, and edit/delete actions.
const ProblemActions = (props: {
  language: SupportedLanguages;
  handleCanDelete: () => void;
  handleCanValidate: () => void;
  handleCurrentLanguage: (language: SupportedLanguages) => void;
}) => {
  const [canSelectLanguage, setCanSelectLanguage] = React.useState(false);

  const params: { slug?: string } | null = useParams();
  const { data: session } = useSession({ required: true });

  const permission = session?.user.permissions ?? [];

  const handleCanSelectLanguage = () => {
    setCanSelectLanguage((prev) => !prev);
  };

  // Content links that take the user to the per-problem pages.
  const contentLinks = [
    {
      href: `/codesync/test-case?problem=${params?.slug}`,
      title: "Test Cases",
      icon: <FaFileCode />,
    },
    {
      href: `/codesync/hint?problem=${params?.slug}`,
      title: "Hints",
      icon: <FaLightbulb />,
    },
  ];

  return (
    <div className="w-full flex flex-row items-center justify-between gap-2 h-fit relative">
      <div className="flex gap-2 relative">
        {contentLinks.map((link) => (
          <Link
            key={link.title}
            href={link.href}
            title={link.title}
            className="p-2 rounded-full bg-inherit hover:text-accent flex flex-col items-center justify-center"
          >
            {link.icon}
          </Link>
        ))}

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
        {canAccess(permission, "problem:update") && (
          <>
            <button
              title="Validate"
              onClick={props.handleCanValidate}
              className="p-2 rounded-full bg-inherit hover:text-info flex flex-col items-center justify-center"
            >
              <FaWandMagicSparkles />
            </button>
            <Link
              title="Edit"
              href={`/codesync/problem/${params?.slug}/edit`}
              className="p-2 rounded-full bg-inherit hover:text-accent flex flex-col items-center justify-center"
            >
              <FaEdit />
            </Link>
          </>
        )}

        {canAccess(permission, "problem:destroy") && (
          <button
            title="Delete"
            onClick={props.handleCanDelete}
            className="p-2 rounded-full bg-inherit hover:text-danger flex flex-col items-center justify-center"
          >
            <FaTrashCan />
          </button>
        )}
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
