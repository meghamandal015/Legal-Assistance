"use client"; // Add this at the very top

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import { useSession } from "next-auth/react"

const Navbar: React.FC = () => {
  const { data: session, status } = useSession();

  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleSessionChange = () => {
      console.log("Session status changed:", status);
    };

    window.addEventListener("sessionChange", handleSessionChange);
    return () => window.removeEventListener("sessionChange", handleSessionChange);
  }, [status]);


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
    { title: "About Us", href: "/aboutUs" },
    { title: "Latest", href: "/latest" },
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
        <div> 
          {!session ? (
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/auth/sign-in">
                <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium rounded-lg group bg-black text-white focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 transition-all  active:bg-black active:text-white hover:-translate-y-1 hover:shadow-lg transform ease-in-out duration-300">
                  <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-900 rounded-md">
                    Sign In
                  </span>
                </button>
              </Link>
            </div>
          ): (
            <div className="flex gap-2">
              <p className="relative font-bold text-white text-lg">Hi, {session.user?.fullname}</p>
              <Link href="/profile">
                <Image
                    src="/user_icon.png"
                    alt="Logo"
                    className="hover:opacity-80 transition-opacity duration-300"
                    width={40}
                    height={40}
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
              </Link>
            </div>
          )}
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