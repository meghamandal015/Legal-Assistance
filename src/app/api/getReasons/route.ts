import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { userID } = body;
        const dataId = "CD" + userID;

        const existingData = await prisma.userCurrentData.findFirst({
            where: {
                DataId: dataId,
                userId: userID,
            },
        });

        const reasons = existingData?.current_reason || null;

        return new Response(
            JSON.stringify(reasons),
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
