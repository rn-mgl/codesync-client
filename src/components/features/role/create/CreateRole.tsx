"use client";

import Input from "@/src/components/ui/fields/Input";
import { CreateRoleResponse, RoleForm } from "@/src/interfaces/role.interface";
import { getErrorMessage } from "@/src/utils/general.util";
import { errorToast, successToast } from "@/src/utils/toast.util";
import React from "react";
import { FaUser } from "react-icons/fa6";

const CreateRole = () => {
  const [role, setRole] = React.useState<RoleForm>({
    role: "",
  });

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
      console.log(error);
      errorToast(getErrorMessage(error));
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
        className="w-full p-2 rounded-md bg-primary font-black text-secondary"
      >
        Create
      </button>
    </form>
  );
};

export default CreateRole;
