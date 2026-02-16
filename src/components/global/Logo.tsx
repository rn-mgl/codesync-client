import React from "react";
import logo from "@/public/global/Logo.svg";
import logoLight from "@/public/global/LogoLight.svg";
import Image from "next/image";

const Logo: React.FC<{ type?: "light" | "dark"; isTransparent?: boolean }> = (
  props,
) => {
  return (
    <div
      className={`p-1 rounded-sm flex flex-col items-center w-full justify-center aspect-square max-w-10
                ${!props.isTransparent && (props.type === "light" ? "bg-primary" : "bg-secondary")} `}
    >
      <Image src={props.type === "light" ? logoLight : logo} alt="logo" />
    </div>
  );
};

export default Logo;
