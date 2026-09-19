"use client";

import CheckBox from "@/src/components/ui/fields/CheckBox";
import ListLoader from "@/src/components/ui/loader/ListLoader";
import useCheckBox from "@/src/hooks/useCheckBox";
import {
  CreateRolePermissionResponse,
  GetUserRoles,
} from "@/src/interfaces/role.interface";
import { BaseUser } from "@/src/interfaces/user.interface";
import { successToast } from "@/src/utils/toast.util";
import { useParams } from "next/navigation";
import React from "react";
import { FaXmark } from "react-icons/fa6";

const AssignRoles = (props: { closeModal: () => void }) => {
  const [loading, setLoading] = React.useState(true);
  const [users, setUsers] = React.useState<BaseUser[]>([]);

  const { checkedItems, handleCheck, prefillCheckedItems } = useCheckBox();

  const params: { id?: string } | null = useParams();

  const userOptions = users.map((u) => ({
    label: `${u.first_name} ${u.last_name} | ${u.username}`,
    value: u.id,
  }));

  const handleAddPermission = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (!params?.id) {
        return;
      }

      const payload = {
        role: params.id,
        users: checkedItems,
      };

      const response = await fetch(`/api/user-role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_role: payload }),
      });

      const resolve: CreateRolePermissionResponse = await response.json();

      if (!resolve.success) {
        throw new Error(resolve.message);
      }

      const { message } = resolve.data;

      successToast(message);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const getRolePermissions = async () => {
      try {
        if (!params?.id) {
          return;
        }

        const searchParams = {
          lookup: "users",
        };

        const query = new URLSearchParams(searchParams).toString();

        const response = await fetch(`/api/user-role/${params.id}?${query}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const resolve: GetUserRoles = await response.json();

        if (!resolve.success) {
          throw new Error(resolve.message);
        }

        const { user_roles, users } = resolve.data;

        setUsers(users);
        prefillCheckedItems(user_roles.map((ur) => ur.id));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getRolePermissions();
  }, [params?.id, prefillCheckedItems]);

  console.log(checkedItems);

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center fixed top-0 
                      left-0 z-40 backdrop-blur-md bg-linear-to-b from-primary/20 to-accent/20 animate-fade"
    >
      <div className="w-full h-full flex flex-col items-center justify-center max-w-(--breakpoint-l-l) p-4 gap-2">
        <div className="w-full rounded-lg capitalize bg-primary text-secondary font-bold flex items-center justify-between p-4">
          <h1>Assign Role</h1>

          <button
            onClick={props.closeModal}
            className="p-2 rounded-full hover:bg-secondary/20"
          >
            <FaXmark />
          </button>
        </div>

        <div className="w-full h-auto max-h-full bg-secondary rounded-lg p-4 flex flex-col items-start justify-start gap-4 overflow-y-auto">
          {loading ? (
            <ListLoader />
          ) : (
            <form
              onSubmit={(e) => handleAddPermission(e)}
              className="w-full flex flex-col items-start justify-center gap-4"
            >
              <div className="w-full">
                <CheckBox
                  handleCheck={handleCheck}
                  id="permissions"
                  name="permissions"
                  options={userOptions}
                  selectedOptions={checkedItems}
                />
              </div>

              <button
                type="submit"
                className="w-full p-2 rounded-md bg-primary text-secondary font-bold mt-2"
              >
                Update
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignRoles;
