import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const { userID, notice } = await request.json();

        const dataId = "CD" + userID;

        const existingCurrentData = await prisma.userCurrentData.findFirst({
            where: {
            DataId: dataId,
            userId: userID
            }
        });

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
            data: { notice_response: notice }
        })

        if (existingCurrentData) {
            const updatedData = await prisma.userCurrentData.update({
            where: { DataId: dataId },
            data: { current_notice: notice }
            });

            return Response.json(
            { success: true, message: 'Reason updated successfully', data: updatedData },
            { status: 200 }
            );
        } else {
            const newData = await prisma.userCurrentData.create({
            data: {
                DataId: dataId,
                userId: userID,
                current_question: "",
                current_answer: "",
                current_notice: notice,
                current_reason: ""
            }
            });
            return Response.json(
            { success: true, message: 'Noitce added successfully', data: newData },
            { status: 201 }
            );
        }
    } catch (error) {
        console.error('Error verifying user:', error);
        return Response.json(
            { success: false, message: 'Error verifying user' },
            { status: 500 }
        );
    }
}