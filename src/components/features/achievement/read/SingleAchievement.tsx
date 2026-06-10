"use client";

import DisplayFile from "@/src/components/ui/containers/DisplayFile";
import DisplayInputField from "@/src/components/ui/containers/DisplayInputField";
import DisplayTextArea from "@/src/components/ui/containers/DisplayTextArea";
import Delete from "@/src/components/ui/forms/Delete";
import {
  BaseAchievement,
  GetAchievementResponse,
} from "@/src/interfaces/achievement.interface";
import { normalizeString } from "@/src/utils/normalizer.util";
import { renderJSON } from "@/src/utils/renderer.util";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";

const SingleAchievement = () => {
  const [achievement, setAchievement] = React.useState<BaseAchievement>({
    badge_color: "bronze",
    category: "problems",
    description: "",
    icon: "",
    id: 0,
    name: "",
    points: 0,
    slug: "",
    unlock_criteria: {
      type: "metric_threshold",
      version: 1,
    },
  });
  const [canDelete, setCanDelete] = React.useState(false);

  useSession({ required: true });

  const router = useRouter();

  const BADGE_PALETTE: Record<string, { primary: string; secondary: string }> =
    {
      bronze: {
        primary: "#CE8946",
        secondary: "#FCA956",
      },
      silver: {
        primary: "#C4C4C4",
        secondary: "#E0E0E0",
      },
      gold: {
        primary: "#EFBF04",
        secondary: "#FFC766",
      },
    };

  const params: { slug?: string } | null = useParams();

  const handleCanDelete = () => {
    setCanDelete((prev) => !prev);
  };

  const mappedCriteria = renderJSON(achievement.unlock_criteria);

  React.useEffect(() => {
    const getAchievement = async () => {
      try {
        if (!params?.slug) return;

        const response = await fetch(`/api/achievement/${params.slug}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const resolve: GetAchievementResponse = await response.json();

        if (!resolve.success) {
          throw new Error(resolve.message);
        }

        const { achievement } = resolve.data;

        setAchievement(achievement);
      } catch (error) {
        console.log(error);
      }
    };

    getAchievement();
  }, [params?.slug]);

  return (
    <div className="flex flex-col items-start justify-start w-full gap-4">
      {canDelete ? (
        <Delete
          closeForm={handleCanDelete}
          endpoint={`achievement/${params?.slug}`}
          label="achievement"
          postDeleteAction={() => {
            router.push("/codesync/achievements");
          }}
        />
      ) : null}

      <Link
        href="/codesync/achievements"
        className="text-primary font-bold flex flex-row items-center 
                    justify-center gap-2 hover:border-b px-1 w-fit"
      >
        <FaArrowLeft />
        All Achievements
      </Link>

      <div className="w-full flex flex-row gap-2 justify-end">
        <Link
          href={`/codesync/achievements/${params?.slug}/edit`}
          type="button"
          className="hover:text-accent transition-all p-2"
        >
          <FaEdit />
        </Link>
        <button
          onClick={handleCanDelete}
          type="button"
          className="p-2 rounded-full hover:text-danger transition-all"
        >
          <FaTrashCan />
        </button>
      </div>

      <div className="flex flex-col gap-4 items-center justify-center w-full overflow-auto">
        <div className="w-full flex flex-col">
          <div
            style={{
              background: `linear-gradient(135deg, ${BADGE_PALETTE[achievement.badge_color].primary}, ${BADGE_PALETTE[achievement.badge_color].secondary}, ${BADGE_PALETTE[achievement.badge_color].primary})`,
            }}
            className="w-full flex items-center justify-center  p-8 rounded-lg"
          >
            {achievement.icon && achievement.icon !== "" && (
              <DisplayFile src={achievement.icon} type="image" />
            )}
          </div>
        </div>

        <div className="w-full flex flex-col">
          <div className="p-4 bg-primary/80 w-full rounded-t-md font-medium text-secondary text-center">
            <p>Basic Information</p>
          </div>

          <div
            className="flex flex-col p-2 border border-neutral-400 rounded-b-md bg-secondary text-sm 
                        l-l:min-h-auto l-l:max-h-none  t:p-4 gap-4 capitalize"
          >
            <DisplayInputField value={achievement.name} label="Name" />

            <DisplayInputField value={achievement.points} label="Points" />

            <DisplayInputField
              value={normalizeString(achievement.category)}
              label="Category"
            />

            <DisplayTextArea
              value={achievement.description}
              label="Description"
            />
          </div>
        </div>

        <div className="w-full flex flex-col">
          <div className="p-4 bg-primary/80 w-full rounded-t-md font-medium text-secondary text-center">
            <p>Unlock Criteria</p>
          </div>

          <div className="p-2 rounded-b-md border border-neutral-400 text-sm t:text-base t:p-4 flex flex-col gap-2">
            {mappedCriteria}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleAchievement;
