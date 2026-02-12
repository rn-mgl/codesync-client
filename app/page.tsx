import Action from "@/components/landing/Action";
import Hero from "@/components/landing/Hero";
import Offer from "@/components/landing/Offer";

export default function Home() {
  return (
    <div className="h-full flex flex-col items-start justify-start">
      <Hero />
      <Offer />
      <Action />
    </div>
  );
}
