// "use client";

// import { cn } from "@/lib/utils";
// import React, { useEffect, useState } from "react";

// export const InfiniteMovingCards = ({
//   items,
//   direction = "left",
//   speed = "fast",
//   pauseOnHover = true,
//   className,
// }: {
//   items: {
//     quote: string;
//     name: string;
//     title: string;
//   }[];
//   direction?: "left" | "right";
//   speed?: "fast" | "normal" | "slow";
//   pauseOnHover?: boolean;
//   className?: string;
// }) => {
//   const containerRef = React.useRef<HTMLDivElement>(null);
//   const scrollerRef = React.useRef<HTMLUListElement>(null);

//   useEffect(() => {
//     addAnimation();
//   }, []);
  
//   const [start, setStart] = useState(false);

//   function addAnimation() {
//     if (containerRef.current && scrollerRef.current) {
//       const scrollerContent = Array.from(scrollerRef.current.children);

//       scrollerContent.forEach((item) => {
//         const duplicatedItem = item.cloneNode(true);
//         if (scrollerRef.current) {
//           scrollerRef.current.appendChild(duplicatedItem);
//         }
//       });

//       getDirection();
//       getSpeed();
//       setStart(true);
//     }
//   }

//   const getDirection = () => {
//     if (containerRef.current) {
//       if (direction === "left") {
//         containerRef.current.style.setProperty(
//           "--animation-direction",
//           "forwards"
//         );
//       } else {
//         containerRef.current.style.setProperty(
//           "--animation-direction",
//           "reverse"
//         );
//       }
//     }
//   };

//   const getSpeed = () => {
//     if (containerRef.current) {
//       if (speed === "fast") {
//         containerRef.current.style.setProperty("--animation-duration", "20s");
//       } else if (speed === "normal") {
//         containerRef.current.style.setProperty("--animation-duration", "40s");
//       } else {
//         containerRef.current.style.setProperty("--animation-duration", "80s");
//       }
//     }
//   };

//   return (
//     <div
//       ref={containerRef}
//       className={cn(
//         "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
//         className
//       )}
//     >
//       <ul
//         ref={scrollerRef}
//         className={cn(
//           "flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap",
//           start && "animate-scroll",
//           pauseOnHover && "hover:[animation-play-state:paused]"
//         )}
//       >
//         {items.map((item, idx) => (
//           <li
//             className="w-[300px] max-w-full relative rounded-2xl border border-b-0 flex-shrink-0 border-slate-700 px-8 py-6 md:w-[350px]"
//             style={{
//               background:
//                 "linear-gradient(180deg, var(--slate-800), var(--slate-900)",
//             }}
//             key={item.name}
//           >
//             <blockquote>
//               <div
//                 aria-hidden="true"
//                 className="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
//               ></div>
//               <span className="relative z-20 text-sm leading-[1.6] text-gray-100 font-normal">
//                 {item.quote}
//               </span>
//               <div className="relative z-20 mt-6 flex flex-row items-center">
//                 <span className="flex flex-col gap-1">
//                   <span className="text-sm leading-[1.6] text-gray-400 font-normal">
//                     {item.name}
//                   </span>
//                   {/* Render title as a clickable link */}
//                   <a
//                     href={item.title} // Use the title as the URL
//                     target="_blank" // Open in new tab
//                     rel="noopener noreferrer" // Security for external links
//                     className="text-indigo-500 underline text-sm leading-[1.6] font-normal"
//                   >
//                     Click here to read full article →
//                   </a>
//                 </span>
//               </div>
//             </blockquote>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);
  
  const [start, setStart] = useState(false);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
      }
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            key={item.name}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background:
                'linear-gradient(180deg, var(--slate-800), var(--slate-900))',
              width: '300px',
              maxWidth: '100%',
              borderRadius: '1rem',
              border: '1px solid #334155',
              padding: '24px',
              flexShrink: 0,
              minHeight: '350px', // Ensures consistent card height
            }}
          >
            <blockquote>
              <div
                aria-hidden="true"
                style={{
                  userSelect: 'none',
                  zIndex: -1,
                  pointerEvents: 'none',
                  position: 'absolute',
                  left: '-0.5px',
                  top: '-0.5px',
                  height: 'calc(100% + 4px)',
                  width: 'calc(100% + 4px)',
                }}
              ></div>
              
              {/* Quote Section */}
              <span
                style={{
                  zIndex: 20,
                  fontSize: '0.875rem', // Text size equivalent to text-sm
                  lineHeight: '1.6',
                  color: '#f3f4f6', // Equivalent to text-gray-100
                  fontWeight: 'normal',
                }}
              >
                {item.quote}
              </span>

              {/* Author and Link Section */}
              <div
                style={{
                  zIndex: 20,
                  marginTop: '24px', // Space between quote and author/link
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Author Name */}
                <span
                  style={{
                    fontSize: '0.875rem', // Text size equivalent to text-sm
                    lineHeight: '1.6',
                    color: '#9ca3af', // Equivalent to text-gray-400
                    fontWeight: 'normal',
                    marginBottom: '8px', // Space between name and link
                  }}
                >
                  {item.name}
                </span>

                {/* Clickable Link */}
                <a
                  href={item.title}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '0.875rem', // Text size equivalent to text-sm
                    lineHeight: '1.6',
                    color: '#3b82f6', // Equivalent to text-indigo-500
                    textDecoration: 'underline',
                    height: '40px', // Fixed height for the link section
                    display: 'flex',
                    alignItems: 'center', // Center the text vertically
                    justifyContent: 'flex-start', // Center the text horizontally
                    marginTop: 'auto', // Pushes the link to the bottom of the card
                  }}
                >
                  Click here to read full article →
                </a>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};