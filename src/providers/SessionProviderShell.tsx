"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

const SessionProviderShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider refetchOnWindowFocus={false}>{children}</SessionProvider>
  );
};

export default SessionProviderShell;
