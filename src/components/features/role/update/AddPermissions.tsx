"use client";

import ListLoader from "@/src/components/ui/loader/ListLoader";
import useCheckBox from "@/src/hooks/useCheckBox";
import { BasePermission } from "@/src/interfaces/permission.interface";
import {
  GetRolePermissions,
  RolePermissions,
} from "@/src/interfaces/role.interface";
import { useParams } from "next/navigation";
import React from "react";
import { FaFileWaveform, FaXmark } from "react-icons/fa6";

const AddPermissions = (props: { closeModal: () => void }) => {
  const [loading, setLoading] = React.useState(false);
  const [permissions, setPermissions] = React.useState<BasePermission[]>([]);

  const { checkedItems, handleCheck, prefillCheckedItems } = useCheckBox();

  const params: { id?: string } | null = useParams();

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
        console.log(error);
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
            <div className="w-full">
              <div></div>

              <button
                type="submit"
                className="w-full p-2 rounded-md bg-primary text-secondary font-bold mt-2"
              >
                Update
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddPermissions;
