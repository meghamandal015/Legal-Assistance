"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";


export default function QuestionsPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [questions, setQuestions] = useState<string>("");
  const [preAnswers, setPreAnswers] = useState<string>("");
  const [answers, setAnswers] = useState<string[]>([""]);
  const [selectedQuestions, setSelectedQuestions] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(true);
  const [numOfPages, setNumOfPages] = useState<number>(2);

  const userID = session?.user?.id || "";


  // Fetch Questions and Answers
  useEffect(() => {
    const initializeData = async () => {
      if (userID) {
        try {
          const response = await fetch("/api/getQnAs", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userID }),
          });

          if (!response.ok) throw new Error("Failed to fetch QnAs.");

          const result = await response.json();

          const { answers: fetchedAnswers, questions: fetchedQuestions } = result;
          setQuestions(fetchedQuestions || "");
          setPreAnswers(fetchedAnswers || "");
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    initializeData();
  }, [userID]);

  useEffect(() => {
    const questionsArr = questions ? questions.split("?,") : [];
    const preAnswersArr = preAnswers ? preAnswers.split(".,") : [];
    
    if (questionsArr.length) {
      // Initialize with empty strings for all questions
      const initialAnswers = Array(questionsArr.length).fill("");
      
      // Fill in existing answers where available
      preAnswersArr.forEach((answer, index) => {
        if (index < initialAnswers.length) {
          initialAnswers[index] = answer;
        }
      });
      
      setAnswers(initialAnswers);
      setSelectedQuestions(questionsArr.map(() => true));
    }
  }, [questions, preAnswers]);


  // Handle No. of Pages Change
  const handleNumOfPagesChange = (value: string) => {
    const numericValue = parseInt(value, 10);
    
    // Allow empty string and validate only if value is not empty
    if (value === "") {
      setNumOfPages(2);
    } else if (!isNaN(numericValue) && numericValue >= 2) {
      setNumOfPages(numericValue);
    } else {
      setNumOfPages(2); // Reset to 2 if invalid input
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // Prevent the default form submission behavior on Enter key press
      e.preventDefault();
    }
  };
  
  // Handle Individual Selection
  const handleSelectionChange = (index: number) => {
    const updatedSelection = [...selectedQuestions];
    updatedSelection[index] = !updatedSelection[index];
    setSelectedQuestions(updatedSelection);
  };


  // Handle Select All / Deselect All
  const handleSelectAll = () => {
    const newSelection = answers.map(() => !selectAll);
    setSelectedQuestions(newSelection);
    setSelectAll(!selectAll);
  };


  // Handle Input Change
  const handleInputChange = (index: number, value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };


  // Handle Submit
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const questionsArr = questions.split("?,");

      const filteredQuestions = questionsArr
      .filter((_, index) => selectedQuestions[index])
      .map((q, index, arr) => index === arr.length - 1 ? q.trim() : q.trim() + "");
  
      const filteredAnswers = answers
      .filter((_, index) => selectedQuestions[index])
      .map((a, index, arr) => index === arr.length - 1 ? a.trim() : a.trim() + "");
  
      if (!filteredQuestions.length) {
        alert("No questions selected!");
        setLoading(false);
        return;
      }

      // Ensure lengths match by filling missing answers with empty strings
      while (filteredAnswers.length < filteredQuestions.length) {
        filteredAnswers.push("");
      }

      const combinedString = filteredQuestions
        .map((question, index) => `Question: ${question}\nAnswer: ${filteredAnswers[index]}`)
        .join("\n\n");

      const updatedNumOfPages = numOfPages * 375; 
      // console.log("Num of Pages: ", updatedNumOfPages);

      await fetch("/api/save-selected-qnas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userID: String(userID),
          questions: String(filteredQuestions),
          answers: String(filteredAnswers),
          combinedText: String(combinedString),
          numOfWords: String(updatedNumOfPages),
        }),
      });
      
      // Processing Notice Response
      const today = new Date();
      const currentDate = today.toISOString().split('T')[0];

      const response = await fetch("/api/generate-notice-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: String(userID), currentDate: String(currentDate) }),
      });

      if(!response.ok) {
        setLoading(false);
        alert("Failed to generate notice response, please try again.");
      } else {
        router.push("/notice-response");
      }
    } catch (error) {
      console.error("Error Generating Response:", error);
      alert("An error occurred. Please try again later.");
      setLoading(false);
    }
  };

  const questionsArr = questions ? questions.split("?,") : [];

  return (
    <>
      <div className="fixed top-0 w-full z-50">
        <Navbar />
      </div>
    <div className="max-w-6xl mx-auto px-4 py-0">
      {!loading && (
        <div className="flex flex-col items-center mb-8 mt-20">
          <h3 className="text-xl font-bold text-center text-gray-800 px-4">
            Please Answer the Following Questions for Reply Generation
          </h3>
        </div>
      )}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <form className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-20">
          <div className="lg:col-span-2 flex justify-start">
            <button
              type="button"
              onClick={handleSelectAll}
              className="w-40 cursor-pointer px-4 py-2 bg-[#222] text-white rounded-md font-medium hover:bg-[#333] transition-all duration-[300ms]"
            >
              {selectAll ? "Deselect All" : "Select All"}
            </button>
          </div>
  
          {questionsArr.map((question, index) => (
            <div
              key={index}
              className={`p-4 border rounded ${
                selectedQuestions[index]
                  ? "border-gray-800 bg-white"
                  : "border-gray-300 bg-gray-100"
              }`}
            >
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={selectedQuestions[index]}
                  onChange={() => handleSelectionChange(index)}
                  className="mt-1.5"
                />
                <label className="font-semibold block mb-2 flex-1 text-sm md:text-base">
                  {index + 1}. {question}
                </label>
              </div>
              <textarea
                value={answers[index] || ""}
                onChange={(e) => handleInputChange(index, e.target.value)}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500 mt-2"
              />
            </div>
          ))}
  
          <div className="lg:col-span-2 flex justify-start">
            <div className="w-64">
              <label className="font-semibold block">Enter No. of Pages</label>
              <input
                type="number"
                value={numOfPages}
                onFocus={(e) => e.target.select()}
                onBlur={(e) => handleNumOfPagesChange(e.target.value)}
                onChange={(e) => setNumOfPages(parseInt(e.target.value, 10))}
                onKeyDown={(e) => handleKeyDown(e)}  // Prevent form submit on Enter
                className="w-full mt-2 p-2 border border-gray-300 rounded focus:outline-none"
              />
            </div>
          </div>
  
          <button
            type="button"
            onClick={handleSubmit}
            className="lg:col-span-2 cursor-pointer px-4 py-2 bg-[#222] text-white rounded-md font-medium hover:bg-[#333] transition-all duration-[300ms]"
          >
            Submit
          </button>
        </form>
      )}
    </div>
    </>
  );
}

const LoadingSpinner: React.FC = () => {
  const words = ['Just a moment, we are generating the best reply!',
    'Loading... great things take time!',
    'Hang tight, almost there!',
    'Preparing something awesome for you!',
    'Your next experience is just a moment away!',
    'Almost there, innovation in the works!',
    'Loading magic… please stand by!',
    'Just a moment, we are preparing something special!',
    'Don’t blink, awesomeness is coming!'];
    const [text, setText] = useState('');
    const [wordIndex, setWordIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
  
    useEffect(() => {
      const currentWord = words[wordIndex];
      const interval = setInterval(() => {
        setText((prevText) => prevText + currentWord[charIndex]);
        setCharIndex((prevIndex) => prevIndex + 1);
      }, 100);
  
      if (charIndex === currentWord.length) {
        clearInterval(interval);
        setTimeout(() => {
          setText('');
          setCharIndex(0);
          setWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        }, 1000);
      }
  
      return () => clearInterval(interval);
    }, [charIndex, wordIndex]);
  
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {text}
        </h2>
        <Image src='/loading.gif' alt="Loading..." width={100} height={100} />
      </div>
    );
};