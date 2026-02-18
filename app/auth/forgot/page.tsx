"use client";

import forgot from "@/public/auth/forgot.svg";
import Input from "@/src/components/field/Input";
import Logo from "@/src/components/global/Logo";
import { ForgotInterface } from "@/src/interfaces/AuthInterface";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { FaRegEnvelope } from "react-icons/fa6";

const Forgot = () => {
  const [credentials, setCredentials] = React.useState<ForgotInterface>({
    username: "",
    email: "",
  });

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

  const handleForgot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${url}/auth/forgot`, { credentials });

      if (!data || !data.success) {
        return;
      }

      router.push("/auth/sending?type=reset");
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
                <span className="text-primary font-black">
                  Retrieve Account
                </span>
              </h1>

              <p className="text-primary/60 text-sm font-semibold t:text-base">
                Enter credentials
              </p>
            </div>

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
          </div>
        </div>

        <div className="hidden l-s:flex w-full h-full bg-linear-to-b from-primary/80 to-primary rounded-xl flex-col items-center justify-center">
          <div className="w-full flex flex-col items-center justify-center">
            <Image
              src={forgot}
              alt="forgot"
              className="aspect-square drop-shadow-lg drop-shadow-secondary/50 animate-float"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forgot;
