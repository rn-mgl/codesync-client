"use client";

import React from "react";
import HeadNav from "./HeadNav";
import SideNav from "./SideNav";

const Navigation = ({ children }: { children: React.ReactNode }) => {
  const [showSideNav, setShowSideNav] = React.useState(false);

  const handleShowSideNav = (source?: "link" | "button") => {
    setShowSideNav((prev) => {
      if (source === "link") {
        return window.innerWidth >= 1024 ? prev : !prev; // maintain current nav state on laptop view and above
      } else {
        return !prev;
      }
    });
  };

  return (
    <div className="w-full flex flex-row items-start justify-start h-full min-h-full">
      <SideNav
        handleShowSideNav={handleShowSideNav}
        showSideNav={showSideNav}
      />
      <div className="w-full h-full flex flex-col items-start justify-start flex-1 z-0 p-1 l-s:pl-0 gap-1">
        <HeadNav
          handleShowSideNav={() => handleShowSideNav("button")}
          showSideNav={showSideNav}
        />
        {children}
      </div>
    </div>
  );
};

export default Navigation;
