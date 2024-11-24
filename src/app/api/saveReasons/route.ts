import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const { userID, reasons } = await request.json();
        console.log('User ID:', userID);
        console.log('Reasons:', reasons);

        const dataId = "CD" + userID;
        console.log('Data ID:', dataId);

        const existingCurrentData = await prisma.userCurrentData.findFirst({
            where: {
            DataId: dataId,
            userId: userID
            }
        });

        const existingUserData = await prisma.user.findFirst({
            where: {
            id: userID
            }
        });
        
        const pdfUploadCount = existingUserData?.pdf_upload_count ?? 0;

        if (existingCurrentData) {
            const updatedData = await prisma.userCurrentData.update({
            where: { DataId: dataId },
            data: { current_reason: reasons }
            });

            await prisma.user.update({
                where: { id: userID },
                data: { pdf_upload_count: pdfUploadCount + 1 }
            });

            return Response.json(
            { success: true, message: 'Reason updated successfully', data: updatedData },
            { status: 200 }
            );
        } else {
            // If the data does not exist, create a new record
            const newData = await prisma.userCurrentData.create({
            data: {
                DataId: dataId,
                userId: userID,
                current_question: "",
                current_answer: "",
                current_notice: "",
                current_reason: reasons
            }
            });
            return Response.json(
            { success: true, message: 'Reason added successfully', data: newData },
            { status: 201 }
            );
        }
    } catch (error) {
        console.log('Error verifying user:', error);
        console.error('Error verifying user:', error);
        return Response.json(
            { success: false, message: 'Error verifying user' },
            { status: 500 }
        );
    }
  }