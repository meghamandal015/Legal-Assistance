import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("Request Body:", body);

        const { userID } = body;

        const dataId = "CD" + userID;
        console.log("Data ID:", dataId);

        const existingData = await prisma.userCurrentData.findFirst({
            where: {
            DataId: dataId,
            userId: userID
            }
        });

        console.log("Existing Data:", existingData);

        const notice_response = existingData?.current_notice;

        console.log("Notice Response:", notice_response);

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