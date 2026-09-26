"use client";

import DisplayInputField from "@/src/components/ui/containers/DisplayInputField";
import Delete from "@/src/components/ui/forms/Delete";
import ListLoader from "@/src/components/ui/loader/ListLoader";
import {
  BaseRole,
  GetRoleResponse,
  RolePermissions,
  UserRoles,
} from "@/src/interfaces/role.interface";
import { getErrorMessage } from "@/src/utils/general.util";
import { normalizeString } from "@/src/utils/normalizer.util";
import { errorToast } from "@/src/utils/toast.util";
import { DateTime } from "luxon";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import { FaCalendar, FaPlus, FaTrashCan, FaUser } from "react-icons/fa6";
import AddPermissions from "../update/AddPermissions";
import AssignRoles from "../update/AssignRoles";
import { destroy, update } from "@/src/configs/permission.config";
import { useSession } from "next-auth/react";

const SingleRole = () => {
  const [role, setRole] = React.useState<BaseRole>({
    id: 0,
    role: "",
    created_at: "",
    created_by: 0,
    updated_at: "",
  });
  const [rolePermissions, setRolePermissions] = React.useState<
    RolePermissions[]
  >([]);
  const [users, setUsers] = React.useState<UserRoles[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [canDelete, setCanDelete] = React.useState(false);
  const [canAddPermissions, setCanAddPermissions] = React.useState(false);
  const [canAssignUserRole, setCanAssignUserRole] = React.useState(false);

  const params: { id?: string } | null = useParams();

  const { data: session } = useSession({ required: true });

  const permissions = session?.user.permissions ?? [];

  const router = useRouter();

  const mappedPermissions = rolePermissions.map((rolePermission) => {
    return (
      <div
        key={`${rolePermission.role_id}-${rolePermission.permission_id}`}
        className="flex flex-row items-center justify-center bg-neutral-200 w-fit p-1 px-2 rounded-full text-xs gap-2"
      >
        <p className="capitalize">
          {normalizeString(rolePermission.permission)}
        </p>
      </div>
    );
  });

  const mappedUsers = users.map((user) => {
    return (
      <div
        key={user.id}
        className="w-full gap-2 p-2 rounded-md flex items-center justify-between bg-neutral-200 t:w-fit"
      >
        {typeof user.image === "string" && user.image !== "" ? (
          <Image
            src={user.image}
            width={100}
            height={100}
            className="rounded-full aspect-square w-10 h-10 max-w-10 max-h-10"
            alt="image"
          />
        ) : (
          <div className="p-4 aspect-square rounded-full w-10 h-10 max-w-10 max-h-10 bg-primary"></div>
        )}

        <div className="w-full">
          <p className="truncate font-bold text-sm">
            {user.first_name} {user.last_name} | {user.username}
          </p>
          <p className="text-xs">{user.email}</p>
        </div>
      </div>
    );
  });

  const handleCanDelete = () => {
    setCanDelete((prev) => !prev);
  };

  const handleCanAddPermissions = () => {
    setCanAddPermissions((prev) => !prev);
  };

  const handleCanAssignUserRole = () => {
    setCanAssignUserRole((prev) => !prev);
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

        const { role, permissions, users } = resolve.data;

        setRole(role);
        setRolePermissions(permissions);
        setUsers(users);
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

      {canAddPermissions && (
        <AddPermissions closeModal={handleCanAddPermissions} />
      )}

      {canAssignUserRole && (
        <AssignRoles closeModal={handleCanAssignUserRole} />
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
            {permissions.includes(update.role) && (
              <Link
                title="Edit"
                href={`/codesync/roles/${params?.id}/edit`}
                className="p-2 rounded-full bg-inherit hover:text-accent flex flex-col items-center justify-center"
              >
                <FaEdit />
              </Link>
            )}

            {permissions.includes(destroy.role) && (
              <button
                title="Delete"
                onClick={handleCanDelete}
                className="p-2 rounded-full bg-inherit hover:text-danger flex flex-col items-center justify-center"
              >
                <FaTrashCan />
              </button>
            )}

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
        <>
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

          <div className="w-full flex flex-col items-start justify-start">
            <div className="p-2 bg-primary/80 w-full rounded-t-md font-medium text-secondary flex flex-row justify-between">
              <p className="p-2">Granted Permissions</p>

              {permissions.includes(update.role) &&
                permissions.includes(update.permission) && (
                  <button
                    onClick={handleCanAddPermissions}
                    className="p-2 rounded-full flex flex-row items-center justify-center gap-2 aspect-square"
                  >
                    <FaPlus />
                  </button>
                )}
              <button
                onClick={handleCanAddPermissions}
                className="p-2 rounded-full flex flex-row items-center justify-center gap-2 aspect-square"
              >
                <FaPlus />
              </button>
            </div>

            <div
              className="w-full text-sm p-2 gap-2 t:p-4 t:gap-4 items-start justify-start
                         border-primary/50 border rounded-b-md flex flex-row flex-wrap"
            >
              {mappedPermissions}
            </div>
          </div>

          <div className="w-full flex flex-col items-start justify-start">
            <div className="p-2 bg-primary/80 w-full rounded-t-md font-medium text-secondary flex flex-row justify-between">
              <p className="p-2">Users</p>

              {permissions.includes(update.role) &&
                permissions.includes(update.permission) && (
                  <button
                    onClick={handleCanAssignUserRole}
                    className="p-2 rounded-full flex flex-row items-center justify-center gap-2 aspect-square"
                  >
                    <FaPlus />
                  </button>
                )}
            </div>

            <div
              className="w-full text-sm p-2 gap-2 t:p-4 t:gap-4 items-start justify-start
                         border-primary/50 border rounded-b-md flex flex-row flex-wrap"
            >
              {mappedUsers}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SingleRole;
