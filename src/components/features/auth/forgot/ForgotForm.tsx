"use client";

import Input from "@/src/components/ui/fields/Input";
import { ForgotPayload, ForgotResponse } from "@/src/interfaces/auth.interface";
import { useRouter } from "next/navigation";
import React from "react";
import { FaRegEnvelope } from "react-icons/fa6";

const ForgotForm = () => {
  const [credentials, setCredentials] = React.useState<ForgotPayload>({
    username: "",
    email: "",
  });

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

  const handleForgot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/auth/forgot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credentials }),
      });

      const resolve: ForgotResponse = await response.json();

      if (!resolve.success) {
        throw new Error(resolve.message);
      }

      const data = resolve.data;

      if (!data.success) {
        throw new Error(
          "Your request to reset password was not processed successfully.",
        );
      }

      router.push("/auth/sending?type=reset");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={(e) => handleForgot(e)}
      className="w-full flex flex-col items-center justify-center gap-2"
    >
      <Input
        id="username"
        name="username"
        onChange={handleCredentials}
        type="username"
        value={credentials.username}
        icon={<FaRegEnvelope />}
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

      <button
        type="submit"
        className="mt-4 bg-primary text-secondary font-bold w-full p-2 rounded-md"
      >
        Submit
      </button>
    </form>
  );
};

export default ForgotForm;
