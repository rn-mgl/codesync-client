"use client";

import Table from "@/src/components/ui/containers/Table";
import BlockLoader from "@/src/components/ui/loader/BlockLoader";
import {
  BasePermission,
  GetAllPermissionsResponse,
  PermissionList,
} from "@/src/interfaces/permission.interface";
import { getErrorMessage } from "@/src/utils/general.util";
import { errorToast } from "@/src/utils/toast.util";
import { DateTime } from "luxon";
import Link from "next/link";
import React from "react";

const AllPermissions = () => {
  const [permissions, setPermissions] = React.useState<BasePermission[]>([]);
  const [loading, setLoading] = React.useState(true);

  const mappedPermissions = permissions.map((permission) => {
    return (
      <Link
        href={`/codesync/permissions/${permission.id}`}
        key={permission.id}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full not-last:border-b-2 border-neutral-400 transition-all
                  hover:bg-neutral-200 first:rounded-t-md last:rounded-b-md"
      >
        <div className="grid grid-cols-4 w-full p-4 gap-4 text-sm items-center">
          <p className="p-2">{permission.id}</p>
          <p className="truncate p-2">{permission.permission}</p>
          <p className="truncate p-2">{permission.description}</p>
          <p className="truncate p-2">
            {DateTime.fromSQL(permission.created_at).toFormat("DDD")}
          </p>
        </div>
      </Link>
    );
  });

  React.useEffect(() => {
    const getPermissions = async () => {
      try {
        const response = await fetch(`/api/permission`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const resolve: GetAllPermissionsResponse = await response.json();

        if (!resolve.success) {
          throw new Error(resolve.message);
        }

        const { permissions } = resolve.data;

        setPermissions(permissions);
      } catch (error) {
        errorToast(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    getPermissions();
  }, []);

  return (
    <div className="w-full flex flex-col items-start justify-start h-auto gap-8">
      {loading ? (
        <BlockLoader />
      ) : (
        <Table<PermissionList>
          headers={["id", "permission", "description", "created_at"]}
          data={mappedPermissions}
        />
      )}
    </div>
  );
};

export default AllPermissions;
