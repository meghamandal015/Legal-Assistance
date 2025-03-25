import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import prisma from "@/lib/prisma";
import bcryptjs from "bcryptjs";

import { CredentialsSignin } from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: any): Promise<any> {
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
        token.isEmailVerified = user.isEmailVerified as boolean
        token.createdAt = user.createdAt as Date
        token.updatedAt = user.updatedAt as Date
        token.last_login = user.last_login ? user.last_login as Date : undefined
        token.last_logout = user.last_logout ? user.last_logout as Date : undefined
        token.pdf_upload_count = user.pdf_upload_count as number
        token.notice_generate_count = user.notice_generate_count as number
        token.emailVerified = user.isEmailVerified ? new Date() : null
      }
      return token
    },

    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        fullname: token.fullname,
        image: token.image,
        isEmailVerified: token.isEmailVerified,
        createdAt: token.createdAt,
        updatedAt: token.updatedAt,
        last_login: token.last_login,
        last_logout: token.last_logout,
        pdf_upload_count: token.pdf_upload_count,
        notice_generate_count: token.notice_generate_count,
        emailVerified: token.isEmailVerified ? new Date() : null

      }
      return session
    }
  },
  secret: process.env.AUTH_SECRET,
})

