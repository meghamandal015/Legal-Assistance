"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";


import { useSession } from "next-auth/react"

export default function Home() {
  const { data: session } = useSession();
  // console.log(session);
  // Create a reference for the card section with a specific type
  const cardSectionRef = useRef<HTMLDivElement>(null);

  // Function to scroll to card section
  const handleScrollToCards = () => {
    if (cardSectionRef.current) {
      cardSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-wrap items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 overflow-y-auto">
      {/* Header Section */}
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

        {/* Modify Get Started button with onClick event */}
        <button
          onClick={handleScrollToCards} // Scrolls to cards section on click
          className="mt-6 px-6 py-3 bg-indigo-800 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none"
        >
          Get Started
        </button>
      </motion.div>

      {/* Image Section */}
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

      {/* Cards Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 1 }}
        ref={cardSectionRef} // Reference for scrolling
      >
        <div className="flex flex-wrap justify-center gap-8 md:gap-20 p-4 max-w-6xl mx-auto -mb-[20%]">
          
          {/* Notice Reply Generator Card */}
          <Link href="/notice-file-upload">
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
      "India's land reforms sought to dismantle feudal systems, ensure equity, and uplift marginalized communities. Despite achievements, issues like unequal land distribution and elite resistance persist. This critical evaluation explores their impact, challenges, and the need for renewed efforts to achieve agrarian justice and rural development.",
    name: "India's Land Reforms: A Legacy of Hopes, Struggles, and Unfinished Agendas",
    title: "https://www.freelaw.in/legalarticles/Land-Reforms-in-India-A-Critical-Evaluation-",
  },
  {
    quote:
      "Civil society organizations (CSOs) are vital in strengthening India's democracy by empowering citizens, advocating for human rights, and driving governance reforms. Despite challenges like funding constraints and restrictive regulations, CSOs continue to promote grassroots activism, transparency, and social justice, shaping a more inclusive and resilient democratic framework for India's future.",
    name: "Civil Society Organizations: Pillars of Indian Democracy",
    title: "https://www.freelaw.in/legalarticles/The-Role-of-Civil-Society-Organizations-in-Indian-Democracy",
  },
  {
    quote: "AI is transforming the legal landscape by enhancing efficiency, accessibility, and decision-making. From predictive analytics to automated legal documents, it empowers practitioners and citizens alike. However, challenges like bias, transparency, and privacy must be addressed. This article explores how responsible AI adoption can create a more equitable, efficient, and accessible justice system.",
    name: "AI and the Law: Revolutionizing Justice with Responsibility",
    title: "https://www.forbesafrica.com/opinion/op-ed/2024/02/12/ai-and-the-law-navigating-the-future-together/",
  },
  {
    quote:
      "With the rapid growth of e-commerce in India, protecting consumer data has become critical. Existing frameworks like the IT Act, e-commerce guidelines, and cybersecurity laws aim to address these concerns. The Personal Data Protection Bill promises a robust future framework. Ensuring compliance will foster trust and a secure digital ecosystem.",
    name: "Safeguarding Consumer Data in India's E-Commerce Boom",
    title: "https://www.freelaw.in/legalarticles/Protecting-Consumer-Data-in-the-Age-of-E-commerce-A-Study-of-Indian-Laws-and-Practices",
  },
];