"use client";

import Input from "@/src/components/ui/fields/Input";
import Select from "@/src/components/ui/fields/Select";
import TextArea from "@/src/components/ui/fields/TextArea";
import useFile from "@/src/hooks/useFile";
import useSelect from "@/src/hooks/useSelect";
import {
  AchievementForm,
  GetAchievementResponse,
  UpdateAchievementResponse,
} from "@/src/interfaces/achievement.interface";
import { getErrorMessage } from "@/src/utils/general.util";
import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";
import { FaChartLine, FaLink, FaRegStickyNote } from "react-icons/fa";
import { FaLockOpen, FaRegFileImage, FaTrash, FaTrophy } from "react-icons/fa6";
import { toast } from "sonner";

const UpdateAchievement = () => {
  const [achievement, setAchievement] = React.useState<
    Omit<AchievementForm, "icon"> & { icon: File | null | string }
  >({
    badge_color: "bronze",
    category: "problems",
    description: "",
    icon: null,
    name: "",
    points: "0",
    slug: "",
    unlock_criteria: "",
  });

  const params: { slug?: string } | null = useParams();

  const {
    fileRef,
    localFile,
    handleLocalFile,
    removeLocalFile,
    removeUploadedFile,
  } = useFile(setAchievement);

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
      if (!achievement.icon || !params?.slug) return;

      const formData = new FormData();

      formData.set("badge_color", achievement.badge_color);
      formData.set("category", achievement.category);
      formData.set("description", achievement.description);
      formData.set("icon", achievement.icon);
      formData.set("name", achievement.name);
      formData.set("points", achievement.points);
      formData.set("slug", achievement.slug);
      formData.set("unlock_criteria", achievement.unlock_criteria);

      const response = await fetch(`/api/achievement/${params.slug}`, {
        method: "PATCH",
        body: formData,
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

  const getAchievement = React.useCallback(async () => {
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
        points: String(achievement.points),
        slug: achievement.slug,
        unlock_criteria: JSON.stringify(achievement.unlock_criteria, null, 2),
      });
    } catch (error) {
      console.error(error);
    }
  }, [params]);

  React.useEffect(() => {
    getAchievement();
  }, [getAchievement]);

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
                  className="p-2 rounded-md aspect-video w-full border-neutral-400 bg-secondary border-2 flex flex-col 
                          items-center justify-center bg-cover bg-center overflow-hidden"
                >
                  {localFile.file ? (
                    <Image
                      width={500}
                      height={500}
                      alt="File"
                      src={localFile.url}
                      className="w-6/12"
                    />
                  ) : typeof achievement.icon === "string" &&
                    achievement.icon ? (
                    <Image
                      width={500}
                      height={500}
                      alt="File"
                      src={achievement.icon}
                      className="w-6/12"
                    />
                  ) : (
                    <FaRegFileImage className="text-2xl opacity-50" />
                  )}
                </div>

                <input
                  onChange={(e) => handleLocalFile(e)}
                  ref={fileRef}
                  id="icon"
                  name="icon"
                  type="file"
                  className="fixed w-0 h-0 p-0 m-0"
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
                ) : typeof achievement.icon === "string" && achievement.icon ? (
                  <>
                    <p className="truncate w-full">{achievement.name} Reward</p>
                    <button
                      type="button"
                      onClick={() => removeUploadedFile("icon")}
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
