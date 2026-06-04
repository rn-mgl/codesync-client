import "next-auth";
import "next-auth/jwt";

interface User {
  token: string;
  id: number;
  name: string;
  image: string | null;
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
