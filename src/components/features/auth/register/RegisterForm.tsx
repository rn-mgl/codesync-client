"use client";

import Input from "@/src/components/ui/fields/Input";
import {
  RegisterPayload,
  RegisterResponse,
} from "@/src/interfaces/auth.interface";
import { useRouter } from "next/navigation";
import React from "react";
import {
  FaRegEnvelope,
  FaRegEye,
  FaRegEyeSlash,
  FaRegUser,
} from "react-icons/fa6";

const RegisterForm = () => {
  const [credentials, setCredentials] = React.useState<RegisterPayload>({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = React.useState(false);

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

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credentials }),
      });

      const resolve: RegisterResponse = await response.json();

      if (!resolve.success) {
        throw new Error(resolve.message);
      }

      const data = resolve.data;

      if (!data.success || !data.token) {
        throw new Error(`An error occurred during registration.`);
      }

      router.push("/auth/sending?type=verification");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={(e) => handleRegister(e)}
      className="w-full flex flex-col items-center justify-center gap-2"
    >
      <Input
        id="first_name"
        name="first_name"
        onChange={handleCredentials}
        type="text"
        value={credentials.first_name}
        icon={<FaRegUser />}
        label="First Name"
        required={true}
      />

      <Input
        id="last_name"
        name="last_name"
        onChange={handleCredentials}
        type="text"
        value={credentials.last_name}
        icon={<FaRegUser />}
        label="Last Name"
        required={true}
      />

      <Input
        id="username"
        name="username"
        onChange={handleCredentials}
        type="text"
        value={credentials.username}
        icon={<FaRegUser />}
        label="Username"
        required={true}
      />

      <Input
        id="email"
        name="email"
        onChange={handleCredentials}
        type="email"
        value={credentials.email}
        icon={<FaRegEnvelope />}
        label="Email"
        required={true}
      />

      <Input
        id="password"
        name="password"
        onChange={handleCredentials}
        type={showPassword ? "text" : "password"}
        value={credentials.password}
        label="Password"
        required={true}
        icon={
          showPassword ? (
            <FaRegEyeSlash
              onClick={handleShowPassword}
              className="cursor-pointer"
            />
          ) : (
            <FaRegEye onClick={handleShowPassword} className="cursor-pointer" />
          )
        }
      />

      <button
        type="submit"
        className="mt-4 bg-primary text-secondary font-bold w-full p-2 rounded-md"
      >
        Sign Up
      </button>
    </form>
  );
};

export default RegisterForm;
