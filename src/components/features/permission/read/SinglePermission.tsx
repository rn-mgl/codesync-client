"use client";

import DisplayInputField from "@/src/components/ui/containers/DisplayInputField";
import DisplayTextArea from "@/src/components/ui/containers/DisplayTextArea";
import Delete from "@/src/components/ui/forms/Delete";
import ListLoader from "@/src/components/ui/loader/ListLoader";
import {
  BasePermission,
  GetPermissionResponse,
} from "@/src/interfaces/permission.interface";
import { getErrorMessage } from "@/src/utils/general.util";
import { errorToast } from "@/src/utils/toast.util";
import { DateTime } from "luxon";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import React from "react";
import { FaArrowLeft, FaCalendar, FaEdit, FaStickyNote } from "react-icons/fa";
import { FaTrashCan, FaUser } from "react-icons/fa6";

const SinglePermission = () => {
  const [permission, setPermission] = React.useState<BasePermission>({
    id: 0,
    created_at: "",
    created_by: 0,
    description: "",
    permission: "",
    updated_at: "",
  });

  const [canDelete, setCanDelete] = React.useState(false);

  const [loading, setLoading] = React.useState(true);

  const params: { id?: string } | null = useParams();

  const router = useRouter();

  const handleCanDelete = () => {
    setCanDelete((prev) => !prev);
  };

  React.useEffect(() => {
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
  }, [params?.id]);

  return (
    <div className="flex flex-col items-start justify-start w-full gap-8">
      {canDelete && (
        <Delete
          closeForm={handleCanDelete}
          endpoint={`permission/${params?.id}`}
          label="Permission"
          postDeleteAction={() => router.push("/codesync/permissions")}
        />
      )}

      <div className="w-full flex justify-between">
        <Link
          href="/codesync/permissions"
          className="text-primary font-bold flex flex-row items-center 
                        justify-center gap-2 hover:border-b px-1 w-fit"
        >
          <FaArrowLeft />
          All Permission
        </Link>

        <div>
          <div className="flex gap-2">
            <Link
              title="Edit"
              href={`/codesync/permissions/${params?.id}/edit`}
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
              value={permission.permission}
              icon={<FaUser />}
              label="Permission"
            />

            <DisplayTextArea
              value={permission.description}
              icon={<FaStickyNote />}
              label="Description"
            />

            <DisplayInputField
              value={DateTime.fromSQL(permission.created_at).toFormat("DDD")}
              icon={<FaCalendar />}
              label="Created At"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SinglePermission;
