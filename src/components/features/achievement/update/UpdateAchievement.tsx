"use client";

import { BADGE_PALETTE } from "@/src/configs/achievement.config";
import Input from "@/src/components/ui/fields/Input";
import Select from "@/src/components/ui/fields/Select";
import TextArea from "@/src/components/ui/fields/TextArea";
import useSelect from "@/src/hooks/useSelect";
import {
  AchievementForm,
  GetAchievementResponse,
  UpdateAchievementResponse,
} from "@/src/interfaces/achievement.interface";
import { getErrorMessage } from "@/src/utils/general.util";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React from "react";
import { FaChartLine, FaLink, FaStickyNote } from "react-icons/fa";
import { FaLockOpen, FaTrophy } from "react-icons/fa6";
import { toast } from "sonner";

const UpdateAchievement = () => {
  const [achievement, setAchievement] = React.useState<
    AchievementForm & Pick<AchievementForm, "icon">
  >({
    badge_color: "bronze",
    category: "problems",
    description: "",
    icon: "",
    name: "",
    points: 0,
    slug: "",
    unlock_criteria: "",
  });

  useSession({ required: true });

  const params: { slug?: string } | null = useParams();

  const { select: badgeColor, handleSelect: handleBadgeColor } = useSelect(
    { label: "Bronze", value: "bronze" },
    setAchievement,
  );

  const { select: category, handleSelect: handleCategory } = useSelect(
    { label: "Problems", value: "problems" },
    setAchievement,
  );

  const handleAchievement = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setAchievement((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleCreate = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!params?.slug) return;

      const achievementPayload = {
        badge_color: achievement.badge_color,
        category: achievement.category,
        description: achievement.description,
        name: achievement.name,
        points: String(achievement.points),
        slug: achievement.slug,
        unlock_criteria: achievement.unlock_criteria,
      };

      const response = await fetch(`/api/achievement/${params.slug}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ achievement: achievementPayload }),
      });

      const resolve: UpdateAchievementResponse = await response.json();

      if (!resolve.success) {
        throw new Error(resolve.message);
      }
      const { message } = resolve.data;

      toast(message);
    } catch (error) {
      console.error(error);
      const message = getErrorMessage(error);
      toast(message);
    }
  };

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

        setAchievement({
          badge_color: achievement.badge_color,
          category: achievement.category,
          description: achievement.description,
          icon: achievement.icon,
          name: achievement.name,
          points: achievement.points,
          slug: achievement.slug,
          unlock_criteria: JSON.stringify(achievement.unlock_criteria, null, 2),
        });
      } catch (error) {
        console.error(error);
      }
    };

    getAchievement();
  }, [params?.slug]);

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
            id="name"
            name="name"
            onChange={handleAchievement}
            type="text"
            value={achievement.name}
            label="Name"
            icon={<FaTrophy />}
            required={true}
          />

          <Input
            id="slug"
            name="slug"
            onChange={handleAchievement}
            type="text"
            value={achievement.slug}
            label="Slug"
            icon={<FaLink />}
            required={true}
          />

          <TextArea
            id="description"
            name="description"
            onChange={handleAchievement}
            value={achievement.description}
            label="Description"
            columns={6}
            required={true}
            icon={<FaStickyNote />}
          />
        </div>
      </div>

      <div className="w-full flex flex-col items-start justify-start">
        <div className="p-4 bg-primary/80 w-full rounded-t-md font-medium text-secondary">
          Achievement Content
        </div>

        <div className="w-full flex flex-col items-start justify-start gap-4 p-2 border-primary/50 border rounded-b-md t:p-4">
          <div className="w-full flex flex-col">
            <div
              style={{
                background: `linear-gradient(135deg, ${BADGE_PALETTE[achievement.badge_color].primary}, ${BADGE_PALETTE[achievement.badge_color].secondary}, ${BADGE_PALETTE[achievement.badge_color].primary})`,
              }}
              className="w-full flex items-center justify-center  p-8 rounded-lg"
            >
              <div
                dangerouslySetInnerHTML={{ __html: achievement.icon }}
                className="w-full max-w-60 drop-shadow-xl"
              />
            </div>
          </div>

          <Select
            label="Badge Color"
            id="badge_color"
            name="badge_color"
            activeLabel={badgeColor.label}
            onChange={handleBadgeColor}
            options={[
              { label: "Gold", value: "gold" },
              { label: "Silver", value: "silver" },
              { label: "Bronze", value: "bronze" },
            ]}
            value={badgeColor.value}
          />

          <Select
            label="Category"
            id="category"
            name="category"
            activeLabel={category.label}
            onChange={handleCategory}
            options={[
              { label: "Problems", value: "problems" },
              { label: "Streak", value: "streak" },
              { label: "Social", value: "social" },
              { label: "Skill", value: "skill" },
              { label: "Special", value: "special" },
            ]}
            value={category.value}
          />
        </div>
      </div>

      <div className="w-full flex flex-col items-start justify-start">
        <div className="p-4 bg-primary/80 w-full rounded-t-md font-medium text-secondary">
          Achievement Contract
        </div>

        <div className="w-full flex flex-col items-start justify-start gap-4 p-2 border-primary/50 border rounded-b-md t:p-4">
          <Input
            id="points"
            name="points"
            onChange={handleAchievement}
            value={achievement.points}
            label="Points"
            required={true}
            icon={<FaChartLine />}
            type="number"
          />

          <TextArea
            id="unlock_criteria"
            name="unlock_criteria"
            onChange={handleAchievement}
            value={achievement.unlock_criteria}
            label="Unlock Criteria"
            columns={6}
            required={true}
            icon={<FaLockOpen />}
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

export default UpdateAchievement;
