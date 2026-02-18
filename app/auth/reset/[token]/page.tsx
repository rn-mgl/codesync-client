"use client";

import reset from "@/public/auth/reset.svg";
import Input from "@/src/components/field/Input";
import Logo from "@/src/components/global/Logo";
import { ResetInterface } from "@/src/interfaces/auth.interface";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Reset = () => {
  const [credentials, setCredentials] = React.useState<ResetInterface>({
    password: "",
    confirm_password: "",
  });
  const [showPassword, setShowPassword] = React.useState({
    password: false,
    confirm_password: false,
  });

  const params = useParams();

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
      if (credentials.password !== credentials.confirm_password) {
        return;
      }

      const { data } = await axios.patch(`${url}/auth/reset`, {
        credentials,
        token: params?.token ?? null,
      });

      if (!data || !data.success) {
        return;
      }

      router.push("/auth/login");
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
                <span className="text-primary font-black">Reset Password</span>
              </h1>

              <p className="text-primary/60 text-sm font-semibold t:text-base">
                Enter new password
              </p>
            </div>

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
          </div>
        </div>

        <div className="hidden l-s:flex w-full h-full bg-linear-to-b from-primary/80 to-primary rounded-xl flex-col items-center justify-center">
          <div className="w-full flex flex-col items-center justify-center">
            <Image
              src={reset}
              alt="reset"
              className="aspect-square drop-shadow-lg drop-shadow-secondary/50 animate-float"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reset;
