"use client";

import light from "@/public/global/LogoLight.svg";
import Input from "@/src/components/ui/fields/Input";
import Select from "@/src/components/ui/fields/Select";
import TextArea from "@/src/components/ui/fields/TextArea";
import useSelect from "@/src/hooks/useSelect";
import {
  AchievementForm,
  CreateAchievementResponse,
} from "@/src/interfaces/achievement.interface";
import { getErrorMessage } from "@/src/utils/general.util";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { FaChartLine, FaLink, FaStickyNote } from "react-icons/fa";
import { FaLockOpen, FaTrophy } from "react-icons/fa6";
import { toast } from "sonner";

const CreateAchievement = () => {
  const [achievement, setAchievement] = React.useState<AchievementForm>({
    badge_color: "bronze",
    category: "problems",
    description: "",
    name: "",
    points: 0,
    slug: "",
    unlock_criteria: "",
    icon: "",
  });

  useSession({ required: true });

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

  const { select: category, handleSelect: handleCategory } = useSelect(
    { label: "Problems", value: "problems" },
    setAchievement,
  );

  const { select: badgeColor, handleSelect: handleBadgeColor } = useSelect(
    { label: "Bronze", value: "bronze" },
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
      const response = await fetch(`/api/achievement`, {
        method: "POST",
        body: JSON.stringify({ achievement }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resolve: CreateAchievementResponse = await response.json();

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
              <Image
                src={light}
                alt="placeholder"
                className="w-full max-w-60 bg-primary p-2 rounded-lg shadow-lg"
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
        Create
      </button>
    </form>
  );
};

export default CreateAchievement;
