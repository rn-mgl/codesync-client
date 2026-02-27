import Navigation from "@/src/components/layout/navigation/Navigation";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Dashboard | CodeSync",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Navigation>
      <div className="w-full h-full bg-secondary rounded-md p-4 border border-neutral-300 t:p-8">
        {children}
      </div>
    </Navigation>
  );
}
