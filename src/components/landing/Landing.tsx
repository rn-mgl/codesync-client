"use client";

import React from "react";
import Action from "@/src/components/landing/Action";
import Hero from "@/src/components/landing/Hero";
import Nav from "@/src/components/landing/Nav";
import Offer from "@/src/components/landing/Offer";

const Landing = () => {
  const [hideNav, setHideNav] = React.useState(false);

  const homeRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const scrollable = homeRef.current;

    if (!scrollable) return;

    const handle = (e: WheelEvent) => {
      setHideNav(e.deltaY > 0); // hide if scrolling down
    };

    scrollable.addEventListener("wheel", handle);

    return () => {
      scrollable.removeEventListener("wheel", handle);
    };
  }, []);

  return (
    <div
      ref={homeRef}
      className="h-screen overflow-y-auto flex flex-col items-start justify-start relative scroll-smooth"
    >
      <Nav hide={hideNav} />
      <Hero />
      <Offer />
      <Action />
    </div>
  );
};

export default Landing;
