"use client";

import login from "@/public/auth/login.svg";
import Input from "@/src/components/field/Input";
import Logo from "@/src/components/global/Logo";
import { LoginInterface } from "@/src/interfaces/AuthInterface";
import axios from "axios";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { FaRegEnvelope, FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Login = () => {
  const [credentials, setCredentials] = React.useState<LoginInterface>({
    candidateEmail: "",
    candidatePassword: "",
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
      const { data } = await axios.post<{
        token: string;
        user: { id: number; is_verified: boolean };
      }>(`${url}/auth/login`, {
        credentials,
      });

      if (!data || !data.user.is_verified) {
        return;
      }

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
    } catch (error) {
      console.log(error);
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
                id="candidateEmail"
                name="candidateEmail"
                onChange={handleCredentials}
                type="email"
                value={credentials.candidateEmail}
                icon={<FaRegEnvelope />}
                label="Email"
                required={true}
              />

              <Input
                id="candidatePassword"
                name="candidatePassword"
                onChange={handleCredentials}
                type={showPassword ? "text" : "password"}
                value={credentials.candidatePassword}
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

export default Login;
