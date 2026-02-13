import React from "react";
import logo from "@/public/global/Logo.svg";
import logoLight from "@/public/global/LogoLight.svg";
import Image from "next/image";

const Logo: React.FC<{ type: "light" | "dark" }> = (props) => {
  return (
    <div
      className={`p-1 rounded-sm flex flex-col items-center w-full justify-center ${props.type === "light" ? "bg-primary" : "bg-secondary"} aspect-square max-w-10`}
    >
      <Image src={props.type === "light" ? logoLight : logo} alt="logo" />
    </div>
  );
};

export default Logo;
