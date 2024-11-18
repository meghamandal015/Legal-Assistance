// "use client";

// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { auth } from "@/auth";
// // import { handleSignOut } from "@/app/actions/authActions";

// // import { FloatingDock } from "@/components/ui/floating-dock";

// import { IconBrandGithub, IconBrandLinkedin, IconBrandX, IconBrowser } from "@tabler/icons-react";

// // import { Session } from "next-auth";

// const Navbar: React.FC = () => {
//   // const [session, setSession] = useState<Session | null>(null);
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     // const fetchSession = async () => {
//     //   const response = await fetch("/api/session");
//     //   const data = await response.json();
//     //   setSession(data.session);
//     // };
//     // fetchSession();

//     const handleScroll = () => {
//       setScrolled(window.scrollY > 0);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   const links = [
//     { title: "Home", href: "/" },
//     { title: "About", href: "#About" },
//     { title: "Latest", href: "#Latest" },
//     { title: "Contact", href: "#contact" },
//   ];

//   return (
//     <nav
    
//       className={`fixed w-full z-50 transition-all duration-300 ${
//         scrolled ? "bg-opacity-80 backdrop-blur-md" : "bg-transparent"
//       } bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600`}
//       style={{ minHeight: '80px' }}
//     >
//       <div className="container mx-auto flex items-center justify-between py-4 px-6">
//         {/* Logo */}
//         <div className="flex items-center">
//           <Link href="/">
//             <Image
//               src="/logo.png" // Replace with your logo path
//               alt="Logo"
//               className="hover:opacity-80 transition-opacity duration-300"
//               width={80}
//               height={40}
//             />
//           </Link>
//         </div>

//         {/* <FloatingDock items={links} /> */}

//         {/* Links */}
//         <div className="flex items-center space-x-4">
//           {!session ? (
//             <Link href="/auth/sign-in">
//               <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-orange-400 via-red-300 to-yellow-200 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 text-white hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-200 dark:focus:ring-red-400">
//                 <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-900 rounded-md group-hover:bg-opacity-0">
//                   Sign In
//                 </span>
//               </button>
//             </Link>
//           ) : (
//             <form action={handleSignOut}>
//               <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-orange-400 via-red-300 to-yellow-200 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 text-white hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-200 dark:focus:ring-red-400">
//                 <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-900 rounded-md group-hover:bg-opacity-0">
//                   Sign Out
//                 </span>
//               </button>
//             </form>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;






// "use client";

// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { IconBrandGithub, IconBrandLinkedin, IconBrandX, IconBrowser } from "@tabler/icons-react";

