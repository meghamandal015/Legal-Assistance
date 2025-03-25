"use client";

import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react"; // Import eye icons

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { signInSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleCredentialsSignIn } from "@/app/actions/authActions";
import Navbar from "@/components/Navbar";


import { cn } from "@/lib/utils";
import GlobalMessage from "@/components/GlobalMessage";



export default function SignIn() {

  const [globalMessage, setGlobalMessage] = useState("");
  const [globalSuccess, setGlobalSuccess] = useState("none");
  const [showPassword, setShowPassword] = useState(false);
  // const router = useRouter();


  // Sign-In form logic
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Sign-In submit logic
  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    try {
      const result = await handleCredentialsSignIn(values);

      if (result?.message) {
        setGlobalMessage(result.message);
        setGlobalSuccess("false");
        
      } else {
        setGlobalMessage("Sign-in successful");
        setGlobalSuccess("true");
        window.location.reload();
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setGlobalSuccess("false");
      setGlobalMessage("An unexpected error occurred.");
    }
  };

  return (
    <>
      <div style={{ position: "fixed", top: 0, width: "100%", zIndex: 50 }}>
        <Navbar />
      </div>
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #2563eb, #4f46e5, #7c3aed)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}>
        <div style={{
          width: "100%",
          maxWidth: "28rem",
          margin: "auto",
          borderRadius: "1rem",
          padding: "1.5rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#1e293b",
        }}>
          {globalMessage && (
            <GlobalMessage
              success={globalSuccess}
              message={globalMessage}
              onReset={() => setGlobalSuccess("none")}
            />
          )}
          <h1 style={{
            fontWeight: "bold",
            fontSize: "1.875rem",
            color: "white",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            marginBottom: "0.5rem",
          }}>
            Welcome to LEAGALAID-AI
            <Link href="/" style={{ marginLeft: "0.5rem", display: "flex", alignItems: "center" }}>
              <Image
                src="/logo.png"
                alt=" "
                width={100}
                height={100}
                className="transition-opacity duration-300 hover:opacity-80"
              />
            </Link>
          </h1>
          <p style={{
            color: "white",
            fontSize: "0.875rem",
            maxWidth: "20rem",
            marginBottom: "1rem",
            textAlign: "center",
          }}>
            Enter your details to Sign-In
          </p>
          <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: "2rem" }}>
            <div style={{ marginBottom: "1rem" }}>
              <Label htmlFor="email" style={{ color: "#e5e7eb", marginBottom: "0.375rem", display: "block" }}>
                Email Address
              </Label>
              <Input
                id="email"
                placeholder="test@gmail.com"
                type="email"
                style={{ backgroundColor: "#334155", color: "white" }}
                {...register("email")}
              />
              {errors.email && <p style={{ color: "#ef4444", fontSize: "0.875rem" }}>{errors.email.message}</p>}
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <Label htmlFor="password" style={{ color: "#e5e7eb", marginBottom: "0.375rem", display: "block" }}>
                Password
              </Label>
              <div style={{ position: "relative" }}>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  style={{ backgroundColor: "#334155", color: "white" }}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? (
                    <EyeOff style={{ height: "1rem", width: "1rem", color: "white" }} />
                  ) : (
                    <Eye style={{ height: "1rem", width: "1rem", color: "white" }} />
                  )}
                </button>
              </div>
              {errors.password && <p style={{ color: "#ef4444", fontSize: "0.875rem" }}>{errors.password.message}</p>}
              <Link href="/forget-password" className="text-sm text-blue-500 hover:text-blue-700">
                Forgot Password?
              </Link>
            </div>
            <button
              style={{
                backgroundColor: "#20c997",
                width: "100%",
                color: "white",
                borderRadius: "0.375rem",
                height: "2.5rem",
                fontWeight: "500",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "background-color 0.3s",
              }}
              className="hover:bg-[#17a589]"
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <svg
                    aria-hidden="true"
                    role="status"
                    style={{
                      display: "inline",
                      width: "1rem",
                      height: "1rem",
                      marginRight: "0.75rem",
                      color: "#e5e7eb",
                      animation: "spin 1s linear infinite",
                    }}
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="#1C64F2"
                    />
                  </svg>
                  Signing In...
                </>
              ) : (
                <>Sign In &rarr;</>
              )}
            </button>
            <div style={{
              background: "linear-gradient(to right, transparent, #d1d5db, transparent)",
              height: "1px",
              width: "100%",
              margin: "1rem 0",
            }} />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <p style={{ color: "#f3f4f6", fontSize: "1rem", maxWidth: "20rem" }}>
                Do not have an account?{" "}
                <span style={{
                  fontWeight: "bold",
                  background: "linear-gradient(to right, #3b82f6, #8b5cf6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                  <Link href="/auth/sign-up">Sign-Up</Link>
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

const LabelInputContainer: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => {
  return (
    <div className={cn("flex flex-col w-full", className)}>
      {children}
    </div>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-teal-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-full mx-auto -bottom-px inset-x-px bg-gradient-to-r from-transparent via-teal-400 to-transparent" />
    </>
  );
};

