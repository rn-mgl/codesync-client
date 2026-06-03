"use client";

import { BaseUser, GetUserResponse } from "@/src/interfaces/user.interface";
import { useSession } from "next-auth/react";
import React from "react";
import { FaEdit } from "react-icons/fa";
import { FaLock } from "react-icons/fa6";
import UpdateUserDetails from "../update/UpdateUserDetails";

const UserDetails = () => {
  const [user, setUser] = React.useState<BaseUser>({
    email: "",
    first_name: "",
    id: 0,
    is_verified: false,
    last_name: "",
    problems_solved: 0,
    total_submission: 0,
    username: "",
    image: "",
  });
  const [canEditDetails, setCanEditDetails] = React.useState(false);
  const [canChangePassword, setCanChangePassword] = React.useState(false);

  useSession({ required: true });

  const handleCanEditDetails = () => {
    setCanEditDetails((prev) => !prev);
  };

  const handleCanChangePassword = () => {
    setCanChangePassword((prev) => !prev);
  };

  React.useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(`/api/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const resolve: GetUserResponse = await response.json();

        if (!resolve.success) {
          throw new Error(resolve.message);
        }

        const { user } = resolve.data;

        setUser(user);
      } catch (error) {
        console.log(error);
      }
    };

    getUser();
  }, []);

  return (
    <div className="w-full flex flex-col gap-4">
      {canEditDetails && (
        <UpdateUserDetails
          user={{
            first_name: user.first_name,
            image: user.image,
            last_name: user.last_name,
            username: user.username,
          }}
          closeForm={handleCanEditDetails}
          label="Profile"
        />
      )}

      <div className="w-full flex flex-col gap-4 t:flex-row">
        <div className="w-full h-full bg-primary rounded-lg aspect-square t:max-w-60"></div>
        <div className="w-full rounded-lg bg-neutral-200 p-4 flex flex-col items-center justify-center gap-2">
          <p>
            <span className="font-bold">
              {user.first_name} {user.last_name}
            </span>{" "}
            | <span>{user.username}</span>
          </p>
          <p className="text-sm">{user.email}</p>
        </div>
      </div>

      <div className="w-full flex flex-row justify-between text-neutral-600">
        <button
          onClick={handleCanEditDetails}
          className="p-2 rounded-full flex flex-col items-center justify-center hover:text-primary"
        >
          <FaEdit />
        </button>

        <button className="p-2 rounded-full flex flex-col items-center justify-center hover:text-primary">
          <FaLock />
        </button>
      </div>
    </div>
  );
};

export default UserDetails;
