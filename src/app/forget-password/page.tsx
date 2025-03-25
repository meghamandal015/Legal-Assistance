"use client";
import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import GlobalMessage from "@/components/GlobalMessage";
import OTPVerification from "@/components/OTPVerification"

import Navbar from "@/components/Navbar";

import emailjs from "emailjs-com";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const sendOTPEmail = async ({ email, otp }: { email: string; otp: string }) => {
  try {
    const templateParams = {
      from_name: "LEGALAID-AI",
      to_email: email,
      subject: "Password Reset OTP",
      message: `Your OTP code for password reset is: ${otp}
      This code is valid for the next 15 minutes.`,
    };

    const response = await emailjs.send(
      "service_0bc9q9a",
      "template_7qsg7kc",
      templateParams,
      "G7uOEI5bszdYQugOK"
    );
    return response;

  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

export default function ForgotPasswordForm() {
  const [globalMessage, setGlobalMessage] = useState("");
  const [globalSuccess, setGlobalSuccess] = useState("none");
  const [isSuccess, setSuccess] = useState(false);
  const [sendEmail, setSendEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    try {
      setSendEmail(values.email);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const verifyCodeExpiry = new Date(Date.now() + 15 * 60 * 1000);

      const response = await fetch("/api/resend-verifyCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email, verifyCode: otp, verifyCodeExpiry }),
    });

      console.log(response);

      // const result = await sendOTPEmail({
      //   email: values.email,
      //   otp: otp,
      // });

      if (response.ok) {
        const result = await sendOTPEmail({
          email: values.email,
          otp: otp,
        });
        if(result)

        if (result.status === 200) {
          setGlobalMessage("OTP sent successfully!");
          setGlobalSuccess("true");
          setSuccess(true);
        }
      }
      else {
        setGlobalSuccess("false");
        setGlobalMessage("User not found, enter a valid email address.");
      }
    } catch (error) {
      setGlobalSuccess("false");
      setGlobalMessage("Failed to send OTP. Please try again.");
    }
  };

  return (
    <>
      <div style={{ 
        position: "fixed", 
        top: 0, 
        width: "100%", 
        zIndex: 50 
      }}>
        <Navbar />
      </div>

      <div className="min-h-screen w-full bg-gradient-to-br from-[#2563eb] via-[#4f46e5] to-[#7c3aed] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {!isSuccess ? (
          <div className="w-full max-w-md mx-auto">
            <div className="bg-[#1e293b] rounded-2xl shadow-xl p-6 sm:p-8">
              <div className="text-center">
                <Image 
                  src="/logo.png" 
                  alt="Logo" 
                  width={80} 
                  height={80} 
                  className="mx-auto w-20 h-20 sm:w-24 sm:h-24"
                />
                <h1 className="text-xl sm:text-2xl font-bold text-white mt-4">
                  Forgot Password
                </h1>
                <p className="text-gray-300 text-sm mt-2">
                  Enter your email to receive a password reset code
                </p>
              </div>

              {globalMessage && (
                <GlobalMessage 
                  success={globalSuccess} 
                  message={globalMessage} 
                  onReset={() => setGlobalSuccess("none")} 
                />
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
                <div>
                  <Label 
                    htmlFor="email" 
                    className="text-gray-200 text-sm font-medium block mb-2"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    placeholder="test@gmail.com"
                    className="w-full bg-[#334155] text-white placeholder-gray-400 text-sm rounded-lg focus:ring-2 focus:ring-[#20c997]"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#20c997] hover:bg-[#17a589] text-white rounded-lg py-2.5 px-4 text-sm font-medium transition-colors duration-200 ease-in-out flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle 
                          className="opacity-25" 
                          cx="12" 
                          cy="12" 
                          r="10" 
                          stroke="currentColor" 
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP →"
                  )}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <OTPVerification email={sendEmail} />
        )}
      </div>
    </>
  );
}