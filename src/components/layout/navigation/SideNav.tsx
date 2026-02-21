"use client";
import { FaBars, FaXmark } from "react-icons/fa6";
import Logo from "@/components/global/Logo";
import React, { Activity } from "react";
import Link from "next/link";
import { BASE_NAVIGATIONS } from "@/src/configs/navigation.config";
import { usePathname } from "next/navigation";

const SideNav: React.FC<{
  showSideNav: boolean;
  handleShowSideNav: (source?: "link" | "button") => void;
}> = (props) => {
  const path = usePathname();

  const mappedNavigations = BASE_NAVIGATIONS.map((nav) => {
    const isSelected = path === nav.url;

    return (
      <Link
        key={nav.name}
        href={nav.url}
        onClick={() => props.handleShowSideNav("link")}
        className={`w-full p-4 rounded-md min-w-14 min-h-14
                    transition-all flex flex-row items-center gap-4 
                    ${props.showSideNav ? "justify-start" : "justify-center"} 
                    ${
                      isSelected
                        ? "bg-secondary text-primary font-bold hover:brightness-125"
                        : "text-secondary bg-primary hover:bg-neutral-800"
                    }`}
      >
        <nav.icon />

        <Activity mode={props.showSideNav ? "visible" : "hidden"}>
          <span className="animate-fade">{nav.name}</span>
        </Activity>
      </Link>
    );
  });

  return (
    <div
      className={`h-full flex-row items-start justify-start fixed top-0 left-0 overflow-hidden
               l-s:max-w-(--breakpoint-m-s) l-s:static animate-fade p-1 gap-1
               ${props.showSideNav ? "flex w-full t:backdrop-blur-md l-s:backdrop-blur-[0px]" : "hidden l-s:flex l-s:w-20"}`}
    >
      <div className="w-full h-full flex flex-col items-start justify-start t:w-1/2 l-s:w-full gap-1">
        <div
          className={`w-full flex flex-row items-center transition-all p-4 bg-primary rounded-md ${props.showSideNav ? "justify-between" : "justify-center"}`}
        >
          <button
            onClick={() => props.handleShowSideNav("button")}
            className="p-2 rounded-full bg-inherit transition-all"
          >
            <FaXmark className="text-secondary l-s:hidden" />
            <FaBars className="text-secondary hidden l-s:flex" />
          </button>

          <Activity mode={props.showSideNav ? "visible" : "hidden"}>
            <Link
              href="/codesync"
              className="w-8 min-w-8 transition-all flex animate-fade"
            >
              <Logo type="light" isTransparent={true} />
            </Link>
          </Activity>
        </div>

        <div className="w-full h-full bg-primary rounded-md flex flex-col items-start justify-start p-2 gap-2">
          {mappedNavigations}
        </div>
      </div>

      {/* tablet cover */}
      <Activity mode={props.showSideNav ? "visible" : "hidden"}>
        <div
          className="hidden t:flex l-s:hidden w-1/2 bg-linear-to-b from-primary/80 to-primary h-full 
                    z-50 rounded-md transition-all animate-fade"
        />
      </Activity>
    </div>
  );
};

export default SideNav;
