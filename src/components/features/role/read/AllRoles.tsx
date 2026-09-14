"use client";

import Table from "@/src/components/ui/containers/Table";
import {
  BaseRole,
  GetAllRolesResponse,
  RoleList,
} from "@/src/interfaces/role.interface";
import Link from "next/link";
import React from "react";

const AllRoles = () => {
  const [roles, setRoles] = React.useState<BaseRole[]>([]);

  const mappedRoles = roles.map((role) => {
    return (
      <Link
        href={`/codesync/roles/${role.id}`}
        key={role.id}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full not-last:border-b-2 border-neutral-400 transition-all
                  hover:bg-neutral-200 first:rounded-t-md last:rounded-b-md"
      >
        <div className="grid grid-cols-2 w-full p-4 gap-4 text-sm items-center">
          <p>{role.id}</p>
          <p className="truncate">{role.role}</p>
        </div>
      </Link>
    );
  });

  React.useEffect(() => {
    const getRoles = async () => {
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
        console.log(error);
      }
    };

    getRoles();
  }, []);

  return (
    <div className="w-full flex flex-col items-start justify-start h-auto gap-8">
      <Table<RoleList> headers={["id", "role"]} data={mappedRoles} />
    </div>
  );
};

export default AllRoles;
