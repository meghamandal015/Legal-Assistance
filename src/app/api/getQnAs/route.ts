import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const { userID } = await request.json();

        const dataId = "CD" + userID;

        const existingData = await prisma.userCurrentData.findFirst({
            where: {
            DataId: dataId,
            userId: userID
            }
        });

        const questions = existingData?.current_question;
        const answers = existingData?.current_answer;

        return new Response(
            JSON.stringify({questions, answers}),
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