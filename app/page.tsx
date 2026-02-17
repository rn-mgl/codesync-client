"use client";

import React from "react";
import Action from "@/components/landing/Action";
import Hero from "@/components/landing/Hero";
import Nav from "@/components/landing/Nav";
import Offer from "@/components/landing/Offer";

export default function Home() {
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
    <>
      <title>CodeSync</title>
      <div
        ref={homeRef}
        className="h-screen overflow-y-auto flex flex-col items-start justify-start relative scroll-smooth"
      >
        <Nav hide={hideNav} />
        <Hero />
        <Offer />
        <Action />
      </div>
    </>
  );
}
