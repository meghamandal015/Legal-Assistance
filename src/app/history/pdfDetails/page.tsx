"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useSearchParams, useRouter } from "next/navigation";
import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";

interface ActivityData {
  Activityid: string;
  pdf_hosted_link: string;
  pdf_name: string;
  pdf_questions: string[] | "";
  pdf_answers: string[] | "";
  pdf_reasons: string[] | "";
  isSummon: boolean;
  notice_response: string | "";
  createdAt: string;
}

export default function PdfDetailsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const noticeName = searchParams.get("name");
  const activityId = searchParams.get("activityId");
  const [activityData, setActivityData] = useState<ActivityData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authenticatedUrl, setAuthenticatedUrl] = useState<string | null>(null);

  const handleDownload = async (format: "docx" | "pdf") => {
    if (!activityData?.notice_response) return;

    if (format === "docx") {
      const doc = new Document({
        sections: [
          {
            children: activityData.notice_response.split("\n").map((line) => {
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

      const lines = doc.splitTextToSize(activityData.notice_response, 180);
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

  const generateAuthenticatedUrl = async (pdfLink: string) => {
    try {
      const response = await fetch('/api/getPdfUrl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfLink })
      });
      const data = await response.json();
      if (data.url) {
        setAuthenticatedUrl(data.url);
      }
    } catch (error) {
      console.error('Error generating authenticated URL:', error);
    }
  };

  const fetchActivityData = async () => {
    if (!activityId) return;
    try {
      const response = await fetch('/api/getUserActivityHistory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activityId })
      });
      const result = await response.json();
      const transformedData = result && result.data ? {
        ...result.data,
        pdf_questions: typeof result.data.pdf_questions === 'string' ? [result.data.pdf_questions] : result.data.pdf_questions || [""],
        pdf_answers: typeof result.data.pdf_answers === 'string' ? [result.data.pdf_answers] : result.data.pdf_answers || [""],
        pdf_reasons: typeof result.data.pdf_reasons === 'string' ? [result.data.pdf_reasons] : result.data.pdf_reasons || [""]
      } : {};
      setActivityData(transformedData);
      if (transformedData?.pdf_hosted_link) {
        await generateAuthenticatedUrl(transformedData.pdf_hosted_link);
      }
    } catch (error) {
      console.error('Error fetching activity data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityData();
    const refreshInterval = setInterval(() => {
      if (activityData?.pdf_hosted_link) {
        generateAuthenticatedUrl(activityData.pdf_hosted_link);
      }
    }, 45 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, [activityId]);

  return (
    <>
      <div className="fixed top-0 w-full z-50">
        <Navbar />
      </div>
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 overflow-hidden">
        <div className="w-full bg-[#1e293b] py-8">
        <div className="ml-8">
          <h2 className="text-white text-sm mb-1">Your History</h2>
          <h1 className="font-bold text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">
            {noticeName ? `${noticeName} Details` : "Notice Details"}
          </h1>
        </div>
        </div>
        {isLoading ? (
          <div className="mt-8 text-center">Loading...</div>
        ) : (
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row gap-6 mb-6">
              <div className="lg:w-1/2">
                <div className="bg-gray-300 rounded-md shadow-lg p-6">
                  <h2 className="text-center text-xl font-semibold mb-4">
                    PDF Preview
                  </h2>
                  <div className="w-full border-[4px] border-dotted p-4 bg-white rounded-md" style={{ height: "400px" }}>
                    {authenticatedUrl ? (
                      <iframe src={authenticatedUrl} className="w-full h-full" title="PDF Preview" />
                    ) : (
                      <p className="text-red-500 font-medium text-center">
                        PDF preview not available
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="bg-gray-300 rounded-md shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
                  {activityData && (
                    <div className="space-y-6">
                      {activityData.isSummon ? (
                        Array.isArray(activityData.pdf_reasons) && (
                          <div>
                            <h4 className="font-medium mb-4">Reasons:</h4>
                            <div className="space-y-4">
                              {activityData.pdf_reasons?.[0].split('.,')
                                .filter(q => q.trim())
                                .map((reason, i) => (
                                  <div key={i} className="pl-4">
                                    <p className="font-medium text-gray-700">{`${reason.trim()}.`}</p>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )
                      ) : (
                        <>
                          <div className="mb-8">
                            <h4 className="font-medium mb-4">Questions:</h4>
                            <div className="space-y-4">
                              {activityData.pdf_questions?.[0].split('?,')
                                .filter(q => q.trim())
                                .map((question, i) => (
                                  <div key={i} className="pl-4">
                                    <p className="font-medium text-gray-700">{`${i + 1}. ${question.trim()}?`}</p>
                                  </div>
                                ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-4">Answers:</h4>
                            <div className="space-y-4">
                              {activityData.pdf_answers?.[0].split('.,')
                                .filter(a => a.trim())
                                .map((answer, i) => (
                                  <div key={i} className="pl-4">
                                    <p className="font-medium text-gray-700">{`${i + 1}. ${answer.trim()}.`}</p>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Notice Response Box */}
            <div className="w-full max-w-4xl mx-auto mt-8 mb-20">
              <div className="bg-gray-300 rounded-md shadow-lg p-6 relative">
                <h3 className="text-lg font-semibold mb-4">Saved Notice Response</h3>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    className="px-3 py-1.5 bg-[#222] text-white rounded-lg font-medium hover:bg-[#333] transition-all duration-[300ms]"
                    onClick={() => handleDownload("docx")}
                  >
                    Download as Word (.docx)
                  </button>
                  <button
                    className="px-3 py-1.5 bg-[#222] text-white rounded-lg font-medium hover:bg-[#333] transition-all duration-[300ms]"
                    onClick={() => handleDownload("pdf")}
                  >
                    Download as PDF (.pdf)
                  </button>
                </div>
                <div
                  className="w-full h-[400px] p-4 bg-gray-100 border border-gray-300 rounded overflow-y-auto mt-2"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} // For Firefox and IE
                >
                  <style>
                    {`
                      .no-scrollbar::-webkit-scrollbar {
                        display: none; /* For Chrome, Safari, and Opera */
                      }
                    `}
                  </style>
                  <textarea
                    className="w-full h-full bg-transparent text-black resize-none outline-none"
                    value={activityData?.notice_response || ''}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={() => router.push("/history")}
          className="cursor-pointer px-5 py-2 bg-[#222] text-white rounded-lg font-medium hover:bg-[#333] transition-all duration-[300ms] fixed bottom-5 right-5"
        >
          Back to History
        </button>
      </div>
    </>
  );
}