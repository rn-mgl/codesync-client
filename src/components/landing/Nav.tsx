import Link from "next/link";
import React from "react";
import Logo from "@/components/global/Logo";

const Nav = () => {
  return (
    <div className="w-full fixed top-0 p-4 backdrop-blur-lg z-50 flex flex-col items-center justify-center bg-primary/50 t:p-8">
      <div className="w-full flex flex-row items-center max-w-(--breakpoint-l-s) gap-4 text-xs t:text-sm *:text-secondary">
        <Link className="p-1 max-w-8 t:max-w-10" href="#hero">
          <Logo type="dark" />
        </Link>
        <Link className="p-1" href="#offer">
          Offers
        </Link>
        <Link className="p-1" href="#action">
          Action
        </Link>

        <Link
          href="/auth/login"
          className="ml-auto border p-1 px-2 rounded-sm hover:bg-secondary hover:text-primary transition-all"
        >
          Log In
        </Link>
      </div>
    </div>
  );
};

export default Nav;
