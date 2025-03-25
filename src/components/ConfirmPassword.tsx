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

import { useRouter } from "next/navigation";

const newPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});


interface ConfirmPasswordProps {
  email: string;
}

const ConfirmPassword = ({ email }: ConfirmPasswordProps) => {
  const [globalMessage, setGlobalMessage] = useState("");
  const [globalSuccess, setGlobalSuccess] = useState("none");

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
  });

  const onSubmit = async (values: z.infer<typeof newPasswordSchema>) => {
    try {
      const response = await fetch("/api/forget-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password: values.password }),
      });

      const responseData = await response.json();
      if (response.ok) {
        router.push(`/auth/sign-in`);
      } else {
        setGlobalMessage(responseData.message);
        setGlobalSuccess("false");
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      setGlobalMessage("Something went wrong. Please try again.");
      setGlobalSuccess("false");
    }
  };
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#2563eb] via-[#4f46e5] to-[#7c3aed] flex items-center justify-center px-4 sm:px-6 lg:px-8">
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
              Set New Password
            </h1>
            <p className="text-gray-300 text-sm mt-2">
              Enter your new password below
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
                htmlFor="password" 
                className="text-gray-200 text-sm font-medium block mb-2"
              >
                New Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
                className="w-full bg-[#334155] text-white placeholder-gray-400 text-sm rounded-lg focus:ring-2 focus:ring-[#20c997]"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <Label 
                htmlFor="confirmPassword" 
                className="text-gray-200 text-sm font-medium block mb-2"
              >
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                className="w-full bg-[#334155] text-white placeholder-gray-400 text-sm rounded-lg focus:ring-2 focus:ring-[#20c997]"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
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
                  Updating Password...
                </>
              ) : (
                "Update Password →"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ConfirmPassword;