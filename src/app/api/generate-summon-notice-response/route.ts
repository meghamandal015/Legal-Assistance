import prisma from "@/lib/prisma";
import Anthropic from '@anthropic-ai/sdk';


// Helper function to generate the notice response
async function claudeSummon(
    selectedReason: string,
    extraText: string,
    noticeText: string,
    currentDate: string,
    pagesNum: string
  ): Promise<string> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not set');
    }
  
    const anthropic = new Anthropic({
      apiKey: apiKey,
    });
  
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 4096,
      system: "Consider yourself as a qualified legal professional, and an expert in responding to legal notices.",
      messages: [
        {
          role: "user",
          content: `Analyze this legal notice provided and generate an appropriate, properly formatted reply for the notice: 
            ${noticeText}.
            
            Please ensure the following aspects are covered while generating the reply:
            - Analyze the content of the legal notice thoroughly to understand the subject matter and the details of both the sender and receiver.
            - Address the key facts and legal points mentioned in the notice to ensure an accurate, clear, and legally sound response.
            - Ensure the reply is formally structured and well-organized, paying special attention to formatting and tone.
            - The response must be of ${pagesNum} words, so accordingly elongate the response without adding any irrelevant things. 
            - Include relevant sections of the law in the reply if necessary to support the response.
            - Use the current date for the letter: ${currentDate}.
            - The addresses for both sender and receiver should be clearly structured in several lines, as is typical in formal letters.
            - At the end, ensure the signature and designation are on separate lines for clarity.
          
            Additional Formatting Guidelines:
            - The reply should have a formal letterhead, with the date placed in the correct position.
            - Add proper salutation and sign-off sections.
            - Ensure that legal terminology and references to the appropriate sections of the law are correctly used.
              
            Must consider the following additional information and extra text carefully while generating the reply:
            Additional Information: ${selectedReason}
            Extra Text: ${extraText}
  
            The final document should be legally sound and focus on the key issues raised in the legal notice. It should also reflect the subject matter accurately, including any defenses or proposals for resolution, while keeping a professional and respectful tone. There should be no additional statements or comments from you after the conclusion of the notice reply.`
        }
      ],
    });
  
    const content = response.content[0];
    if (typeof content === 'object' && 'text' in content) {
        return content.text;
    } else if (typeof content === 'string') {
        return content;
    } else {
        return JSON.stringify(content);
    }
}


// POST METHOD
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { userID, selectedReason, extraText, currentDate } = body;

        const dataId = "CD" + userID;

        const combinedText = `${selectedReason}., Additional Information: ${extraText}`

        const existingData = await prisma.userCurrentData.findUnique({
            where: {
                DataId: dataId,
                userId: userID,
            },
        });

        const noticeText = existingData?.notice_text || "";
        const numOfWords = existingData?.num_of_words || "";

        const response = await claudeSummon(selectedReason, extraText, noticeText, currentDate, numOfWords)


        // To Update the user's current data with the notice response
        await prisma.userCurrentData.update({
            where: {
                DataId: dataId,
            },
            data: {
                current_notice: response,
            },
        })


        // To Update the user's activity data with the notice response
        const userRecentActivity = await prisma.userActivity.findFirst({
            where: {
              userId: userID,
            },
            orderBy: {
              createdAt: 'desc',
            },
        });

        if(userRecentActivity){
            await prisma.userActivity.update({
                where: {
                    Activityid: userRecentActivity.Activityid,
                },
                data: {
                    isSummon: true,
                    pdf_reasons: combinedText,
                    notice_response: response
                }
            })
        }


        // To Update the user's response generated count
        const userData = await prisma.user.findUnique({
            where: {
                id: userID,
            },
        });

        if (userData) {
            await prisma.user.update({
                where: {
                    id: userID,
                },
                data: {
                    notice_generate_count: userData.notice_generate_count + 1
                }
            });
        }
        
        return new Response(
            JSON.stringify("Notice response generated successfully"),
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
