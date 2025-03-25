"use server";

import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth";


import prisma from "@/lib/prisma";
import bcryptjs from "bcryptjs";

async function generateNewUserId() {
    try {
        const latestUser = await prisma.user.findFirst({
            orderBy: {
                createdAt: 'desc',
            },
        });

        let newUserId: string;

        if (latestUser) {
            const latestId = latestUser.id;
            const currentYear = new Date().getFullYear().toString().slice(-2);
            const prefix = latestId.slice(0, 2);
            const lastDigits = parseInt(latestId.slice(-2));

            const incrementedId = (lastDigits + 1).toString().padStart(2, '0');
            newUserId = `${prefix}${currentYear}${incrementedId}`;
        } else {
            const currentYear = new Date().getFullYear().toString().slice(-2);
            newUserId = `NR${currentYear}01`;
        }

        return newUserId;
    } catch (error) {
        console.error('Error generating user ID:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}


export async function handleCredentialsSignIn({ email, password }: {
    email: string,
    password: string,
}): Promise<AuthError | undefined> {
    try {
        await signIn("credentials", {email, password, redirect: false});
    } catch (error) {
        if(error instanceof AuthError) {
            switch(error.type) {
                case 'CredentialsSignin':
                    return {
                        type: error.type,
                        name: error.name,
                        message: "Invalid email or password."
                    }
                case 'CallbackRouteError':
                    return {
                        type: error.type,
                        name: error.name,
                        message: "Email is not verified. Please Sign-Up again."
                    }
                default:
                    return {
                        type: error.type,
                        name: error.name,
                        message: error.message
                    }
            }
        }
        throw error;
    }
}

export async function handleSignOut() {
    await signOut({ redirect: false });
}

export async function handleCredentialsSignUp({ fullname, email, password, confirmPassword, verifyCode, verifyCodeExpiry}: {
    fullname: string,
    email: string,
    password: string,
    confirmPassword: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
}) {
    try {
        if (!fullname || !email || !password || !verifyCode || !verifyCodeExpiry) {
            return { success: false, message: "All fields are required." };
        }

        const existingUserByEmail = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        const id = await generateNewUserId();


        if (existingUserByEmail) {
            if(existingUserByEmail.isEmailVerified) {
                return { success: false, message: "Email already in use. Please sign in." };
            } else {
                const hashedPassword = await bcryptjs.hash(password, 10);
                await prisma.user.update({
                    where: {
                        email,
                    },
                    data: {
                        fullname,
                        password: hashedPassword,
                        emailVerifyCode: verifyCode,
                        verifyCodeExpiry,
                    },
                });
            }
        } else {
            const hashedPassword = await bcryptjs.hash(password, 10);
            await prisma.user.create({
                data: {
                    id,
                    email,
                    password: hashedPassword,
                    fullname,
                    emailVerifyCode: verifyCode,
                    verifyCodeExpiry,
                },
            });
        }

        return { success: true, message: "Account created successfully." };
    } catch (error) {
        console.error("Error creating account:", error);
        return { success: false, message: "An unexpected error occurred. Please try again." };
    }
}

export async function handelResendVerficationCode({ email, verifyCode, verifyCodeExpiry }: {
    email: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
}) {
    try {
        const existingUserByEmail = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!existingUserByEmail) {
            return { success: false, message: "Email not found." };
        }

        if (existingUserByEmail.isEmailVerified) {
            return { success: false, message: "Email already verified." };
        }

        await prisma.user.update({
            where: {
                email,
            },
            data: {
                emailVerifyCode: verifyCode,
                verifyCodeExpiry,
            },
        });

        return { success: true, message: "Verification code resent." };
    } catch (error) {
        console.error("Error resending verification code:", error);
        return { success: false, message: "An unexpected error occurred. Please try again."};
    }
}