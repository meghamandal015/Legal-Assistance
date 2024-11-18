"use client";

import React, { useState, useEffect, useRef, FormEvent } from "react";
import axios from "axios";
import ReactMarkdown from 'react-markdown';
import Image from 'next/image'; // For using images from public folder
import { set } from "zod";

interface ChatMessage {
  user: string;
  message: string;
}
export default function Chat() {
  const [input, setInput] = useState<string>("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [recentPrompts, setRecentPrompts] = useState<string[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setChat((prevChat) => [...prevChat, { user: "User", message: input }]);
    setRecentPrompts((prevPrompts) => [...prevPrompts, input]);
    setIsLoading(true);
    setInput("");
    try {
      const response = await axios.post("/api/chat", { question: input, history: chat });
      setChat((prevChat) => [
        ...prevChat,
        { user: "Bot", message: response.data.answer },
      ]);
    } catch (error) {
      setChat((prevChat) => [
        ...prevChat,
        { user: "Bot", message: "Error: Unable to fetch response." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setChat([]);
    setInput("");
    setSidebarOpen(false);
    setRecentPrompts([]);
  };

  const handlePromptClick = async (prompt: string) => {
    setInput(prompt);
    setChat((prevChat) => [...prevChat, { user: "User", message: prompt }]);
    setRecentPrompts((prevPrompts) => [...prevPrompts, prompt]);
    setIsLoading(true);

    try {
      const response = await axios.post("/api/chat", { question: input, history: chat });
      setChat((prevChat) => [
        ...prevChat,
        { user: "Bot", message: response.data.answer },
      ]);
    } catch (error) {
      setChat((prevChat) => [
        ...prevChat,
        { user: "Bot", message: "Error: Unable to fetch response." },
      ]);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

//   return (
//     <div className="flex min-h-screen bg-gray-900 text-white">
//       {/* Sidebar */}
//       <div
//         className={`fixed top-[90px] left-0 bg-gray-800 p-4 pt-6 transition-transform ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         }
//           w-[200px] h-[calc(100vh)]`} // Sidebar height adjusted to fit within viewport
//       >
//         <button
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//           className="text-white mb-4"
//         >
//           <Image src="/menu_icon.png" alt="Menu" width={36} height={36} />
//         </button>
  
//         <button
//           onClick={handleNewChat}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 flex items-center"
//         >
//           <Image
//             src="/plus_icon.png"
//             alt="New Chat"
//             width={24}
//             height={24}
//             className="mr-2"
//           />
//           New Chat
//         </button>
  
//         <h3 className="text-md font-semibold mb-2">Recent Prompts</h3>
//         {recentPrompts.length > 0 ? (
//           <ul className="break-words">
//             {recentPrompts.map((prompt, index) => (
//               <li key={index} className="flex items-center cursor-pointer mb-2" onClick={() => handlePromptClick(prompt)}>
//                 <Image src="/message_icon.png" alt="Message Icon" width={30} height={30} className="mr-2 opacity-100" />
//                 <span className="text-blue-500">{prompt}</span>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No recent prompts available</p>
//         )}
//       </div>
  
//       {/* Main Chat Area */}
//       <div className="flex flex-col items-center pb-4 pt-[calc(70px + 50px)] justify-between flex-1">
//       {/* Toggle Sidebar Button */}
//       {!sidebarOpen && ( // Only show this button when sidebar is closed
//         <button
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//           className="fixed top-[110px] left-4 z-10"
//         >
//           <Image src="/menu_icon.png" alt="Menu" width={36} height={36} />
//         </button>
//       )}
  
//         {/* Chat Container */}
//         <div
//           ref={chatContainerRef}
//           className="flex flex-col w-full max-w-3xl p-4 overflow-y-auto mb-16"
//           style={{ minHeight: 'calc(100vh - 150px)', maxHeight: 'calc(100vh - 150px)' }}
//         >
//           {chat.map((chatItem, index) => (
//             <div
//               key={index}
//               className={`chat-message ${
//                 chatItem.user === "User"
//                   ? "self-end bg-blue-500 text-white"
//                   : "self-start bg-gray-700 text-white"
//               } p-3 rounded mb-2 w-fit max-w-[75%]`}
//             >
//               <ReactMarkdown>{chatItem.message}</ReactMarkdown>
//             </div>
//           ))}
//         </div>
  
//         {/* User Input Form */}
//         <form
//           onSubmit={handleSubmit}
//           className="fixed bottom-0 w-full max-w-3xl bg-gray-800 p-3 mb-5 flex border border-gray-600 rounded z-20"
//         >
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Ask a question..."
//             className="flex-grow p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
//             required
//             disabled={isLoading}
//           />
//           <button
//             type="submit"
//             className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition ${
//               isLoading ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//             disabled={isLoading}
//           >
//             {isLoading ? "Sending..." : "Send"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

return (
  <div className="flex min-h-screen bg-gray-900 text-white">
    {/* Sidebar */}
    <div
      className={`fixed top-[90px] left-0 bg-gray-800 p-4 transition-transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } w-[200px] h-[calc(100vh)] flex flex-col`} // Sidebar height adjusted to fit within viewport
    >
      {/* Fixed Section (Menu icon and New Chat button) */}
      <div className="flex-shrink-0">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white mb-4"
        >
          <Image src="/menu_icon.png" alt="Menu" width={36} height={36} />
        </button>

        <button
          onClick={handleNewChat}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 flex items-center"
        >
          <Image
            src="/plus_icon.png"
            alt="New Chat"
            width={24}
            height={24}
            className="mr-2"
          />
          New Chat
        </button>
      </div>

      {/* Scrollable Section (Recent Prompts) */}
      <div className="flex-grow overflow-y-auto">
        <h3 className="text-md font-semibold mb-2">Recent Prompts</h3>
        {recentPrompts.length > 0 ? (
          <ul className="break-words">
            {recentPrompts.map((prompt, index) => (
              <li key={index} className="flex items-center cursor-pointer mb-2" onClick={() => handlePromptClick(prompt)}>
                <Image src="/message_icon.png" alt="Message Icon" width={30} height={30} className="mr-2 opacity-100" />
                <span className="text-blue-500">{prompt}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent prompts available</p>
        )}
      </div>
    </div>

    {/* Main Chat Area */}
    <div className="flex flex-col items-center pb-4 pt-[calc(70px + 50px)] justify-between flex-1">
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-[110px] left-4 z-10"
        >
          <Image src="/menu_icon.png" alt="Menu" width={36} height={36} />
        </button>
      )}

      {/* Chat Container */}
      <div
        ref={chatContainerRef}
        className="flex flex-col w-full max-w-3xl p-4 overflow-y-auto mb-16"
        style={{ minHeight: 'calc(100vh - 150px)', maxHeight: 'calc(100vh - 150px)' }}
      >
        {chat.map((chatItem, index) => (
          <div
            key={index}
            className={`chat-message ${
              chatItem.user === "User"
                ? "self-end bg-blue-500 text-white"
                : "self-start bg-gray-700 text-white"
            } p-3 rounded mb-2 w-fit max-w-[75%]`}
          >
            <ReactMarkdown>{chatItem.message}</ReactMarkdown>
          </div>
        ))}
      </div>

      {/* User Input Form */}
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 w-full max-w-3xl bg-gray-800 p-3 mb-5 flex border border-gray-600 rounded z-20"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="flex-grow p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
          required
          disabled={isLoading}
        />
        <button
          type="submit"
          className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  </div>
);

}