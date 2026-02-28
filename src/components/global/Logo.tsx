import React from "react";
import logoDark from "@/public/global/logoDark.svg";
import logoLight from "@/public/global/logoLight.svg";
import Image from "next/image";

const Logo = (props: { type?: "light" | "dark"; isTransparent?: boolean }) => {
  return (
    <div
      className={`p-1 rounded-sm flex flex-col items-center w-full justify-center aspect-square max-w-10
                ${!props.isTransparent && (props.type === "light" ? "bg-primary" : "bg-secondary")} `}
    >
      <Image src={props.type === "light" ? logoLight : logoDark} alt="logo" />
    </div>
  );
};

export default Logo;
