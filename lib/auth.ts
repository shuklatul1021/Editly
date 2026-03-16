import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { accounts, sessions, users, verificationTokens } from "@/db/schema";
import { db, ensureDatabaseSchema } from "@/lib/db";
import { signInSchema } from "@/lib/validations/auth";

const adapter = db
  ? DrizzleAdapter(db, {
      usersTable: users,
      accountsTable: accounts,
      sessionsTable: sessions,
      verificationTokensTable: verificationTokens,
    })
  : undefined;

export const authOptions: NextAuthOptions = {
  adapter,
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/sign-in",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "you@company.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = signInSchema.safeParse(credentials);

        if (!parsedCredentials.success || !db) {
          return null;
        }

        await ensureDatabaseSchema();

        const existingUsers = await db
          .select()
          .from(users)
          .where(eq(users.email, parsedCredentials.data.email))
          .limit(1);

        const user = existingUsers[0];

        if (!user?.password) {
          return null;
        }

        const passwordMatches = await compare(
          parsedCredentials.data.password,
          user.password
        );

        if (!passwordMatches) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      return session;
    },
  },
};
