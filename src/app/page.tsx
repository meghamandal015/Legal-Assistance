"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-wrap items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 overflow-y-auto">
      <motion.div
        className="text-center p-6 max-w-lg"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl font-bold text-white mb-4">LegalAID AI</h1>

        <p className="text-lg font-semibold text-indigo-200">
          One stop solution for all your legal problems, whether it’s generating
          replies to notices, general assistance, or knowledge gathering.
          LegalAID AI has you covered.
        </p>

        <button className="mt-6 px-6 py-3 bg-indigo-800 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none">
          Get Started
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <Image
          src="/ai-robot.png"
          height="400"
          width="400"
          className="rounded-xl"
          alt="LegalAID AI Thumbnail"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div className="flex flex-wrap justify-center gap-8 md:gap-20 p-4 max-w-6xl mx-auto -mb-[20%]">
          
          {/* Notice Reply Generator Card */}
          <Link href="/notice">
            <CardContainer className="inter-var cursor-pointer">
              <CardBody className="hover:shadow-2xl bg-gradient-to-br from-customBlue1 via-customBlue2 to-customPurple w-full max-w-sm md:max-w-md h-auto rounded-xl p-6 border">
                <CardItem translateZ="50" className="text-xl font-bold text-neutral-700">
                  Notice Reply Generator
                </CardItem>
                <CardItem as="p" translateZ="60" className="text-neutral-900 text-sm mt-2">
                  Generate legal notice replies in seconds
                </CardItem>
                <CardItem translateZ="100" className="w-full mt-4">
                  <Image
                    src="/notice.gif"
                    height={1000}
                    width={1000}
                    className="h-40 md:h-60 w-full object-cover rounded-xl"
                    alt="Notice Generator Thumbnail"
                  />
                </CardItem>
                <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
                  {/* Try Now Button */}
                  <CardItem translateZ={20} as="span" className="px-4 py-2 rounded-xl text-xl font-normal">
                    Try now →
                  </CardItem>
                  {/* Sign Up Button */}
                  <CardItem translateZ={20} as="span" className="px-4 py-2 rounded-xl bg-black text-white text-sm font-bold">
                    Sign up
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          </Link>

          {/* LegalAID Advisor Card */}
          <Link href="/chat">
            <CardContainer className="inter-var cursor-pointer">
              <CardBody className="hover:shadow-2xl bg-gradient-to-br from-customBlue1 via-customBlue2 to-customPurple w-full max-w-sm md:max-w-md h-auto rounded-xl p-6 border">
                <CardItem translateZ="50" className="text-xl font-bold text-neutral-700">
                  LegalAID Advisor
                </CardItem>
                <CardItem as="p" translateZ="60" className="text-neutral-900 text-sm mt-2">
                  Personalized Chatbot for all your legal queries
                </CardItem>
                <CardItem translateZ="100" className="w-full mt-4">
                  <Image
                    src="/chat.gif"
                    height={1000}
                    width={1000}
                    className="h-40 md:h-60 w-full object-cover rounded-xl"
                    alt="Chatbot Thumbnail"
                  />
                </CardItem>
                <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
                  {/* Try Now Button */}
                  <CardItem translateZ={20} as="span" className="px-4 py-2 rounded-xl text-center text-xl font-normal">
                    Try now →
                  </CardItem>
                  {/* Sign Up Button */}
                  <CardItem translateZ={20} as="span" className="px-4 py-2 rounded-xl bg-black text-white text-sm font-bold">
                    Sign up
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          </Link>

        </div>
      </motion.div>

      {/* Testimonials Section */}
      <div className="h-[40rem] rounded-md flex flex-col antialiased bg-grid-white/[0.05] items-center justify-center relative">
        <InfiniteMovingCards items={testimonials} direction="right" speed="slow" />
      </div>
    </div>
  );
}

const testimonials = [
  {
    quote:
      "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.",
    name: "Charles Dickens",
    title: "A Tale of Two Cities",
  },
  {
    quote:
      "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take Arms against a Sea of troubles, And by opposing end them: to die, to sleep.",
    name: "William Shakespeare",
    title: "Hamlet",
  },
  {
    quote: "All that we see or seem is but a dream within a dream.",
    name: "Edgar Allan Poe",
    title: "A Dream Within a Dream",
  },
  {
    quote:
      "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
    name: "Jane Austen",
    title: "Pride and Prejudice",
  },
  {
    quote:
      "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.",
    name: "Herman Melville",
    title: "Moby-Dick",
  },
];