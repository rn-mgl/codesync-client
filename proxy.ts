import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";
import { canAccessAction } from "./src/configs/access.config";

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

    const segments = req.nextUrl.pathname.split("/");
    const lastSegment = segments.at(-1);

    console.log(segments);

    if (lastSegment === "create" || lastSegment === "edit") {
      const isCreate = lastSegment === "create";
      const action = isCreate ? "create" : "update";
      const recordType = isCreate ? segments.at(-2) : segments.at(-3);

      const hasAccess = canAccessAction(
        user.permissions ?? [],
        recordType ?? "",
        action,
      );

      if (!hasAccess) {
        const returnUrl = segments
          .slice(0, segments.length - (isCreate ? 1 : 2))
          .join("/");

        return NextResponse.rewrite(new URL(returnUrl || "/codesync", req.url));
      }
    } else {
      const recordType = segments[2];

      if (!recordType) {
        return NextResponse.next();
      }

      const hasAccess = canAccessAction(
        user.permissions ?? [],
        recordType ?? "",
        "read",
      );

      if (!hasAccess) {
        return NextResponse.rewrite(new URL("/codesync", req.url));
      }
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

export const config = { matcher: ["/codesync/:path*"] };
