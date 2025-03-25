import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const { userID, questions, answers, combinedText, numOfWords } = await request.json();

        const mostRecentActivity = await prisma.userActivity.findFirst({
            where: {
              userId: userID
            },
            orderBy: {
              Activityid: 'desc'
            }
        });
        const activityId = mostRecentActivity?.Activityid ?? "";


        await prisma.userActivity.update({
            where: { Activityid: activityId },
            data: { pdf_questions: questions, pdf_answers: answers }
        })

        
        await prisma.userCurrentData.update({
            where: {
                DataId: "CD" + userID,
                userId: userID
            },
            data: {
                submitted_data: combinedText,
                num_of_words: numOfWords
            }
        })

        
        return Response.json(
        { success: true, message: 'Questions and Answer added successfully'},
        { status: 201 }
        );
    } catch (error) {
        console.error('Error processing request:', error);
        return Response.json(
            { success: false, message: 'Error processing request' },
            { status: 500 }
        );
    }
}