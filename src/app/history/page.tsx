"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface HistoryItem {
  Activityid: string;
  createdAt: string;
  pdf_name: string;
}

export default function HistoryPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!session?.user?.id) 
        {
          setIsLoading(false);
          return;
        }

      try {
        const response = await fetch('/api/getUserHistory', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userID: session.user.id
          })
        });

        const data = await response.json();
        setHistoryData(data.data);
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [session]);

  const handleRedirect = (pdfName: string, activityId: string) => {
    router.push(`/history/pdfDetails?name=${encodeURIComponent(pdfName)}&activityId=${encodeURIComponent(activityId)}`);
  };

  return (
    <>
      <div className="fixed top-0 w-full z-50">
        <Navbar />
      </div>
      {/* <div className="bg-gray-100 min-h-screen"> */}
        {/* <div className="w-full bg-black py-8">
          <div className="ml-8">
            <h2 className="text-white text-sm mb-1">Your History</h2>
            <h1 className="font-bold text-3xl md:text-4xl text-white">
              Notice History
            </h1>
          </div>
        </div> */}
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 overflow-hidden">
        <div className="w-full bg-[#1e293b] py-8">
        <div className="ml-8">
          <h2 className="text-white text-sm mb-1">Your History</h2>
          <h1 className="font-bold text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">
            Notice History
          </h1>
        </div>
        </div>

        <div className="min-h-[85vh] w-full flex items-start justify-center px-4 mt-4 mb-0">
          <div
            className="relative w-full max-w-[1100px] mx-auto rounded-md md:rounded-lg p-6 shadow-md bg-gray-300"
            style={{
              width: "90%",
              maxWidth: "1100px",
            }}
          >
            <div className="space-y-4 overflow-y-auto max-h-[400px]">
              {isLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : historyData.length === 0 ? (
                <div className="text-center py-4">No history found</div>
              ) : (
                historyData.map((item) => {
                  const date = new Date(item.createdAt);
                  return (
                    <button
                      key={item.Activityid}
                      onClick={() => handleRedirect(item.pdf_name, item.Activityid)}
                      className="w-full flex flex-col items-start p-4 bg-gray-200 hover:bg-gray-300 rounded-md shadow-md transition-all duration-200"
                    >
                      <p className="text-lg font-semibold">{item.pdf_name}</p>
                      <p className="text-sm text-gray-600">
                        {date.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })} at {date.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })}
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}