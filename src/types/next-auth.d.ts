import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
    interface User {
        id: string
        fullname: string
        email: string
        image?: string
        isEmailVerified: boolean
        createdAt: Date
        updatedAt: Date
        last_login?: Date
        last_logout?: Date
        pdf_upload_count: number
        notice_generate_count: number
    }
    interface Session {
        user: User
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        fullname: string
        email: string
        image?: string
        isEmailVerified: boolean
        createdAt: Date
        updatedAt: Date
        last_login?: Date
        last_logout?: Date
        pdf_upload_count: number
        notice_generate_count: number
    }
}