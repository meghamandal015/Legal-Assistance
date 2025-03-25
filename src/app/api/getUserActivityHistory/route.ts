import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { activityId } = body;

        const activityData = await prisma.userActivity.findUnique({
            where: {
                Activityid: activityId,
            },
            select: {
                Activityid: true,
                pdf_hosted_link: true,
                createdAt: true,
                pdf_name: true,
                pdf_questions: true,
                pdf_answers: true,
                pdf_reasons: true,
                isSummon: true,
                notice_response: true,
            }
        });
        return new Response(
            JSON.stringify({
                data: activityData,
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