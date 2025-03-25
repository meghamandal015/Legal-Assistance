import prisma from "@/lib/prisma";
import Anthropic from '@anthropic-ai/sdk';

// interface AnthropicResponse {
//     content: string | { text: string }[]; // Adjust based on the actual API response structure
// }

interface AnthropicResponse {
    content: Array<{ type: string; text: string }>;
}

async function isSummonNotice(
    noticeText: string,
):  Promise<string> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not set');
    }
    
    const anthropic = new Anthropic({
        apiKey: apiKey,
    });
    
    const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 500,
        system: "Consider yourself as a qualified legal professional, and an expert in responding to legal notices.",
    messages: [
      {
        role: "user",
        content: `Analyze this legal notice: ${noticeText} and determine whether it is a summon notice from a court or not. Return 'true' if it is a summon notice, and 'false' if it is not. Provide no additional information.`
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


async function getSummonNoticeReasons(noticeText: string): Promise<string[]> {
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
                content: `Analyze the given summon notice carefully: ${noticeText}.
                and generate a list of the top 10 valid, polite justifications to respond efficiently to the notice. Each reason should address the specific date and requirements mentioned in the notice.

                Instructions:
                - Understand the context of the notice, such as official/legal inquiry, personal appearance requests, or document submissions.
                - Extract the appearance date and purpose of the summon from the notice (e.g., giving evidence, producing documents) and use them in generating the justifications.
                - Provide realistic and polite reasons appropriate for official communication (e.g., emergencies, scheduling conflicts, legal counsel requirements).
                Offer solutions where applicable, such as requesting a virtual appearance, sending a representative, or rescheduling.

                Constraints:
                Use first-person tone (starting with "I").
                Ensure professionalism and respectfulness in the tone.
                Avoid vague excuses; focus on realistic scenarios (e.g., emergencies, travel commitments).
                Output exactly 10 reasons, formatted as individual sentences.

                Output Format:
                Return the result containing 10 string elements, with no additional text or explanations before or after the list.
            `
            }
        ]
    }) as AnthropicResponse;

    const responseData = response.content;
    let reasonsArray: string[] = [];

    if (Array.isArray(responseData) && responseData[0]?.type === 'text') {
        const rawText = responseData[0].text; 
        reasonsArray = rawText
            .split('\n') 
            .map(line => line.trim())
            .filter(line => line !== "");
    }

    return reasonsArray;
}


async function getNoticeQuestions(noticeText: string): Promise<string[]> {
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
        system: "Consider yourself as a qualified legal professional. Generate necesaary questions related to provided notice which are required to generate the response of notice.",
        messages: [
            {
                role: "user",
                content: `Analyze this legal notice: ${noticeText}. 
             Now list only the relevant questions you require (if any) to generate an appropriate reply for the notice. Ensure there is no supporting introductory text or conclusion. The questions should not be numbered, each question should start in a new line, end with a question mark, and there should be only 1 to 3 questions. If more questions are necessary, combine them to stay within the range.
             The questions should be relevant and necessary to generate the notice reply. Also add a last 4th question that is: 'Please enter any relevant details you want to be considered while generating the notice reply.`
            }
        ]
    }) as AnthropicResponse;

    const responseData = response.content;
    let responseArray: string[] = [];

    if (Array.isArray(responseData) && responseData[0]?.type === 'text') {
        const rawText = responseData[0].text; 
        responseArray = rawText
            .split('\n') 
            .map(line => line.trim()) 
            .filter(line => line !== ""); 
    }
    return responseArray;
}



