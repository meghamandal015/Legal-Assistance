import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { userID } = body;

        const existingData = await prisma.user.findFirst({
            where: {
                id: userID,
            },
            select: {
                pdf_upload_count: true,
                notice_generate_count: true,
            },
        });

        return new Response(
            JSON.stringify({
                data: existingData,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error processing request:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error processing request",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
