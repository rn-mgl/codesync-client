import Action from "@/components/landing/Action";
import Hero from "@/components/landing/Hero";
import Nav from "@/components/landing/Nav";
import Offer from "@/components/landing/Offer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CodeSync",
};

export default function Home() {
  return (
    <div className="h-screen overflow-y-auto flex flex-col items-start justify-start relative  scroll-smooth">
      <Nav />
      <Hero />
      <Offer />
      <Action />
    </div>
  );
}
