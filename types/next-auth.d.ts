import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

interface User {
  token: string;
  id: number;
}

declare module "next-auth" {
  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: User;
  }
}
