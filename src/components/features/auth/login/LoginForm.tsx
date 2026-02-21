"use client";

import Input from "@/src/components/ui/fields/Input";
import { LoginPayload, LoginResponse } from "@/src/interfaces/auth.interface";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { FaRegEnvelope, FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
const LoginForm = () => {
  const [credentials, setCredentials] = React.useState<LoginPayload>({
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

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credentials }),
      });

      const resolve: LoginResponse = await response.json();

      if (!resolve.success) {
        throw new Error(resolve.message);
      }

      const data = resolve.data;

      if (!data.user.is_verified || !data.token) {
        router.push("/auth/sending?type=verification");
        return;
      }

      // register login data to session
      const authenticated = await signIn("credentials", {
        redirect: false,
        credentials: JSON.stringify({
          token: data.token,
          id: data.user.id,
        }),
      });

      if (authenticated?.ok) {
        router.push("/codesync");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={(e) => handleLogin(e)}
      className="w-full flex flex-col items-center justify-center gap-2"
    >
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

      <div className="w-full flex flex-row text-xs gap-1">
        <Link
          href="/auth/forgot"
          className="font-bold text-blue-500 hover:underline transition-all"
        >
          Forgot Password?
        </Link>
      </div>

      <button
        type="submit"
        className="mt-4 bg-primary text-secondary font-bold w-full p-2 rounded-md"
      >
        Log In
      </button>
    </form>
  );
};

export default LoginForm;
