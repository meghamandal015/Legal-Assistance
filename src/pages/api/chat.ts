import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextApiRequest, NextApiResponse } from "next";

const MODEL_NAME = "gemini-1.5-flash-001";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const body = req.body;
      const { question, history } = body;

      const firstPrompt = `
        Consider yourself as 'Genie,' and talk and behave like the actual 'Genie' as much as possible to make the user feel that you are the same character. 
        Basically, you are a personal Indian legal adviser and lawyer to the CEO of a company, having all knowledge of the Indian Legal System and Constitution. 
        You are developed by the 'LEGAL AID-AI TEAM.' Explain things like an extremely experienced legal advisor and answer in a formatted and efficient way, 
        like starting each new pointer with a newline. It’s a must to use emojis in responses to be friendly wherever needed. But always introduce yourself as "Genie."
      `;

      const internalPrompt = `
        Based on the user's question: "${question}", generate an appropriate, well-structured message to show to the user. Also, consider the previous chat to utilize the context. 
        Utilize formatting like **bold text** for emphasizing important data like names and line breaks wherever necessary. Don't generate hypothetical facts about any data values. 
        Be concise and efficient. Avoid asking: "Anything else I can help you with today?"
      `;

      const API_KEY = process.env.GOOGLE_API_KEY || "YOUR_API_KEY";
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });

      const generationConfig = { temperature: 0.9, maxOutputTokens: 8192 };

      const safetySettings = [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      ];

      const truncateHistory = (history: Content[], maxMessages: number = 10): Content[] => {
        return history.length > maxMessages ? history.slice(history.length - maxMessages) : history;
      };

      interface Part {
        text: string;
      }

      interface Content {
        role: "user" | "model";
        parts: Part[];
      }

      const finalHistory: Content[] = [
        {
          role: "user",
          parts: [
            {
              text: firstPrompt,
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "Hello! I am Genie, your friendly legal adviser. Let's resolve your concerns efficiently! ✨⚖️",
            },
          ],
        },
        ...truncateHistory(
          history.map((entry: { user: string; message: string }) => ({
            role: entry.user === "User" ? "user" : "model",
            parts: [{ text: entry.message }],
          }))
        ),
        { role: "user", parts: [{ text: internalPrompt }] },
      ];

      const chat = model.startChat({
        generationConfig,
        history: finalHistory,
        safetySettings,
      });

      const result = await chat.sendMessage(internalPrompt);

      // Exclude the first system-level intro from the sidebar
      const filteredHistoryForSidebar = finalHistory.filter((entry, index) => {
        const isFirstIntroMessage = entry.role === "user" && entry.parts[0].text.includes("Consider yourself as 'Genie'");
        return !isFirstIntroMessage;
      });

      return res.status(200).json({ 
        answer: result.response.text(), 
        displayHistory: filteredHistoryForSidebar // Send only filtered history for sidebar
      });
    } catch (error: any) {
      console.error("Error in /api/chat:", error);

      let errorMessage = "Internal Server Error. Please try again later.";
      if (error.response) {
        errorMessage = `Error: ${error.response.data.error || "Unknown API error"}`;
      } else if (error.request) {
        errorMessage = "Error: Unable to connect to the AI API. Check your network connection.";
      }

      return res.status(500).json({ error: errorMessage });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
