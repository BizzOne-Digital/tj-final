import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectMongoose } from "@/lib/db/mongoose";
import { AdminUser } from "@/models/AdminUser";
import { isAuthConfigured, isDatabaseConfigured } from "@/lib/env";
import type { AdminRole } from "@/types/roles";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!isDatabaseConfigured() || !isAuthConfigured()) {
          return null;
        }
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        await connectMongoose();
        const user = await AdminUser.findOne({
          email: parsed.data.email.toLowerCase(),
          active: true,
        });
        if (!user) return null;

        const valid = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash,
        );
        if (!valid) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role as AdminRole,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: AdminRole }).role;
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as AdminRole) ?? "editor";
      }
      return session;
    },
  },
});
