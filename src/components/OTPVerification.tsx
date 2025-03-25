"use client";

import { useEffect, useState } from 'react';


import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

import ConfirmPassword from "@/components/ConfirmPassword";

const REGEXP_ONLY_DIGITS = /^\d+$/;


const OTPSchema = z.object({
    email: z.string().min(1, "Email is required.").email("Invalid email"),
    pin: z
      .string()
      .length(6, {
        message: "Your one-time password must be 6 characters.",
      })
      .regex(REGEXP_ONLY_DIGITS, "OTP must contain only digits"),
});

interface VerifyOTPProps {
    email: string;
}

import GlobalMessage from "@/components/GlobalMessage";

import emailjs from "emailjs-com";
// emailjs.init(process.env.NEXT_PUBLIC_EMAIL_JS_PUBLIC_KEY ?? "");

const sendOTPEmail = async ({ email, otp }: { email: string; otp: string }) => {
  try {
    const templateParams = {
      from_name: "LEGALAID AI",
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



const VerifyOTP = ({ email }: VerifyOTPProps) => {
  const [countdown, setCountdown] = useState(30);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  
  const [verifyCode, setVerifyCode] = useState("");
  const [verifyCodeExpiry, setVerifyCodeExpiry] = useState(
    new Date(Date.now() + 15*60*1000)
  );

  const [verified, setVerified] = useState(false);

  const [globalMessage, setGlobalMessage] = useState("");
  const [globalSuccess, setGlobalSuccess] = useState("none");

  const form = useForm<z.infer<typeof OTPSchema>>({
    resolver: zodResolver(OTPSchema),
    defaultValues: {
      email: email,
      pin: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendEnabled(true);
    }
  }, [countdown]);


  const handleResendClick = async () => {
    setCountdown(30);
    setIsResendEnabled(false);
    setVerifyCode(Math.floor(100000 + Math.random() * 900000).toString());
    setVerifyCodeExpiry(new Date(Date.now() + 15*60*1000));

    // const result = await handelResendVerficationCode({
    //   email,
    //   verifyCode,
    //   verifyCodeExpiry,
    // });

    const result = await fetch("/api/resend-verifyCode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({email, verifyCode, verifyCodeExpiry}),
    });

    const resultData = await result.json();
    if (resultData?.success) {
      setGlobalMessage(resultData.message);
      setGlobalSuccess("true");
      await sendOTPEmail({
        email: email,
        otp: verifyCode,
      });
    } else {
      setGlobalMessage(resultData.message);
      setGlobalSuccess("false");
    }
  };


  const onSubmit = async (data: z.infer<typeof OTPSchema>) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (response.ok) {
        setVerified(true);
      } else {
        setGlobalMessage(responseData.message);
        setGlobalSuccess("false");
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      setGlobalMessage("Something went wrong. Please try again.");
      setGlobalSuccess("false");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      width: "100%", 
      background: "linear-gradient(to bottom right, #2563eb, #4f46e5, #7c3aed)",
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      padding: "1rem" 
    }}>
      {!verified ? (
        <div style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}>
          <div style={{ 
            backgroundColor: "#1e293b", 
            borderRadius: "16px", 
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", 
            padding: "2rem" 
          }}>
            {globalMessage && (
              <GlobalMessage 
                success={globalSuccess} 
                message={globalMessage} 
                onReset={() => setGlobalSuccess("none")} 
              />
            )}
            <div style={{ 
              textAlign: "center", 
              marginBottom: "2rem" 
            }}>
              <h1 style={{ 
                fontSize: "24px", 
                fontWeight: "700", 
                color: "white", 
                marginBottom: "0.75rem" 
              }}>
                Reset Password: OTP Verification
              </h1>
              <p style={{ 
                color: "#9ca3af", 
                fontSize: "16px" 
              }}>
                Enter the 6-digit verification code sent to your email
              </p>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} style={{ marginTop: "1.5rem" }}>
                <FormField
                  control={form.control}
                  name="pin"
                  render={({ field }) => (
                    <FormItem style={{ display: "flex", justifyContent: "center" }}>
                      <FormControl>
                        <InputOTP
                          value={field.value}
                          onChange={(otp) => field.onChange(otp)}
                          maxLength={6}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "8px"
                          }}
                        >
                          <InputOTPGroup style={{
                            display: "flex",
                            gap: "8px",
                            justifyContent: "center"
                          }}>
                            {[0, 1, 2, 3, 4, 5].map((index) => (
                              <InputOTPSlot
                                key={index}
                                index={index}
                                style={{
                                  width: "45px",
                                  height: "45px",
                                  backgroundColor: "#334155", // Updated to match email input background
                                  border: "1px solid #374151",
                                  borderRadius: "4px",
                                  color: "white",
                                  fontSize: "18px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center"
                                }}
                              />
                            ))}
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    backgroundColor: "#10b981",
                    color: "white",
                    borderRadius: "8px",
                    padding: "12px",
                    fontSize: "16px",
                    fontWeight: "500",
                    border: "none",
                    cursor: "pointer",
                    marginTop: "24px"
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Verifying..." : "Verify Code →"}
                </button>
                <div style={{ 
                  textAlign: "center", 
                  marginTop: "16px" 
                }}>
                  <p style={{ color: "#9ca3af", fontSize: "14px" }}>
                    Didn not receive code?{' '}
                    <button
                      onClick={handleResendClick}
                      disabled={!isResendEnabled}
                      style={{
                        background: "none",
                        border: "none",
                        color: isResendEnabled ? "#10b981" : "#6b7280",
                        fontWeight: "500",
                        cursor: isResendEnabled ? "pointer" : "default",
                        padding: "0",
                        fontSize: "14px"
                      }}
                    >
                      Resend {countdown > 0 ? `(${countdown}s)` : ''}
                    </button>
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </div>
      ) : (
        <ConfirmPassword email={email} />
      )}
    </div>
  );
};

export default VerifyOTP;
