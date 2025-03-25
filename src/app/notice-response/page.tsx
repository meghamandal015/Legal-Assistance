"use client"

import { useState, useEffect, useRef } from "react";
import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";


import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function NoticeReply() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [response, setResponse] = useState<string>("");
  
  const [displayedText, setDisplayedText] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editableText, setEditableText] = useState<string>(response);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const [isEdited, setIsEdited] = useState<boolean>(false);

  // const userID = session ? session.user?.id : "";

  useEffect(() => {
    const initializeData = async () => {
      if (session) {
        const userID = session.user?.id;
        if (userID) {
              const response = await fetch('/api/getNotice', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userID: String(userID) }),
              });
          
              const result = await response.json();
          
              // const { getReason } = result;
              
              setResponse(result);
              setDisplayedText(result);
              setEditableText(result);
        }
      }
    };

    initializeData();
  }, [session]);

  const handleSaveNotice = async () => {
    setIsEditing(false);
    if (session && session.user?.id) {
      const userID = session.user.id;
      try {
        const saveResponse = await fetch("/api/saveNotice", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userID, notice: editableText }),
        });
  
        if (saveResponse.ok) {
          setDisplayedText(editableText);
          setIsEdited(false);
          toast.success('Notice saved successfully', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else {
          toast.error('Failed to save notice');
        }
      } catch (error) {
        console.error("Error saving notice:", error);
        toast.error('An error occurred while saving the notice');
      }
    }
  };

  // const handleEditResponse = () => {
  //   if (isEditing) {
  //     setDisplayedText("");
  //   }
  //   setIsEditing(!isEditing);
  //   setIsEdited(true);
  // };
  const handleEditResponse = () => {
    if (isEditing) {
      handleSaveNotice();
    } else {
      setIsEditing(true);
      setIsEdited(true);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableText(e.target.value);
  };

  const handleDownload = async (format: "docx" | "pdf") => {
    if (format === "docx") {
      const doc = new Document({
        sections: [
          {
            children: editableText.split("\n").map((line) => {
              const boldRegex = /\*\*(.*?)\*\*/g;
              let matches;
              const children: TextRun[] = [];
              let lastIndex = 0;

              while ((matches = boldRegex.exec(line)) !== null) {
                if (matches.index > lastIndex) {
                  children.push(
                    new TextRun({
                      text: line.substring(lastIndex, matches.index),
                      font: "Times New Roman",
                      size: 24,
                    })
                  );
                }

                children.push(
                  new TextRun({
                    text: matches[1],
                    bold: true,
                    font: "Times New Roman",
                    size: 24,
                  })
                );
                lastIndex = boldRegex.lastIndex;
              }

              if (lastIndex < line.length) {
                children.push(
                  new TextRun({
                    text: line.substring(lastIndex),
                    font: "Times New Roman",
                    size: 24,
                  })
                );
              }

              return new Paragraph({
                children,
                alignment: AlignmentType.LEFT,
              });
            }),
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, "response.docx");
    } else if (format === "pdf") {
      const doc = new jsPDF();
      doc.setFont("Times", "normal");
      doc.setFontSize(11);

      const lines = doc.splitTextToSize(editableText, 180); // Adjusted width
      let y = 10;

      lines.forEach((line: string) => {
        if (y > 280) {
          doc.addPage();
          y = 10;
        }
        doc.text(line, 10, y);
        y += 6;
      });

      const pdfBlob = doc.output("blob");
      saveAs(pdfBlob, "response.pdf");
    }
  };

  return (
    <>
      <div className="fixed top-0 w-full z-50">
        <Navbar />
      </div>
      <div className="h-screen flex flex-col items-center p-6 bg-transparent">
        <>
          <div className="absolute top-8 right-4 flex gap-4 mt-24">
            <button
              className="cursor-pointer px-4 py-2 bg-[#222] text-white rounded-md font-medium hover:bg-[#333] transition-all duration-[300ms] inline-block"
              onClick={() => handleDownload("docx")}
            >
              Download as Word (.docx)
            </button>
            <button
              className="cursor-pointer px-4 py-2 bg-[#222] text-white rounded-md font-medium hover:bg-[#333] transition-all duration-[300ms] inline-block"
              onClick={() => handleDownload("pdf")}
            >
              Download as PDF (.pdf)
            </button>
          </div>

          <div
            ref={textContainerRef}
            className="mt-24 w-full h-[70%] max-w-4xl p-4 bg-gray-100 border border-gray-300 rounded overflow-y-auto "
          >
            {isEditing ? (
              <textarea
                className="w-full h-full bg-slate-200 text-black resize-none outline-none"
                value={editableText}
                onChange={handleTextChange}
              />
            ) : (
              <textarea
                className="w-full h-full bg-transparent text-black resize-none outline-none"
                value={editableText}
                readOnly
              />
            )}
          </div>

          <div className="mt-4 flex gap-4">
          
            <button
              className="cursor-pointer px-4 py-2 bg-[#222] text-white rounded-md font-medium hover:bg-[#333] transition-all duration-[300ms] inline-block"
              onClick={handleEditResponse}
            >
              {isEditing ? "Save Response" : "Edit Response"}
            </button>
            <button
              className="cursor-pointer px-4 py-2 bg-[#222] text-white rounded-md font-medium hover:bg-[#333] transition-all duration-[300ms] inline-block"
              onClick={() => router.push("/")}
            >
              Re-Upload
            </button>
          </div>
        </>
        <ToastContainer />
    </div>
    </>
  );
};