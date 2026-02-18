"use client";

import React from "react";
import HeadNav from "./HeadNav";
import SideNav from "./SideNav";

const Navigation = ({ children }: { children: React.ReactNode }) => {
  const [showSideNav, setShowSideNav] = React.useState(false);

  const handleShowSideNav = () => {
    setShowSideNav((prev) => !prev);
  };

  return (
    <div className="w-full flex flex-row items-start justify-start h-full min-h-full">
      <SideNav
        handleShowSideNav={handleShowSideNav}
        showSideNav={showSideNav}
      />
      <div className="w-full h-full flex flex-col items-start justify-start flex-1 z-0 p-1 l-s:pl-0 gap-1">
        <HeadNav
          handleShowSideNav={handleShowSideNav}
          showSideNav={showSideNav}
        />
        {children}
      </div>
    </div>
  );
};

export default Navigation;
