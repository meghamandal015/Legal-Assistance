"use client";

import React, { useState, useEffect, useRef, FormEvent } from "react";
import axios from "axios";
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import Navbar from "@/components/Navbar";



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

return (
  <div className="min-h-screen bg-gray-900">
    <div className="fixed top-0 w-full z-50 bg-gradient-to-r from-blue-500 to-blue-600">
      <Navbar />
    </div>
    
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed top-[90px] left-0 bg-gray-800 p-4 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-[200px] h-[calc(100vh)] flex flex-col`}
      >
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
        <div className="flex-grow overflow-y-auto">
          <h3 className="text-white text-md font-semibold mb-2">Recent Prompts</h3>
          {recentPrompts.length > 0 ? (
            <ul className="break-words">
              {recentPrompts.map((prompt, index) => (
                <li key={index} className="flex items-center cursor-pointer mb-2" onClick={() => handlePromptClick(prompt)}>
                  <Image src="/message_icon.png" alt="Message Icon" width={30} height={30} className="mr-2 opacity-100" />
                  <span className="text-white">{prompt}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-white">No recent prompts available</p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-0">
        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-[100px] left-4 z-40 bg-gray-800 p-2 rounded-md"
        >
          <Image src="/menu_icon.png" alt="Menu" width={30} height={30} />
        </button>

        {/* Chat Container */}
        <div className="max-w-4xl mx-auto px-4 pt-[100px]">
          <div
            ref={chatContainerRef}
            className="min-h-[calc(100vh-200px)] max-h-[calc(100vh-200px)] overflow-y-auto"
          >
            {chat.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  msg.user === "User" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg max-w-[80%] ${
                    msg.user === "User"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  <ReactMarkdown>{msg.message}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-3xl px-4"
          >
            <div className="flex gap-2 bg-gray-800 p-2 rounded-lg">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-gray-700 text-white rounded px-4 py-2 focus:outline-none"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                {isLoading ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
);
}