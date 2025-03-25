import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { userID } = body;

        const dataId = "CD" + userID;

        const existingData = await prisma.userCurrentData.findFirst({
            where: {
            DataId: dataId,
            userId: userID
            }
        });


        const notice_response = existingData?.current_notice;

        return new Response(
            JSON.stringify(notice_response),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error('Error processing request:', error);
        return Response.json(
            { success: false, message: 'Error processing request' },
            { status: 500 }
        );
    }
}