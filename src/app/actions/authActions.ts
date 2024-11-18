"use server";

import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth";
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';

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
            const latestId = latestUser.id; // e.g., "NR2401"
            const currentYear = new Date().getFullYear().toString().slice(-2); // Get last 2 digits of current year
            const prefix = latestId.slice(0, 2); // Extract prefix (e.g., "NR")
            const lastDigits = parseInt(latestId.slice(-2)); // Get last 2 digits as number

            // Increment last two digits
            const incrementedId = (lastDigits + 1).toString().padStart(2, '0'); // Ensure it is 2 digits
            newUserId = `${prefix}${currentYear}${incrementedId}`; // Construct new ID
        } else {
            // If no users exist, create a default ID
            const currentYear = new Date().getFullYear().toString().slice(-2);
            newUserId = `NR${currentYear}01`; // Start with NR and current year
        }

        return newUserId;
    } catch (error) {
        console.error('Error generating user ID:', error);
        throw error; // Rethrow or handle error as needed
    } finally {
        await prisma.$disconnect();
    }
}

// // Example usage
// generateNewUserId()
//     .then(newId => console.log('Generated New User ID:', newId))
//     .catch(error => console.error('Error:', error));

export async function handleCredentialsSignIn({ email, password }: {
    email: string,
    password: string,
}): Promise<AuthError | undefined> {
    try {
        await signIn("credentials", {email, password, redirectTo: "/"});
    } catch (error) {
        if(error instanceof AuthError) {
            switch(error.type) {
                case 'CredentialsSignin':
                    return {
                        type: error.type,
                        name: error.name,
                        message: 'Incorrect email or password'
                    }
                case 'CallbackRouteError':
                    return {
                        type: error.type,
                        name: error.name,
                        message: 'Email is not verified, Please Sign-Up again.'
                    }
                default:
                    return {
                        type: error.type,
                        name: error.name,
                        message: 'An unknown error occurred, please try again later'
                    }
            }
        }
        throw error;
    }
}

export async function handleSignOut() {
    await signOut();
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
        console.log("Email: ", email);
        console.log("Password", password);
        console.log("Fullname", fullname);
        console.log("VerifyCode", verifyCode);
        console.log("VerifyCodeExpiry", verifyCodeExpiry);
        console.log("confirmPassword", confirmPassword);


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


        // if (existingUserByEmail) {
        //     if(existingUserByEmail.isEmailVerified) {
        //         return { success: false, message: "Email already in use. Please sign in." };
        //     } else {
        //         await prisma.user.delete({
        //             where: {
        //                 email,
        //             },
        //         });
        //     }
        // }

        // let id = await generateNewUserId();

        // // const hashedPassword = await bcryptjs.hash(password, 10);
        // // console.log("Hashed Password: ", hashedPassword);
        // await prisma.user.create({
        //     data: {
        //         id,
        //         email,
        //         password,
        //         fullname,
        //         emailVerifyCode: verifyCode,
        //         verifyCodeExpiry,
        //     },
        // // });

        // const emailResponse = await sendVerificationEmail(
        //     email,
        //     fullname,
        //     verifyCode
        // );
        // if (!emailResponse.success) {
        //     console.error("Error sending email:", emailResponse.message);
        //     return { success: false, message: emailResponse.message}
        // }

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

        const emailResponse = await sendVerificationEmail(
            email,
            existingUserByEmail.fullname,
            verifyCode
        );
        if (!emailResponse.success) {
            console.error("Error sending email:", emailResponse.message);
            return { success: false, message: emailResponse.message}
        }

        return { success: true, message: "Verification code resent." };
    } catch (error) {
        console.error("Error resending verification code:", error);
        return { success: false, message: "An unexpected error occurred. Please try again."};
    }
}