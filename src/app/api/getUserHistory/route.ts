import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { userID } = body;

        const historyData = await prisma.userActivity.findMany({
            where: {
                userId: userID,
            },
            select: {
                Activityid: true,
                createdAt: true,
                pdf_name: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        
        return new Response(
            JSON.stringify({
                data: historyData,
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