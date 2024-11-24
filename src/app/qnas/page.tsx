"use client";

import React, { useEffect, useState, ChangeEvent } from 'react';
import Image from 'next/image';
// import { useTypewriter, Cursor } from 'react-simple-typewriter';
// import NoticeReply from './NoticeReply';
import axios from 'axios';
import { set } from 'zod';

import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'


export default function QuestionsPage() {
    const { data: session } = useSession();
    const router = useRouter()

    const [questions, setQuestions] = useState("");
    const [preAnswers, setPreAnswers] = useState("");

    const userID = session ? session.user?.id : "";

    useEffect(() => {
        const initializeData = async () => {
          if (session) {
            const userID = session.user?.id; // Adjust based on how user ID is stored in session
            if (userID) {
                  const response = await fetch('/api/getQnAs', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userID: String(userID) }),
                  });
              
                  const result = await response.json();
                  console.log('Result:', result);
              
                  const { answers, questions } = result;
                  setQuestions(answers);
                  setPreAnswers(questions);
            }
          }
        };
    
        initializeData();
      }, [session]);
    
      console.log('Questions:', questions);
      console.log('PreAnswers:', preAnswers);


    const preAnswersArr = questions ? questions.split('.,') : [];
    const questionsArr = preAnswers ? preAnswers.split('?,') : [];

    const [answers, setAnswers] = useState<string[]>(() =>
        questionsArr.map((_, index) => preAnswers[index] || '')
    );

    const [selectedQuestions, setSelectedQuestions] = useState<boolean[]>(() =>
        questionsArr.map(() => true)
    );
    const [loading, setLoading] = useState(false);
    const [showNoticeReplyPage, setShowNoticeReplyPage] = useState(false);
    const [noticeReply, setNoticeReply] = useState<{ result: string } | null>(null);
    const [selectAll, setSelectAll] = useState(false);
    const [numOfPages, setNumOfPages] = useState(2);

    const handleNumOfPagesChange = (value: string) => {
        const numericValue = parseInt(value, 10);
        setNumOfPages(!isNaN(numericValue) ? Math.max(2, numericValue) : 2);
    };

    const handleSelectionChange = (index: number) => {
        const updatedSelection = [...selectedQuestions];
        updatedSelection[index] = !updatedSelection[index];
        setSelectedQuestions(updatedSelection);
    };

    const handleSelectAll = () => {
        const newSelection = questionsArr.map(() => selectAll);
        setSelectedQuestions(newSelection);
        setSelectAll(!selectAll);
    };

    const handleInputChange = (index: number, value: string) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index] = value;
        setAnswers(updatedAnswers);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const filteredQuestions = questionsArr.filter((_, index) => selectedQuestions[index]);
            const filteredAnswers = answers.filter((_, index) => selectedQuestions[index]);
    
            const response = await axios.post('http://sastelaptop.com:3010/api/fetchQnAs', {
                questions: filteredQuestions,
                answers: filteredAnswers,
            });

            const pageNums = await axios.post('http://sastelaptop.com:3010/api/fetchNumPages', {
                numOfPages,
            });
    
            if (response.status === 200) {
                const noticeResponse = await axios.get('http://sastelaptop.com:3010/api/getNoticeReply');
                if (noticeResponse.status === 200) {
                    const noticeData = noticeResponse.data;

                    console.log('Notice Data:', noticeData);
                    console.log('User ID:', userID);

    
                    const addResponse = await fetch("/api/saveNotice", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ userID: String(userID), notice: String(noticeData) }),
                    });
    
                    if (addResponse.ok) {
                        const responseData = await addResponse.json();
                        console.log('Saved successfully:', responseData);
                        router.push('/notice-response');
                    } else {
                        alert('Failed to save notice reply. Please try again.');
                    }
                } else {
                    alert('Failed to fetch notice reply. Please try again.');
                }
            } else {
                alert('Failed to submit answers. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting answers:', error);
            alert('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };    

    return (
        <>
        {!showNoticeReplyPage ? (
            <div className="max-w-3xl mx-auto">
            {!loading && (
                <div className="flex flex-col items-center mb-8">
                <Image src='/logo.png' alt="Logo" width={120} height={120} className="mb-4" />
                <h3 className="text-xl font-bold text-center text-gray-800">
                    Please Answer the Following Questions for Reply Generation
                </h3>
                </div>
            )}
            {loading ? (
                <LoadingSpinner />
            ) : (
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                    type="button"
                    onClick={handleSelectAll}
                    className="col-span-2 bg-gray-800 text-white py-2 rounded hover:bg-gray-700"
                >
                    {selectAll ? 'Deselect All' : 'Select All'}
                </button>
                
                {questionsArr.map((question, index) => (
                    <div
                    key={index}
                    className={`p-4 border rounded ${
                        selectedQuestions[index] ? 'border-gray-800 bg-white' : 'border-gray-300 bg-gray-100'
                    }`}
                    >
                    <input
                        type="checkbox"
                        checked={selectedQuestions[index]}
                        onChange={() => handleSelectionChange(index)}
                        className="mr-2"
                    />
                    <label className="font-semibold block mb-2">
                        {index + 1}. {question}
                    </label>
                    <textarea
                        value={preAnswersArr[index]}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        rows={3}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                    />
                    </div>
                ))}

                <div className="col-span-2">
                    <label className="font-semibold">Enter No. of Pages</label>
                    <input
                    type="number"
                    value={numOfPages}
                    onChange={(e) => handleNumOfPagesChange(e.target.value)}
                    className="w-full mt-2 p-2 border border-gray-300 rounded focus:outline-none"
                    min={2}
                    />
                </div>

                <button
                    type="button"
                    onClick={handleSubmit}
                    className="col-span-2 bg-gray-800 text-white py-3 rounded hover:bg-gray-700 mt-4"
                >
                    Submit
                </button>
                </form>
            )}
            </div>
        ) : (
            // <NoticeReply noticeReply={noticeReply} />
            <div>
                <h1>Hello Word</h1>
            </div>
        )}
        </>
    );
};

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
