"use client";

import Input from "@/src/components/ui/fields/Input";
import Select from "@/src/components/ui/fields/Select";
import TextArea from "@/src/components/ui/fields/TextArea";
import useFile from "@/src/hooks/useFile";
import useSelect from "@/src/hooks/useSelect";
import {
  AchievementForm,
  CreateAchievementResponse,
} from "@/src/interfaces/achievement.interface";
import { getErrorMessage } from "@/src/utils/general.util";
import React from "react";
import { FaChartLine, FaLink, FaRegStickyNote } from "react-icons/fa";
import { FaLockOpen, FaRegFileImage, FaTrash, FaTrophy } from "react-icons/fa6";
import { toast } from "sonner";

const CreateAchievement = () => {
  const [achievement, setAchievement] = React.useState<AchievementForm>({
    badge_color: "bronze",
    category: "problems",
    description: "",
    icon: null,
    name: "",
    points: "",
    slug: "",
    unlock_criteria: "",
  });

  const { localFile, fileRef, handleLocalFile, removeLocalFile } =
    useFile(setAchievement);

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
      const formData = new FormData();

      if (!achievement.icon) return;

      formData.set("badge_color", achievement.badge_color);
      formData.set("category", achievement.category);
      formData.set("description", achievement.description);
      formData.set("icon", achievement.icon);
      formData.set("name", achievement.name);
      formData.set("points", achievement.points);
      formData.set("slug", achievement.slug);
      formData.set("unlock_criteria", achievement.unlock_criteria);

      const response = await fetch(`/api/achievement`, {
        method: "POST",
        body: formData,
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
            icon={<FaRegStickyNote />}
          />
        </div>
      </div>

      <div className="w-full flex flex-col items-start justify-start">
        <div className="p-4 bg-primary/80 w-full rounded-t-md font-medium text-secondary">
          Achievement Content
        </div>

        <div className="w-full flex flex-col items-start justify-start gap-4 p-2 border-primary/50 border rounded-b-md t:p-4">
          <div className="w-full flex flex-col bg-neutral-200 p-2 rounded-lg items-center t:p-4">
            <div className="w-full flex flex-col gap-2 items-center justify-center  t:max-w-(--breakpoint-m-l)">
              <label htmlFor="icon" className="w-full flex h-full">
                <div
                  style={{ backgroundImage: `url(${localFile.url})` }}
                  className="p-2 rounded-md aspect-video w-full border-neutral-400 bg-secondary border-2 flex flex-col 
                          items-center justify-center bg-cover bg-center"
                >
                  {!localFile.file && (
                    <FaRegFileImage className="opacity-50 text-2xl" />
                  )}
                </div>

                <input
                  onChange={(e) => handleLocalFile(e)}
                  ref={fileRef}
                  id="icon"
                  name="icon"
                  type="file"
                  className="sr-only"
                  accept="image/*"
                />
              </label>

              <div className="w-full flex flex-row gap-4 text-sm items-center">
                {localFile.file ? (
                  <>
                    <p className="truncate w-full">{localFile.file.name}</p>
                    <button
                      type="button"
                      onClick={removeLocalFile}
                      className="p-2 rounded-full hover:text-red-600 transition-all"
                    >
                      <FaTrash />
                    </button>
                  </>
                ) : (
                  <p className="italic text-neutral-600">Select a photo...</p>
                )}
              </div>
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
            type="text"
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
