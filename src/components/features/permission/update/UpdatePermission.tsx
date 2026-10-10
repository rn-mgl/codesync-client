"use client";

import Input from "@/src/components/ui/fields/Input";
import TextArea from "@/src/components/ui/fields/TextArea";
import {
  GetPermissionResponse,
  PermissionForm,
  UpdatePermissionResponse,
} from "@/src/interfaces/permission.interface";
import { canAccess } from "@/src/configs/access.config";
import { getErrorMessage } from "@/src/utils/general.util";
import { errorToast, successToast } from "@/src/utils/toast.util";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { FaStickyNote } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";

const UpdatePermission = () => {
  const [permission, setPermission] = React.useState<PermissionForm>({
    permission: "",
    description: "",
  });

  const [loading, setLoading] = React.useState(true);

  const router = useRouter();

  const { data: session, status } = useSession({ required: true });

  const permissions = session?.user.permissions ?? [];

  const hasAccess =
    status === "authenticated" && canAccess(permissions, "permission:update");

  React.useEffect(() => {
    if (status === "authenticated" && !hasAccess) {
      router.replace("/codesync/permission");
    }
  }, [status, hasAccess, router]);

  const params: { id?: string } | null = useParams();

  const handlePermission = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setPermission((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleUpdate = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!params?.id) {
      return;
    }

    setLoading(true);

    try {
      const payload = {
        permission: permission.permission,
        description: permission.description,
      };

      const response = await fetch(`/api/permission/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ permission: payload }),
      });

      const resolve: UpdatePermissionResponse = await response.json();

      if (!resolve.success) {
        throw new Error(resolve.message);
      }

      const { message } = resolve.data;

      successToast(message);
    } catch (error) {
      errorToast(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!hasAccess) return;

    const getPermission = async () => {
      if (!params?.id) {
        return;
      }

      try {
        const response = await fetch(`/api/permission/${params.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const resolve: GetPermissionResponse = await response.json();

        if (!resolve.success) {
          throw new Error(resolve.message);
        }

        const { permission } = resolve.data;

        setPermission(permission);
      } catch (error) {
        errorToast(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    getPermission();
  }, [params?.id, hasAccess]);

  if (!hasAccess) return null;

  return (
    <form
      onSubmit={(e) => handleUpdate(e)}
      className="flex flex-col items-center justify-center w-full gap-8"
    >
      <div className="w-full flex flex-col items-start justify-start">
        <div className="p-4 bg-primary/80 w-full rounded-t-md font-medium text-secondary">
          Basic Information
        </div>

        <fieldset
          disabled={loading}
          className="w-full flex flex-col items-start justify-start gap-4 p-2 border-primary/50 border rounded-b-md t:p-4"
        >
          <Input
            id="permission"
            name="permission"
            onChange={handlePermission}
            type="text"
            value={permission.permission}
            label="Permission"
            icon={<FaUser />}
            required={true}
          />

          <TextArea
            id="description"
            name="description"
            onChange={handlePermission}
            value={permission.description}
            label="Description"
            icon={<FaStickyNote />}
            required={true}
          />
        </fieldset>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full p-2 rounded-md bg-primary font-black text-secondary disabled:opacity-50"
      >
        {loading ? "Updating..." : "Update"}
      </button>
    </form>
  );
};

export default UpdatePermission;
