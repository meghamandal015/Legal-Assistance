"use client";

import React from "react";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar"; // Importing Navbar component
import { useSession } from "next-auth/react";
import { handleSignOut } from "../actions/authActions";

interface HistoryItem {
  pdf_upload_count: number;
  notice_generate_count:  number;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [countData, setCountData] = useState<HistoryItem[]>([]);
  const [pdfUploadCount, setPdfUploadCount] = useState<number>(0);
  const [noticeGenerateCount, setNoticeGenerateCount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch('/api/getUploadCount', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userID: session.user.id
          })
        });

        const data = await response.json();
        setCountData(data.data);
        setPdfUploadCount(data.data.pdf_upload_count);
        setNoticeGenerateCount(data.data.notice_generate_count);
      } catch (error) {
        console.error('Failed to fetch history:', error);
      }
    };

    fetchData();
  }, [session]);

  const onSignOut = async () => {
    await handleSignOut();
    window.location.reload();
    window.location.href = "/";
  };

  return (
    <>
    <div className="fixed top-0 w-full z-50">
      <Navbar />
    </div>
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 overflow-hidden">
      {/* Header Section */}
      <div className="w-full bg-[#1e293b] py-8">
        <div className="ml-8">
          <h2 className="text-white text-sm mb-1">Your Profile</h2>
          <h1 className="font-bold text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">
            Profile Details
          </h1>
        </div>
      </div>


      <div className="min-h-[85vh] w-full flex items-start justify-center px-4 sm:px-6 md:px-8 lg:px-10 mt-4 mb-0">
        {/* Card Section */}
        <div
          className="relative w-full max-w-[1100px] mx-auto rounded-none md:rounded-2xl p-4 md:p-6 shadow-input bg-[#1e293b]"
          style={{
            width: "90%", // Makes the card take up 90% of the page width
            maxWidth: "1100px", // Ensures it doesn’t get too wide on large screens
          }}
        >
          <h1 className="font-bold text-lg md:text-xl text-white text-left">Profile Information</h1>

          <div className="text-white mt-4 space-y-2">
            <p><strong>Username:</strong> {session?.user?.fullname || "Guest"} </p>
            <p><strong>Email:</strong> {session?.user?.email || "Guest"} </p>
            <p><strong>Total PDF Uploaded:</strong> {String(session?.user?.pdf_upload_count) || "Guest"} </p>
            <p><strong>Total Responses Generated:</strong> {String(session?.user?.notice_generate_count) || "Guest"}</p>
            <p><strong>Email Verified:</strong> {String(session?.user?.isEmailVerified) || "Guest"} </p>
          </div>

          {/* Sign Out Button */}
          <div className="flex justify-center mt-8">
            <form action={onSignOut}>
                <button
                className="relative inline-flex items-center justify-center p-[0.5rem] mb-[2rem] me-auto ms-auto overflow-hidden text-sm font-medium rounded-lg group 
                    bg-black text-white 
                    focus:ring-[4px] focus:outline-none focus:ring-purple-[800]
                    transition-all duration-[300ms]
                    active:bg-black active:text-white
                    hover:-translate-y-[1px] hover:shadow-lg transform ease-in-out"
                >
                <span className="relative px-[20px] py-[10px] bg-gray-[900] rounded-md">
                    Sign Out
                </span>
                </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </>
  );
}