"use client";

import Table from "@/src/components/ui/containers/Table";
import BlockLoader from "@/src/components/ui/loader/BlockLoader";
import {
  BaseRole,
  GetAllRolesResponse,
  RoleList,
} from "@/src/interfaces/role.interface";
import { getErrorMessage } from "@/src/utils/general.util";
import { errorToast } from "@/src/utils/toast.util";
import { DateTime } from "luxon";
import Link from "next/link";
import React from "react";

const AllRoles = () => {
  const [roles, setRoles] = React.useState<BaseRole[]>([]);
  const [loading, setLoading] = React.useState(true);

  const mappedRoles = roles.map((role) => {
    return (
      <Link
        href={`/codesync/roles/${role.id}`}
        key={role.id}
        rel="noopener noreferrer"
        className="w-full not-last:border-b-2 border-neutral-400 transition-all
                  hover:bg-neutral-200 first:rounded-t-md last:rounded-b-md"
      >
        <div className="grid grid-cols-3 w-full p-4 gap-4 text-sm items-center">
          <p className="p-2">{role.id}</p>
          <p className="truncate p-2">{role.role}</p>
          <p className="truncate p-2">
            {DateTime.fromSQL(role.created_at).toFormat("DDD")}
          </p>
        </div>
      </Link>
    );
  });

  React.useEffect(() => {
    const getRoles = async () => {
      setLoading(true);

      try {
        const response = await fetch(`/api/role`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const resolve: GetAllRolesResponse = await response.json();

        if (!resolve.success) {
          throw new Error(resolve.message);
        }

        const { roles } = resolve.data;

        setRoles(roles);
      } catch (error) {
        errorToast(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    getRoles();
  }, []);

  return (
    <div className="w-full flex flex-col items-start justify-start h-auto gap-8">
      {loading ? (
        <BlockLoader />
      ) : (
        <Table<RoleList>
          headers={["id", "role", "created_at"]}
          data={mappedRoles}
        />
      )}
    </div>
  );
};

export default AllRoles;
