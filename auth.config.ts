import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { UserRole } from "./types/auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
  providers: [
    Credentials({}), 
  ],
} satisfies NextAuthConfig;