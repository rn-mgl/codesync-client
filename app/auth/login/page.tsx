"use client";

import login from "@/public/auth/login.svg";
import Input from "@/src/components/field/Input";
import Logo from "@/src/components/global/Logo";
import { LoginPayload, LoginResponse } from "@/src/interfaces/auth.interface";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { FaRegEnvelope, FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Page = () => {
  const [credentials, setCredentials] = React.useState<LoginPayload>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = React.useState(false);

  const url = process.env.SERVER_URL;

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

      const apiResponse: LoginResponse = await response.json();

      if (!apiResponse.success) {
        throw new Error(apiResponse.message);
      }

      const loginData = apiResponse.data;

      // register login data to session
      const authenticated = await signIn("credentials", {
        redirect: false,
        credentials: JSON.stringify({
          token: loginData.token,
          id: loginData.user.id,
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
    <div className="w-full h-screen flex flex-col items-center justify-center bg-primary p-4 t:p-8">
      <div className="w-full max-w-(--breakpoint-l-s) bg-secondary h-full rounded-2xl grid grid-cols-1 l-s:grid-cols-2 p-2 gap-10">
        <div className="w-full flex flex-col items-start justify-start p-4">
          <Link href="/" className="w-8">
            <Logo type="dark" />
          </Link>

          <div
            className="w-full flex flex-col items-start justify-start gap-10 my-auto 
                      t:mx-auto t:max-w-(--breakpoint-m-l) l-s:max-w-none"
          >
            <div className="flex flex-col items-start justify-center gap-4 w-full">
              <h1 className="text-3xl  t:text-4xl">
                <span className="text-primary font-black">Hello,</span>
                <br />
                <span className="text-primary/80 font-bold">Welcome Back</span>
              </h1>

              <p className="text-primary/60 text-sm font-semibold t:text-base">
                Ready to learn?
              </p>
            </div>

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
                    <FaRegEye
                      onClick={handleShowPassword}
                      className="cursor-pointer"
                    />
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

            <div className="w-full flex flex-row text-xs gap-1">
              <p className="text-primary/60">Don&apos;t have an account?</p>
              <Link
                href="/auth/register"
                className="font-bold text-blue-500 hover:underline transition-all"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>

        <div className="hidden l-s:flex w-full h-full bg-linear-to-b from-primary/80 to-primary rounded-xl flex-col items-center justify-center">
          <div className="w-full flex flex-col items-center justify-center">
            <Image
              src={login}
              alt="login"
              draggable={false}
              className="aspect-square drop-shadow-lg drop-shadow-secondary/50 animate-float"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
