"use client";

import Input from "@/src/components/ui/fields/Input";
import { CreateRoleResponse, RoleForm } from "@/src/interfaces/role.interface";
import { canAccess } from "@/src/configs/access.config";
import { getErrorMessage } from "@/src/utils/general.util";
import { errorToast, successToast } from "@/src/utils/toast.util";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { FaUser } from "react-icons/fa6";

const CreateRole = () => {
  const [loading, setLoading] = React.useState(false);
  const [role, setRole] = React.useState<RoleForm>({
    role: "",
  });

  const router = useRouter();

  const { data: session, status } = useSession({ required: true });

  const permissions = session?.user.permissions ?? [];

  const hasAccess =
    status === "authenticated" && canAccess(permissions, "role:create");

  React.useEffect(() => {
    if (status === "authenticated" && !hasAccess) {
      router.replace("/codesync/role");
    }
  }, [status, hasAccess, router]);

  if (!hasAccess) return null;

  const handleRole = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setRole((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleCreate = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const payload = {
        role: role.role,
      };

      const response = await fetch(`/api/role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: payload }),
      });

      const resolve: CreateRoleResponse = await response.json();

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
            id="role"
            name="role"
            onChange={handleRole}
            type="text"
            value={role.role}
            label="Role"
            icon={<FaUser />}
            required={true}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full p-2 rounded-md bg-primary font-black text-secondary disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create"}
      </button>
    </form>
  );
};

export default CreateRole;
