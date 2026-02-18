import { FaBars, FaXmark } from "react-icons/fa6";
import Logo from "../Logo";
import React from "react";
import Link from "next/link";

const SideNav: React.FC<{
  showSideNav: boolean;
  handleShowSideNav: () => void;
}> = (props) => {
  return (
    <div
      className={`h-full flex-row items-start justify-start fixed top-0 left-0 overflow-hidden
               l-s:max-w-(--breakpoint-m-s) l-s:static transition-all animate-fade z-50 p-1  gap-1
               ${props.showSideNav ? "flex w-full t:backdrop-blur-md l-s:backdrop-blur-[0px]" : "hidden l-s:flex l-s:w-18"}`}
    >
      <div className="w-full h-full flex flex-col items-start justify-start t:w-1/2 l-s:w-full gap-1">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-primary rounded-md">
          <button
            onClick={props.handleShowSideNav}
            className="p-2 rounded-full bg-inherit transition-all"
          >
            <FaXmark className="text-secondary l-s:hidden" />
            <FaBars className="text-secondary hidden l-s:flex" />
          </button>

          <Link
            href="/codesync"
            className={`w-8 min-w-8 transition-all ${props.showSideNav ? "flex" : "hidden"}`}
          >
            <Logo type="light" isTransparent={true} />
          </Link>
        </div>
        <div className="w-full h-full bg-primary rounded-md"></div>
      </div>

      {/* tablet cover */}
      {props.showSideNav ? (
        <div
          className="hidden t:flex l-s:hidden w-1/2 bg-linear-to-b from-primary/80 to-primary h-full 
                    z-50 rounded-md transition-all animate-fade"
        />
      ) : null}
    </div>
  );
};

export default SideNav;
