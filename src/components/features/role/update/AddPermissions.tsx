"use client";

import CheckBox from "@/src/components/ui/fields/CheckBox";
import ListLoader from "@/src/components/ui/loader/ListLoader";
import useCheckBox from "@/src/hooks/useCheckBox";
import { BasePermission } from "@/src/interfaces/permission.interface";
import {
  CreateRolePermissionResponse,
  GetRolePermissions,
} from "@/src/interfaces/role.interface";
import { normalizeString } from "@/src/utils/normalizer.util";
import { getErrorMessage } from "@/src/utils/general.util";
import { errorToast, successToast } from "@/src/utils/toast.util";
import { useParams } from "next/navigation";
import React from "react";
import { FaXmark } from "react-icons/fa6";

const AddPermissions = (props: { closeModal: () => void }) => {
  const [loading, setLoading] = React.useState(true);
  const [permissions, setPermissions] = React.useState<BasePermission[]>([]);

  const { checkedItems, handleCheck, prefillCheckedItems } = useCheckBox();

  const params: { id?: string } | null = useParams();

  const permissionOptions = permissions.map((p) => ({
    label: normalizeString(p.permission),
    value: p.id,
  }));

  const handleAddPermission = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (!params?.id) {
        return;
      }

      const payload = {
        role: params.id,
        permissions: checkedItems,
      };

      const response = await fetch(`/api/role-permission`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role_permission: payload }),
      });

      const resolve: CreateRolePermissionResponse = await response.json();

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
    const getRolePermissions = async () => {
      try {
        if (!params?.id) {
          return;
        }

        const response = await fetch(`/api/role-permission/${params.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const resolve: GetRolePermissions = await response.json();

        if (!resolve.success) {
          throw new Error(resolve.message);
        }

        const { permissions, role_permissions } = resolve.data;

        setPermissions(permissions);

        prefillCheckedItems(role_permissions.map((rp) => rp.permission_id));
      } catch (error) {
        errorToast(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    getRolePermissions();
  }, [params?.id, prefillCheckedItems]);

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center fixed top-0 
                      left-0 z-40 backdrop-blur-md bg-linear-to-b from-primary/20 to-accent/20 animate-fade"
    >
      <div className="w-full h-full flex flex-col items-center justify-center max-w-(--breakpoint-l-l) p-4 gap-2">
        <div className="w-full rounded-lg capitalize bg-primary text-secondary font-bold flex items-center justify-between p-4">
          <h1>Add Permission</h1>

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
                  options={permissionOptions}
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

export default AddPermissions;
