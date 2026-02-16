"use client";

import register from "@/public/auth/register.svg";
import Input from "@/src/components/field/Input";
import Logo from "@/src/components/global/Logo";
import { RegisterInterface } from "@/src/interface/AuthInterface";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import {
  FaRegEnvelope,
  FaRegEye,
  FaRegEyeSlash,
  FaRegUser,
} from "react-icons/fa6";

const Register = () => {
  const [credentials, setCredentials] = React.useState<RegisterInterface>({
    first_name: "",
    last_name: "",
    username: "",
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

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(`${url}/auth/register`, {
        credentials,
      });

      if (!data) {
        return;
      }

      router.push("/auth/sending?type=verification");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-primary p-4 t:p-8">
      <div className="w-full max-w-(--breakpoint-l-s) bg-secondary h-full rounded-2xl grid grid-cols-1 l-s:grid-cols-2 p-2 gap-10 overflow-y-auto">
        <div className="w-full flex flex-col items-start justify-start p-4">
          <Link href="/" className="w-8">
            <Logo type="dark" />
          </Link>

          <div
            className="w-full flex flex-col items-start justify-start gap-10 my-auto 
                      t:mx-auto t:max-w-(--breakpoint-m-l) l-s:max-w-none"
          >
            <div className="flex flex-col items-start justify-center gap-4 w-full">
              <h1 className="text-3xl t:text-4xl">
                <span className="text-primary font-black">Hello,</span>
                <br />
                <span className="text-primary/80 font-bold">
                  Welcome to CodeSync
                </span>
              </h1>

              <p className="text-primary/60 text-sm font-semibold t:text-base">
                Join Us!
              </p>
            </div>

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
                    <FaRegEye
                      onClick={handleShowPassword}
                      className="cursor-pointer"
                    />
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

            <div className="w-full flex flex-row text-xs gap-1">
              <p className="text-primary/60">Alreay have an account?</p>
              <Link
                href="/auth/login"
                className="font-bold text-blue-500 hover:underline transition-all"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>

        <div className="hidden l-s:flex w-full h-full bg-linear-to-b from-primary/80 to-primary rounded-xl flex-col items-center justify-center">
          <div className="w-full flex flex-col items-center justify-center">
            <Image
              src={register}
              draggable={false}
              alt="register"
              className="aspect-square drop-shadow-lg drop-shadow-secondary/50 animate-float"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