// const Navbar: React.FC = () => {
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 0);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   const links = [
//     { title: "Home", href: "/" },
//     { title: "Features", href: "#features" },
//     { title: "Pricing", href: "#pricing" },
//     { title: "Contact", href: "#contact" },
//   ];

//   return (
//     <nav
    
//       className={`fixed w-full z-50 transition-all duration-300 ${
//         scrolled ? "bg-opacity-80 backdrop-blur-md" : "bg-transparent"
//       } bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600`}
//       style={{ minHeight: '80px' }}
//     >
//       <div className="container mx-auto flex items-center justify-between py-4 px-6">
//         {/* Logo */}
//         <div className="flex items-center">
//           <Link href="/">
//             <Image
//               src="/logo.png" // Replace with your logo path
//               alt="Logo"
//               className="hover:opacity-80 transition-opacity duration-300"
//               width={80}
//               height={40}
//             />
//           </Link>
//         </div>

//         {/* Links */}
//         <div className="hidden md:flex items-center space-x-8">
//           {links.map((link) => (
//             <Link key={link.title} href={link.href} className="text-white font-semibold hover:text-gray-200">
//               {link.title}
//             </Link>
//           ))}
//         </div>

//         {/* Social Icons */}
//         <div className="flex items-center space-x-4">
//           <Link href="https://github.com/Naveen-NaS" target="_blank">
//             <IconBrandGithub className="w-6 h-6 text-white hover:text-gray-200" />
//           </Link>
//           <Link href="https://www.linkedin.com/in/naveen-sharma-871b7a257/" target="_blank">
//             <IconBrandLinkedin className="w-6 h-6 text-white hover:text-gray-200" />
//           </Link>
//           <Link href="https://x.com/NSharma_NaS" target="_blank">
//             <IconBrandX className="w-6 h-6 text-white hover:text-gray-200" />
//           </Link>
//           <Link href="https://www.kaggle.com/naveennas" target="_blank">
//             <IconBrowser className="w-6 h-6 text-white hover:text-gray-200" />
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


"use client"; // Add this at the very top

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const links = [
    { title: "Home", href: "/" },
    { title: "About Us", href: "/AboutUs" },
    { title: "Latest", href: "/Latest" },
    { title: "Contact", href: "/contact" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-opacity-80 backdrop-blur-md" : "bg-transparent"
      } bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600`}
      style={{ minHeight: '70px' }} // Reduced height to 70px
    >
      <div className="container mx-auto flex items-center justify-between py-3 px-6">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/logo.png" // Replace with your logo path
              alt="Logo"
              className="hover:opacity-80 transition-opacity duration-300"
              width={80}
              height={40}
            />
          </Link>
        </div>

        {/* Hamburger Menu Button for Mobile */}
        <div className="md:hidden">
          <button
            className="text-white focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {/* Hamburger Icon */}
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
              />
            </svg>
          </button>
        </div>

        {/* Links for larger screens */}
        <div className={`hidden md:flex items-center space-x-8`}>
          {links.map((link) => (
            <Link key={link.title} href={link.href} className="text-white font-semibold transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
              {link.title}
            </Link>
          ))}
        </div>

        {/* Sign In / Sign Up Buttons for larger screens */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/auth/sign-in">
            <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium rounded-lg group bg-black text-white focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 transition-all  active:bg-black active:text-white hover:-translate-y-1 hover:shadow-lg transform ease-in-out duration-300">
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-900 rounded-md">
                Sign In
              </span>
            </button>
          </Link>

          {/* <Link href="/auth/sign-up">
            <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium rounded-lg group 
            bg-black text-white focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 
            transition-all duration-300
            active:bg-black active:text-white
            hover:-translate-y-1 hover:shadow-lg transform ease-in-out">
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-900 rounded-md">
                Sign Up
              </span>
            </button>
          </Link>*/}

        </div>

        {/* Mobile Menu */}
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } md:hidden absolute top-full left-0 w-full bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 text-center`}
        >
          {/* Mobile Links */}
          {links.map((link) => (
            <Link 
              key={link.title} 
              href={link.href} 
              className="block py-[10px] text-white font-semibold transition-transform duration-&lsqb;300ms&rsqb hover:-translate-y-[1px] hover:shadow-lg"
              onClick={() => setIsOpen(false)}  
            >
              {link.title}
            </Link>
          ))}

          {/* Mobile Sign In / Sign Up Buttons */}
          <div className="py-[10px] flex flex-col items-center space-y-[10px]">
            
            {/* Reuse the same button styles for mobile */}
            
            <Link href="/auth/sign-in">
              <button className="relative inline-flex items-center justify-center p-[0.5rem] mb-[2rem] me-auto ms-auto overflow-hidden text-sm font-medium rounded-lg group 
                bg-black text-white 
                focus:ring-[4px] focus:outline-none focus:ring-purple-[800]
                transition-all duration-[300ms]
                active:bg-black active:text-white
                hover:-translate-y-[1px] hover:shadow-lg transform ease-in-out"
                onClick={() => setIsOpen(false)} 
                >
                   <span className= 'relative px-[20px] py-[10px] bg-gray-[900] rounded-md'>
                    Sign In
                   </span>
              </button>
              
            </Link>

             {/* Same for sign-up
             <Link href="/auth/sign-up">
               <button className="relative inline-flex items-center justify-center p-[0.5rem] mb-[2rem] me-auto ms-auto overflow-hidden text-sm font-medium rounded-lg group 
                 bg-black text-white 
                 focus:ring-[4px] focus:outline-none focus:ring-purple-[800]
                 transition-all duration-[300ms]
                 active:bg-black active:text-white
                 hover:-translate-y-[1px] hover:shadow-lg transform ease-in-out"
                 onClick={() => setIsOpen(false)} 
                 >
                   <span className= 'relative px-[20px] py-[10px] bg-gray-[900] rounded-md'>
                     Sign Up
                   </span>
               </button>
             </Link> */}
           </div>
         </div>
       </div>
     </nav>
   );
};

export default Navbar;