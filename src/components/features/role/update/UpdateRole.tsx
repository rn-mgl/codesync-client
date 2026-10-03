"use client";

import Input from "@/src/components/ui/fields/Input";
import {
  UpdateRoleResponse,
  RoleForm,
  GetRoleResponse,
} from "@/src/interfaces/role.interface";
import { getErrorMessage } from "@/src/utils/general.util";
import { errorToast, successToast } from "@/src/utils/toast.util";
import { useParams } from "next/navigation";
import React from "react";
import { FaUser } from "react-icons/fa6";

const UpdateRole = () => {
  const [role, setRole] = React.useState<RoleForm>({
    role: "",
  });

  const [loading, setLoading] = React.useState(true);

  const params: { id?: string } | null = useParams();

  const handleRole = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setRole((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleUpdate = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (!params?.id) {
        return;
      }

      const payload = {
        role: role.role,
      };

      const response = await fetch(`/api/role/${params?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: payload }),
      });

      const resolve: UpdateRoleResponse = await response.json();

      if (!resolve.success) {
        throw new Error(resolve.message);
      }

      const { message } = resolve.data;

      successToast(message);
    } catch (error) {
      errorToast(getErrorMessage(error));
    }
  };

  React.useEffect(() => {
    const getRole = async () => {
      if (!params?.id) {
        return;
      }

      try {
        const response = await fetch(`/api/role/${params.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const resolve: GetRoleResponse = await response.json();

        if (!resolve.success) {
          throw new Error(resolve.message);
        }

        const { role } = resolve.data;

        setRole(role);
      } catch (error) {
        errorToast(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    getRole();
  }, [params?.id]);

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
            id="role"
            name="role"
            onChange={handleRole}
            type="text"
            value={role.role}
            label="Role"
            icon={<FaUser />}
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

export default UpdateRole;
