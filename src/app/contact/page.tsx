"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { useForm } from "react-hook-form";
import emailjs from "emailjs-com";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface EmailJSResponse {
  status: number;
  text: string;
}

const sendMessage = async (data: FormData): Promise<EmailJSResponse> => {
  try {
    const templateParams = {
      from_name: data.name,
      from_email: data.email,
      subject: data.subject,
      message: data.message,
    };

    const response = await emailjs.send(
      "service_0bc9q9a",
      "template_au2y1fs",
      templateParams,
      "G7uOEI5bszdYQugOK"
    );

    return response;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export default function ContactUs() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [globalMessage, setGlobalMessage] = useState("");
  const [globalSuccess, setGlobalSuccess] = useState("none");
  const [isSending, setIsSending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnSubmitData>();

  interface OnSubmitData {
    name: string;
    email: string;
    subject: string;
    message: string;
  }

  const onSubmit = async (data: OnSubmitData): Promise<void> => {
    setIsSending(true);
    try {
      const result = await sendMessage(data);
      if (result.status === 200) {
        setIsSuccess(true);
        setGlobalMessage("Message sent successfully!");
        setGlobalSuccess("true");
      }
    } catch (error) {
      setGlobalSuccess("false");
      toast.error("Failed to send message. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div className="fixed top-0 w-full z-50">
        <Navbar />
      </div>
      <div className="min-h-screen flex-1 flex flex-col bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 overflow-y-auto">
        <div className="w-full bg-[#1e293b] py-8">
          <div className="ml-8">
            <h2 className="text-white text-sm mb-1">Reach out to Us</h2>
            <h1 className="font-bold text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">
              Contact Us
            </h1>
          </div>
        </div>

        <div className="flex-grow flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-10 py-8">
          {!isSuccess ? (
            <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-6 shadow-input bg-[#1e293b]">
              {globalMessage && (
                <p className={`text-${globalSuccess === 'true' ? 'green' : 'red'}-500`}>
                  {globalMessage}
                </p>
              )}
              <h1 className="font-bold text-xl md:text-2xl text-white text-left">
                Send us a message
              </h1>

              <form className="my-8" onSubmit={handleSubmit(onSubmit)}>
                <LabelInputContainer className="mb-4">
                  <label htmlFor="name" className="text-neutral-200 mb-1.5">Your Name</label>
                  <input
                    id="name"
                    placeholder="Enter your name"
                    {...register("name", { required: true })}
                    className="bg-[#334155] text-white w-full p-2 rounded-md"
                  />
                  {errors.name && <p className="text-red-500">This field is required</p>}
                </LabelInputContainer>

                <LabelInputContainer className="mb-4">
                  <label htmlFor="email" className="text-neutral-200 mb-1.5">Your Email</label>
                  <input
                    id="email"
                    placeholder="Ex: abc@gmail.com"
                    type="email"
                    {...register("email", {
                      required: "This field is required",
                      pattern: {
                        value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-.]+$/,
                        message: "Invalid email address",
                      },
                    })}
                    className="bg-[#334155] text-white w-full p-2 rounded-md"
                  />
                  {errors.email?.message && typeof errors.email.message === 'string' && (
                    <p className="text-red-500">{errors.email.message}</p>
                  )}
                </LabelInputContainer>

                <LabelInputContainer className="mb-4">
                  <label htmlFor="subject" className="text-neutral-200 mb-1.5">Subject</label>
                  <input
                    id="subject"
                    placeholder="Subject"
                    {...register("subject", { required: true })}
                    className="bg-[#334155] text-white w-full p-2 rounded-md"
                  />
                  {errors.subject && <p className="text-red-500">This field is required</p>}
                </LabelInputContainer>

                <LabelInputContainer className="mb-4">
                  <label htmlFor="message" className="text-neutral-200 mb-1.5">Your Message</label>
                  <textarea
                    id="message"
                    placeholder="Do you have anything to say?"
                    {...register("message", { required: true })}
                    rows={5}
                    className="bg-[#334155] text-white w-full p-2 rounded-md"
                  />
                  {errors.message && <p className="text-red-500">This field is required</p>}
                </LabelInputContainer>

                <button
                  type="submit"
                  className={`bg-[#20c997] hover:bg-[#17a589] w-full text-white rounded-md h-10 font-medium shadow-lg transition-colors duration-300`}
                  disabled={isSending}
                >
                  {isSending ? 'Sending...' : 'Send →'}
                </button>
              </form>
            </div>
          ) : (
            <h1 className="font-bold text-xl md:text-2xl text-green-500 text-center">
              <strong>Thank you for reaching out!</strong>
            </h1>
          )}
        </div>
        <ToastContainer />
      </div>
    </>
  );
}

const LabelInputContainer: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => {
  return (
    <div className={`flex flex-col w-full ${className}`}>
      {children}
    </div>
  );
};
