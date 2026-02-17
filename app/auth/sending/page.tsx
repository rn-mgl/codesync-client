"use client";

import sending from "@/public/auth/sending.svg";
import Logo from "@/src/components/global/Logo";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Sending = ({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) => {
  const params = React.use(searchParams);
  const type = params.type;

  const TYPE_MESSAGE = {
    verification: "We are currently sending your verification mail.",
    reset: "We are currently sending your password reset mail.",
    default: "We are currently sending your mail.",
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-primary p-4 t:p-8">
      <div
        className="w-full max-w-(--breakpoint-l-s) bg-neutral-900 h-full relative
                  rounded-2xl flex flex-col items-start justify-start p-4 z-10 border-2 border-secondary/20"
      >
        <Link href="/" className="absolute">
          <Logo type="light" isTransparent={true} />
        </Link>

        <div className="flex flex-col items-center justify-center gap-2 w-full h-full text-center text-secondary">
          <div className="animate-fade">
            <Image
              src={sending}
              alt="sending"
              className="animate-float drop-shadow-xl drop-shadow-secondary/20"
            />
          </div>

          <p>{TYPE_MESSAGE[type as keyof object] ?? TYPE_MESSAGE.default}</p>
        </div>
      </div>
    </div>
  );
};

export default Sending;
