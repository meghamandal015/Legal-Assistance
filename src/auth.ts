import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import prisma from "@/lib/prisma";
import bcryptjs from "bcryptjs";

import { CredentialsSignin } from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: any, req): Promise<any> {
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          throw new CredentialsSignin("Invalid credentials");
        }
      
        if (!user.isEmailVerified) {
          throw new Error("Email is not verified, Please Sign-Up again.");
        }
      
        const isPasswordValid = await bcryptjs.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new CredentialsSignin("Invalid password.");
        }
      
        return user;
      },
    }),
  ],
  pages: {
    signIn: '/auth/sign-in',
  },
  callbacks: {
    async jwt({token, user}) {
      if (user) {
        token.id = user.id as string
        token.email = user.email as string
        token.fullname = user.fullname as string
        token.image = user.image ? user.image as string : undefined
      }
      return token
    },

    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        fullname: token.fullname,
        image: token.image,
      }
      return session
    }
  },
  secret: process.env.AUTH_SECRET,
})