async function getNoticeAnswers(noticeText: string, finalQuestions: string): Promise<string[]> {
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
        system: "Consider yourself as a qualified legal professional. Generate necesaary questions related to provided notice which are required to generate the response of notice.",
        messages: [
            {
                role: "user",
                content: `Analyze the provided legal notice thoroughly and generate clear, accurate, and legally sound answers for each of the questions listed below, which are necessary to formulate a proper reply to the notice:

            Legal Notice Text:
            ${noticeText}

            Questions:
            ${finalQuestions}

            Instructions for Answer Generation:

            - Carefully review the content of the legal notice to fully understand the subject matter.
            - Ensure that the key facts and legal arguments raised in the notice are addressed and reflected in the answers. Keeping the answers short and to the point.
            - Provide concise, well-structured, and legally appropriate responses to each question to ensure the answers form a solid foundation for drafting a reply to the notice.

            Necessary Formatting Guidelines:
            - List only the answers of all 3 questions. No extra introduction, or supporting line to be there with answers, also ensure that no questions should be returned with answers.
            - Do not provide an answer for the final 4th question: "Please enter any relevant details you want to be considered while generating the notice reply."
            - The answers should not be numbered, and each answer should start on a new line.`
            }
        ]
    }) as AnthropicResponse;

    const responseData = response.content;
    let responseArray: string[] = [];

    if (Array.isArray(responseData) && responseData[0]?.type === 'text') {
        const rawText = responseData[0].text; 
        responseArray = rawText
            .split('\n') 
            .map(line => line.trim()) 
            .filter(line => line !== ""); 
    }
    return responseArray;
}

 
// POST METHOD
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { userID } = body;


        // To get the user's current data and notice text
        const userCurrentData = await prisma.userCurrentData.findUnique({
            where: {
                DataId: "CD" + userID,
                userId: userID,
            },
        });


        // To check if the notice is summon or not
        const isSummon = await isSummonNotice(userCurrentData?.notice_text || "");

        console.log("Is Summon:", isSummon);
        if(isSummon === 'true' || isSummon === 'True') {

            const summonNoticeReasons = await getSummonNoticeReasons(userCurrentData?.notice_text || "") as string | string[];

            let cleanedReasons: string[] = [];
            if (Array.isArray(summonNoticeReasons)) {
                cleanedReasons = summonNoticeReasons.filter(reason => reason.trim() !== "");
            }

            const finalReasons = cleanedReasons
            .map((reason, index) => (index === cleanedReasons.length - 1 ? reason : `${reason}.,`))
            .join(" ");
            await prisma.userCurrentData.update({
                where: {
                    DataId: "CD" + userID,
                    userId: userID,
                },
                data: {
                    current_reason: finalReasons
                }
            });
        } else {

            const noticeQuestions = await getNoticeQuestions(userCurrentData?.notice_text || "") as string | string[];

            // console.log("Notice Questions:", noticeQuestions);
            let cleanedQuestions: string[] = [];
            if (Array.isArray(noticeQuestions)) {
                cleanedQuestions = noticeQuestions.filter(question => question.trim() !== "");
            }
            const finalQuestions = cleanedQuestions
            .map((question, index) => (index === cleanedQuestions.length - 1 ? question : `${question}?,`))
            .join(" ");


            const noticeAnswers = await getNoticeAnswers(userCurrentData?.notice_text || "", finalQuestions) as string | string[];

            // console.log("Notice Answers:", noticeAnswers);
            let cleanedAnswers: string[] = [];

            if (Array.isArray(noticeAnswers)) {
                cleanedAnswers = noticeAnswers.filter(answer => answer.trim() !== "");
            }
            const finalAnswers = cleanedAnswers
            .map((answer, index) => (index === cleanedAnswers.length - 1 ? answer : `${answer}.,`))
            .join(" ");
            
            // console.log("Final Questions String:", finalQuestions);
            // console.log("Final Answers String:", finalAnswers);

            await prisma.userCurrentData.update({
                where: {
                    DataId: "CD" + userID,
                    userId: userID,
                },
                data: {
                    current_question: finalQuestions,
                    current_answer: finalAnswers
                }
            })
        }


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
                    pdf_upload_count: userData.pdf_upload_count + 1
                }
            });
        }
        

        return new Response(
            JSON.stringify({
                success: true,
                message: "Notice processed successfully",
                isSummon: isSummon.toLowerCase() === 'true', // Returns true or false explicitly
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
