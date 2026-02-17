import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    if (!req.nextauth.token) {
      return NextResponse.rewrite(new URL("/auth/login", req.url));
    }

    const token = req.nextauth.token;

    if (!token.user) {
      return NextResponse.rewrite(new URL("/auth/login", req.url));
    }

    const user = token.user;

    if (!user.id || !user.token) {
      return NextResponse.rewrite(new URL("/auth/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return (
          typeof token === "object" &&
          token !== null &&
          "user" in token &&
          "token" in token.user &&
          "id" in token.user
        );
      },
    },
  },
);

export const config = { matcher: ["/codesync"] };
