"use client";

import { useState, DragEvent, ChangeEvent } from "react";
import axios from "axios";
import Image from "next/image";
import GlobalMessage from "@/components/GlobalMessage";
import Navbar from "@/components/Navbar";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function Home() {
  // For Session Management
  const { data: session } = useSession();
  const router = useRouter();
  
  // For File Upload
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [fileURL, setFileURL] = useState<string | null>(null);
  const [isUploadSuccessful, setIsUploadSuccessful] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSummon, setIsSummon] = useState(false);
  const [isContinue, setIsContinue] = useState(false);


  // For Error Handling
  const [globalMessage, setGlobalMessage] = useState("");
  const [globalSuccess, setGlobalSuccess] = useState("none");


  // Handling drag over
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };


  // Handling drag leave
  const handleDragLeave = () => {
    setIsDragging(false);
  };


  // Handling file drop
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      setFileURL(URL.createObjectURL(droppedFile));
    } else {
      alert("Please upload only PDF files.");
    }
  };


  // Handling file change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setFileURL(URL.createObjectURL(selectedFile));
    } else {
      alert("Please select a valid PDF file.");
    }
  };


  // Uploading and saving the file
  const handleUpload = async () => {

    if (!file) {
      alert("No file selected.");
      return;
    }

    const userId = session ? session.user?.id : "";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId || "");

    setIsUploading(true);

    try {
      // Uploading to Backend and processing to get required information ok

      const response = await axios.post(
        "/api/uploadPdf-python",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // const response = await axios.post(
      //   "http://sastelaptop.com:3010/api/uploadGooglePdf",
      //   formData,
      //   {
      //     headers: { "Content-Type": "multipart/form-data" },
      //   }
      // );

      // console.log("Done")

      const summon = response.data.isSummon;
      

      // Uploading to GCP Cloud Storage Bucket
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("userId", userId || "");
      uploadFormData.append("isSummon", summon);

      await axios.post(
        "/api/uploadNoticePDF",
        uploadFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const result = await fetch("/api/process-uploaded-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: String(userId) }),
      });
      
      if (result.ok) {
        const data = await result.json(); 
        if (data && typeof data.isSummon !== "undefined") {
          setIsSummon(data.isSummon);
          // console.log("isSummon:", data.isSummon);
        } else {
          console.error("isSummon not found in response:", data);
        }
      } else {
        console.error("Failed to process uploaded PDF:", result.statusText);
      }

      setUploadStatus("File uploaded successfully!");
      setIsUploadSuccessful(true);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("Failed to upload file.");
      setIsUploadSuccessful(false);
      setGlobalMessage("Failed to upload file. Please try again.");
      setGlobalSuccess("false");
    } finally {
      setIsUploading(false);
    }
  };


  // Resetting the file upload
  const handleReupload = () => {
    setFile(null);
    setFileURL(null);
    setUploadStatus(null);
    setIsUploadSuccessful(false);
    setIsSummon(false);
  };


  // Continue to next page
  const handleContinue = async () => {
    setIsContinue(true);
    if(isSummon === true) {
      router.push("/summon-reasons");
    } else {
      router.push("/qnas");
    }
  };

  return (
    <>
      <div className="fixed top-0 w-full z-50">
        <Navbar />
      </div>
      {isContinue && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gray-700 border-solid"></div>
        </div>
      )}
      <div className="flex flex-col items-center justify-center px-6 min-h-screen pt-0">
        {globalMessage && (
          <GlobalMessage success={globalSuccess} message={globalMessage} onReset={() => setGlobalSuccess("none")} />
        )}
        <div className="mb-6">
          <Image src="/logo.png" alt="Logo" width={100} height={100} />
        </div>
        <div
          className={`w-full max-w-lg border-[4px] border-dashed p-6 text-center transition-all ${
            isDragging ? "border-black" : "border-gray-700"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {file ? (
            <div>
              {fileURL && (
                <object
                  data={fileURL}
                  type="application/pdf"
                  className="w-full h-64"
                >
                  <p>Preview not available</p>
                </object>
              )}
              <p className="mt-4 text-sm">{file.name}</p>
              {!isUploading && !isUploadSuccessful && (
                <div className="mt-4 flex justify-center space-x-4">
                  <button
                    onClick={handleReupload}
                    className="cursor-pointer px-4 py-2 mt-4 bg-[#222] text-white rounded-md font-medium hover:bg-[#333] transition-all duration-[300ms] inline-block"
                  >
                    Remove File
                  </button>
                  <button
                    onClick={handleUpload}
                    className="cursor-pointer px-4 py-2 mt-4 bg-[#222] text-white rounded-md font-medium hover:bg-[#333] transition-all duration-[300ms] inline-block"                  >
                    Upload
                  </button>
                </div>
              )}
              {isUploading && (
                <div className="flex justify-center items-center mt-4 space-x-2">
                  <div className="w-4 h-4 bg-gray-800 rounded-full animate-bounce"
                  style={{ backgroundColor: "#333333" }}></div>

                  <div className="w-4 h-4 bg-gray-800 rounded-full animate-bounce delay-150"
                  style={{ backgroundColor: "#333333" }}></div>

                  <div className="w-4 h-4 bg-gray-800 rounded-full animate-bounce delay-300"
                  style={{ backgroundColor: "#333333" }}></div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Image
                src="/drag&drop.png"
                alt="Drag and Drop"
                width={125}
                height={125}
              />
              <h3 className="text-lg mt-4">Drag and Drop to Upload</h3>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                id="fileInput"
                onChange={handleFileChange}
              />
              <label
                htmlFor="fileInput"
                className="cursor-pointer px-4 py-2 mt-4 bg-[#222] text-white rounded-md font-medium hover:bg-[#333] transition-all duration-[300ms] inline-block"
              >
                Choose a file
              </label>
            </div>
          )}
          {uploadStatus && <p className="mt-4 text-black">{uploadStatus}</p>}
        </div>

        {isUploadSuccessful && (
          <div className="mt-2 flex space-x-4">
            <button
              onClick={handleReupload}
              className="cursor-pointer px-4 py-2 mt-4 bg-[#222] text-white rounded-md font-medium hover:bg-[#333] transition-all duration-[300ms] inline-block"
            >
              Re-upload
            </button>
            <button
              onClick={handleContinue}
              className="cursor-pointer px-4 py-2 mt-4 bg-[#222] text-white rounded-md font-medium hover:bg-[#333] transition-all duration-[300ms] inline-block"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </>
  );
}