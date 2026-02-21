"use client";

import Input from "@/src/components/ui/fields/Input";
import { ResetPayload, ResetResponse } from "@/src/interfaces/auth.interface";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const ResetForm = () => {
  const [credentials, setCredentials] = React.useState<ResetPayload>({
    password: "",
    confirm_password: "",
  });
  const [showPassword, setShowPassword] = React.useState({
    password: false,
    confirm_password: false,
  });

  const params = useParams();

  const router = useRouter();

  const handleCredentials = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setCredentials((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleShowPassword = (name: string) => {
    setShowPassword((prev) => {
      return {
        ...prev,
        [name]: !prev[name as keyof object],
      };
    });
  };

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/auth/reset`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credentials, token: params?.token ?? null }),
      });

      const resolve: ResetResponse = await response.json();

      if (!resolve.success) {
        throw new Error(resolve.message);
      }

      const data = resolve.data;

      if (!data.message) {
        throw new Error(`The request did not process completely.`);
      }

      router.push("/auth/login");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form
      onSubmit={(e) => handleReset(e)}
      className="w-full flex flex-col items-center justify-center gap-2"
    >
      <Input
        id="password"
        name="password"
        onChange={handleCredentials}
        type={showPassword.password ? "text" : "password"}
        value={credentials.password}
        icon={
          showPassword.password ? (
            <FaRegEyeSlash
              className="cursor-pointer"
              onClick={() => handleShowPassword("password")}
            />
          ) : (
            <FaRegEye
              className="cursor-pointer"
              onClick={() => handleShowPassword("password")}
            />
          )
        }
        label="Password"
        required={true}
      />

      <Input
        id="confirm_password"
        name="confirm_password"
        onChange={handleCredentials}
        type={showPassword.confirm_password ? "text" : "password"}
        value={credentials.confirm_password}
        icon={
          showPassword.confirm_password ? (
            <FaRegEyeSlash
              className="cursor-pointer"
              onClick={() => handleShowPassword("confirm_password")}
            />
          ) : (
            <FaRegEye
              className="cursor-pointer"
              onClick={() => handleShowPassword("confirm_password")}
            />
          )
        }
        label="Confirm Password"
        required={true}
      />

      <button
        type="submit"
        className="mt-4 bg-primary text-secondary font-bold w-full p-2 rounded-md"
      >
        Submit
      </button>
    </form>
  );
};

export default ResetForm;
