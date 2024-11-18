"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";

import { z } from "zod";
import { signInSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleCredentialsSignIn } from "@/app/actions/authActions";


import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import GlobalMessage from "@/components/GlobalMessage";
import { AuthError } from "next-auth";

export default function SignIn() {
  const [globalMessage, setGlobalMessage] = useState("");
  const [globalSuccess, setGlobalSuccess] = useState("none");

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

  
  // Sign-In submit logic
  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    try {
      console.log("Values: ", values);
      const result: AuthError | undefined = await handleCredentialsSignIn(values);
      if (result) {
        setGlobalMessage(result.message);
        setGlobalSuccess("false");
      } else {
        setGlobalMessage("Sign-in successful");
        setGlobalSuccess("true");
        console.log("Sign-in successful");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setGlobalSuccess("false");
      setGlobalMessage("An unexpected error occurred.");
    }
  };


  return (
    <div className="h-[100vh] bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 overflow-y-auto">
      {/* Adjusted padding and margin */}
      <div className="min-h-[100vh] w-full flex items-start justify-center px-4 sm:px-6 md:px-8 lg:px-10 mt-16">        
          <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-6 shadow-input bg-[#1e293b]">
            {globalMessage && <GlobalMessage success={globalSuccess} message={globalMessage} />}
            <h1 className="font-bold text-2xl md:text-3xl text-white text-center md:text-left flex items-center">
              Welcome to {" LEAGALAID-AI"}
              <Link href="/" className="ml-2 flex items-center">
                <Image
                  src="/logo.png"
                  alt=" "
                  width={150}
                  height={150}
                  className="hover:opacity-80 transition-opacity duration-300"
                />
              </Link>
            </h1>
            <p className="text-white text-sm max-w-sm mt-2 text-center md:text-left">
              Enter your details to Sign-In
            </p>

            <form className="my-8" onSubmit={handleSubmit(onSubmit)}>
              {/* Email Address */}
              <LabelInputContainer className="mb-4">
                <Label htmlFor="email" className="text-neutral-200 mb-1.5">
                  Email Address
                </Label>
                <Input
                  id="email"
                  placeholder="test@gmail.com"
                  type="email"
                  className="bg-[#334155] text-white"
                  {...register("email")}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

              </LabelInputContainer>

              {/* Password */}
              <LabelInputContainer className="mb-4">
                <Label htmlFor="password" className="text-neutral-200 mb-1.5">
                  Password
                </Label>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  className="bg-[#334155] text-white"
                  {...register("password")}
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </LabelInputContainer>

              {/* Submit Button */}
              <button
                className="bg-[#20c997] hover:bg-[#17a589] w-full text-white rounded-md h-10 font-medium shadow-lg transition-colors duration-300"
                type="submit"
              >
                {isSubmitting ? (
                  <>
                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/>
                    </svg>
                    Loading...
                  </>
                ) : (
                  <>
                    Sign In &rarr;
                    <BottomGradient />
                  </>
                )}

              </button>

              {/* Divider */}
              <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-4 h-[1px] w-full" />

              {/* Sign-Up Link */}
              <div className="flex justify-center -mb-10">
                <p className="text-neutral-100 text-l max-w-sm dark:text-neutral-300">
                  Don't registered?{" "}
                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">
                    <Link href="/auth/sign-up">Sign-Up</Link>
                  </span>
                </p>
              </div>
            </form>
          </div>
      </div>
    </div>
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

