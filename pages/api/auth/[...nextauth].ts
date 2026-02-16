import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider<{ credentials: Record<string, string> }>({
      name: "Credentials",
      credentials: {
        credentials: {
          token: "",
          id: "",
        },
      },
      async authorize(data) {
        try {
          if (!data?.credentials) return false;
          const credentials = JSON.parse(data.credentials);
          return credentials;
        } catch (error) {
          console.log(error);
          return false;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (
        user &&
        "token" in user &&
        typeof user.token === "string" &&
        typeof user.id === "number"
      ) {
        token.user = { token: user.token, id: user.id };
      }

      return token;
    },

    async session({ session, token }) {
      if (token && "user" in token && typeof token.user === "object") {
        session.user = token.user;
      }

      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
    signOut: "/",
    error: "/auth/login",
  },

  secret: process.env.AUTH_SECRET,
};

export default NextAuth(authOptions);
