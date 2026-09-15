"use client";

import DisplayInputField from "@/src/components/ui/containers/DisplayInputField";
import Delete from "@/src/components/ui/forms/Delete";
import ListLoader from "@/src/components/ui/loader/ListLoader";
import { BaseRole, GetRoleResponse } from "@/src/interfaces/role.interface";
import { getErrorMessage } from "@/src/utils/general.util";
import { errorToast } from "@/src/utils/toast.util";
import { DateTime } from "luxon";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import React from "react";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import { FaCalendar, FaTrashCan, FaUser } from "react-icons/fa6";

const SingleRole = () => {
  const [role, setRole] = React.useState<BaseRole>({
    id: 0,
    role: "",
    created_at: "",
    created_by: 0,
    updated_at: "",
  });
  const [loading, setLoading] = React.useState(true);
  const [canDelete, setCanDelete] = React.useState(false);

  const params: { id?: string } | null = useParams();

  const router = useRouter();

  const handleCanDelete = () => {
    setCanDelete((prev) => !prev);
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
    <div className="flex flex-col items-start justify-start w-full gap-8">
      {canDelete && (
        <Delete
          closeForm={handleCanDelete}
          endpoint={`role/${params?.id}`}
          label="Role"
          postDeleteAction={() => router.push("/codesync/roles")}
        />
      )}

      <div className="w-full flex justify-between">
        <Link
          href="/codesync/roles"
          className="text-primary font-bold flex flex-row items-center 
                        justify-center gap-2 hover:border-b px-1 w-fit"
        >
          <FaArrowLeft />
          All Roles
        </Link>

        <div>
          <div className="flex gap-2">
            <Link
              title="Edit"
              href={`/codesync/roles/${params?.id}/edit`}
              className="p-2 rounded-full bg-inherit hover:text-accent flex flex-col items-center justify-center"
            >
              <FaEdit />
            </Link>

            <button
              title="Delete"
              onClick={handleCanDelete}
              className="p-2 rounded-full bg-inherit hover:text-danger flex flex-col items-center justify-center"
            >
              <FaTrashCan />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <ListLoader />
      ) : (
        <div className="w-full flex flex-col items-start justify-start">
          <div className="p-4 bg-primary/80 w-full rounded-t-md font-medium text-secondary">
            Basic Information
          </div>

          <div className="w-full flex flex-col items-start justify-start gap-4 p-2 border-primary/50 border rounded-b-md t:p-4">
            <DisplayInputField
              value={role.role}
              icon={<FaUser />}
              label="Role"
            />

            <DisplayInputField
              value={DateTime.fromSQL(role.created_at).toFormat("DDD")}
              icon={<FaCalendar />}
              label="Created At"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleRole;
