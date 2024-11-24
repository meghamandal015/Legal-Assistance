"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

// Dummy data for news items with bullet points
const newsItems = [
  {
    id: 1,
    title: "Supreme Court Directs Union to Form Action Plan for Childcare Spaces in Public Buildings",
    date: "19-November-2024",
    image: "/news1.jpg", // Placeholder image
    link: "https://www.livelaw.in/top-stories/supreme-court-directs-union-to-frame-action-plan-for-feeding-childcare-spaces-in-public-places-buildings-275689",
    points: [
      "Supreme Court gives Union Government final chance to submit action plan for feeding and childcare spaces in public buildings.",
      "Court urges Union to coordinate with States for implementation in new and existing buildings.",
      "Lack of clear legal framework; Union directed to ensure action plan aligns with women's and child welfare policies.",
    ],
  },
  {
    id: 2,
    title: "CCI Slaps Meta with Major Fine Over Data Sharing",
    date: "19-November-2024",
    image: "/news3.jpg", // Placeholder image
    link: "https://lawtrend.in/cci-fines-meta-rs-213-crore-orders-whatsapp-to-halt-data-sharing-with-sister-companies/",
    points: [
        "CCI imposes a hefty Rs 213 crore fine on Meta Platforms Inc. for anti-competitive practices.",
        "WhatsApp is ordered to stop data sharing with its sister companies.",
        "CCI emphasizes user data privacy, tightening regulations on tech giants.",
    ],
  },
  {
    id: 3,
    title: "Supreme Court Orders Continued Implementation of GRAP-IV Amid Delhi's Pollution Crisis",
    date: "18-November-2024",
    image: "/news2.jpg", // Placeholder image
    link: "https://www.freelaw.in/legalnews/Implementation-of-GRAP-IV-will-Continue-even-if-the-AQI-Level-Drops-Below-450-Supreme-Court-on-Increasing-Delhi-Air-Pollution-",
    points: [
      "Delhi NCR States directed to halt physical classes up to class 12 due to air pollution.",
      "Court orders immediate action to monitor and report violations, with satellite data to track farm fires.",
    ],
  },
];

export default function LatestNews() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [lineHeight, setLineHeight] = useState(0);

  // Update the line height dynamically based on content height and screen size
  useEffect(() => {
    const updateLineHeight = () => {
      if (timelineRef.current) {
        // Find the last news item and cast it as HTMLElement
        const lastItem = timelineRef.current.querySelector('.news-item:last-child') as HTMLElement | null;
        if (lastItem) {
          // Get its position relative to its parent container
          const lastItemPosition = lastItem.offsetTop + lastItem.offsetHeight / 2;
          setLineHeight(lastItemPosition);
        }
      }
    };

    window.addEventListener('scroll', updateLineHeight);
    window.addEventListener('resize', updateLineHeight);

    // Initial call to set height
    updateLineHeight();

    return () => {
      window.removeEventListener('scroll', updateLineHeight);
      window.removeEventListener('resize', updateLineHeight);
    };
  }, [timelineRef]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 overflow-hidden">
      {/* Header Section */}
      <div className="w-full py-8 sticky top-0 bg-[#1e293b] z-10">
        <div className="ml-8">
          <h2 className="text-white text-sm mb-1">Get to Know</h2>
          <h1 className="font-bold text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">
            Latest News
          </h1>
        </div>
      </div>

      {/* Timeline Section */}
      <div ref={timelineRef} className="relative container mx-auto my-8 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 12rem)', scrollBehavior: 'smooth' }}>
        {/* Vertical Line */}
        <div
          className="absolute w-[6px] bg-gray-300 left-[50%] transform -translate-x-[50%]"
          style={{ height: `${lineHeight}px` }}
        ></div>

        {newsItems.map((item, index) => (
          <div key={item.id} className={`news-item mb-16 flex flex-col md:flex-row justify-between items-center w-full ${index % 2 === 0 ? "md:flex-row-reverse" : ""} ${index === newsItems.length - 1 ? "last:mb-0" : ""}`}>
            {/* Content Box with Date Inside */}
            <div className={`w-full md:w-[40%] ${index % 2 === 0 ? "text-left ml-12" : "text-left mr-12"} text-container`}>
              <div className="bg-[#334155] p-6 rounded-lg shadow-lg relative">
                <h3 className="mb-3 font-bold text-white text-xl">{item.title}</h3>
                <span className="block text-gray-400 text-sm mb-4">{item.date}</span>
                <ul className="list-disc list-inside text-gray-300 pl-5">
                  {item.points.map((point, i) => (
                    <li key={i} className="text-left leading-relaxed">{point}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Larger Circle with Image */}
            <div className={`z-20 flex items-center justify-center w-[150px] h-[150px] lg:w-[120px] lg:h-[120px] md:w-[100px] md:h-[100px] sm:w-[80px] sm:h-[80px] rounded-full bg-blue-600 shadow-xl border border-white ${index % 2 === 0 ? "ml-auto" : "mr-auto"}`}>
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                <Image src={item.image} alt={item.title} width={150} height={150} className="rounded-full hover:scale-105 transition-transform duration-300" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}