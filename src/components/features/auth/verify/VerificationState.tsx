"use client";

import unverified from "@/public/auth/unverified.svg";
import verified from "@/public/auth/verified.svg";
import verifying from "@/public/auth/verifying.svg";
import { VerifyResponse } from "@/src/interfaces/auth.interface";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { FaArrowRight } from "react-icons/fa6";

const VerificationState = () => {
  const [status, setStatus] = React.useState<
    "verifying" | "verified" | "unverified"
  >("verifying");

  const params = useParams();

  const STATUS_DISPLAY = {
    verifying: {
      message: <p>We are currently verifying your account.</p>,
      image: verifying,
    },
    verified: {
      message: (
        <div className="flex flex-col items-center justify-center text-center gap-2">
          <p>You have been verified and can proceed to Log In.</p>
          <Link
            href="/auth/login"
            className="p-2 rounded-md bg-secondary w-full text-primary font-bold mt-4 hover:brightness-90 
                      transition-all flex flex-row items-center justify-center gap-2 group"
          >
            Log In{" "}
            <FaArrowRight className="group-hover:translate-x-1 transition-all opacity-80" />
          </Link>
        </div>
      ),
      image: verified,
    },
    unverified: {
      message: (
        <p>
          An error occurred during the verification process. Please try again.
        </p>
      ),
      image: unverified,
    },
  };

  const handleVerification = React.useCallback(async () => {
    try {
      const response = await fetch(`/api/auth/verify`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: params?.token ?? null }),
      });

      const resolve: VerifyResponse = await response.json();

      if (!resolve.success) {
        throw new Error(resolve.message);
      }

      const data = resolve.data;

      if (!data) {
        setStatus("unverified");
      }

      setStatus(data.verified ? "verified" : "unverified");
    } catch (error) {
      console.error(error);

      setStatus("unverified");
    }
  }, [params]);

  React.useEffect(() => {
    handleVerification();
  }, [handleVerification]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full h-full text-center text-secondary">
      <div className="animate-fade">
        <Image
          src={STATUS_DISPLAY[status].image}
          alt="status"
          draggable={false}
          className="animate-float drop-shadow-xl drop-shadow-secondary/20"
        />
      </div>

      {STATUS_DISPLAY[status].message}
    </div>
  );
};

export default VerificationState;
