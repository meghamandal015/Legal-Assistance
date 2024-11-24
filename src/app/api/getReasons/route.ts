import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("Request Body:", body);

        const { userID } = body;
        const dataId = "CD" + userID;
        console.log("Data ID:", dataId);

        // Query the database to get the current reason
        const existingData = await prisma.userCurrentData.findFirst({
            where: {
                DataId: dataId,
                userId: userID,
            },
        });

        console.log("Existing Data:", existingData); // Debugging

        // Extract the reason from the response or set it to null if not found
        const reasons = existingData?.current_reason || null;
        console.log("Reasons:", reasons); // Debugging

        // Return only the reasons
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
