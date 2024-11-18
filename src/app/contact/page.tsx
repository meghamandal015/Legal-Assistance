// "use client";

// import React, { useState } from "react";
// import { useForm } from "react-hook-form";


// const sendMessage = async (data: any) => {
//   try {
//     const response = await fetch("/api/email", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });

//     if (!response.ok) {
//       throw new Error("Failed to send message");
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Error sending message:", error);
//   }
// };

// export default function ContactUs() {
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [globalMessage, setGlobalMessage] = useState("");
//   const [globalSuccess, setGlobalSuccess] = useState("none");


//   const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm();

//   const onSubmit = async (data: any) => {
//     console.log('Submitting data:', data); 
//     const result = await sendMessage(data);
//     console.log('Result:', result); 
  
//     if (result?.success) {
//       setIsSuccess(true);
//       setGlobalMessage("Message sent successfully!");
//       setGlobalSuccess("true");
//     } else {
//       setGlobalMessage("Failed to send message.");
//       setGlobalSuccess("false");
//     }
//   };

//   return (
//     <div className="h-[100vh] bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 overflow-y-auto">
 
//       <div className="w-full bg-[#1e293b] py-10">
//         <div className="ml-8"> 
//           <h2 className="text-white text-lg">Reach out to Us</h2>
//           <h1 className="font-bold text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">
//             Contact Us
//           </h1>
//         </div>
//       </div>

   
//       <div className="min-h-[90vh] w-full flex items-start justify-center px-4 sm:px-6 md:px-8 lg:px-10 mt-4 md:mt-8 mb-12">
//         {!isSuccess ? (
//           <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-6 shadow-input bg-[#1e293b]">
//             {globalMessage && (
//               <p className={`text-${globalSuccess === 'true' ? 'green' : 'red'}-500`}>
//                 {globalMessage}
//               </p>
//             )}
//             <h1 className="font-bold text-xl md:text-2xl text-white text-left">
//               Send us a message
//             </h1>

//             <form className="my-8" onSubmit={handleSubmit(onSubmit)}>
//               {/* Name */}
//               <LabelInputContainer className="mb-4">
//                 <label htmlFor="name" className="text-neutral-200 mb-1.5">Your Name</label>
//                 <input
//                   id="name"
//                   placeholder="Enter your name"
//                   {...register("name", { required: true })}
//                   className="bg-[#334155] text-white w-full p-2 rounded-md"
//                 />
//                 {errors.name && <p className="text-red-500">This field is required</p>}
//               </LabelInputContainer>

//               {/* Email */}
//               <LabelInputContainer className="mb-4">
//                 <label htmlFor="email" className="text-neutral-200 mb-1.5">Your Email</label>
//                 <input
//                   id="email"
//                   placeholder="Ex: abc@gmail.com"
//                   type="email"
//                   {...register("email", {
//                     required: "This field is required",
//                     pattern: {
//                       value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-.]+$/,
//                       message: "Invalid email address",
//                     },
//                   })}
//                   className="bg-[#334155] text-white w-full p-2 rounded-md"
//                 />
//                 {errors.email?.message && typeof errors.email.message === 'string' && (
//                   <p className="text-red-500">{errors.email.message}</p>
//                 )}
//               </LabelInputContainer>

//               {/* Subject */}
//               <LabelInputContainer className="mb-4">
//                 <label htmlFor="subject" className="text-neutral-200 mb-1.5">Subject</label>
//                 <input
//                   id="subject"
//                   placeholder="Subject"
//                   {...register("subject", { required: true })}
//                   className="bg-[#334155] text-white w-full p-2 rounded-md"
//                 />
//                 {errors.subject && <p className="text-red-500">This field is required</p>}
//               </LabelInputContainer>

//               {/* Message */}
//               <LabelInputContainer className="mb-4">
//                 <label htmlFor="message" className="text-neutral-200 mb-1.5">Your Message</label>
//                 <textarea
//                   id="message"
//                   placeholder="Do you have anything to say?"
//                   {...register("message", { required: true })}
//                   rows={5}
//                   className="bg-[#334155] text-white w-full p-2 rounded-md"
//                 />
//                 {errors.message && <p className="text-red-500">This field is required</p>}
//               </LabelInputContainer>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 className={`bg-[#20c997] hover:bg-[#17a589] w-full text-white rounded-md h-10 font-medium shadow-lg transition-colors duration-300`}
//               >
//                 Send &rarr;
//               </button>
//             </form>
//           </div>
//         ) : (
//           // Success message or feedback can be shown here after form submission.
//           <h1 className="font-bold text-xl md:text-2xl text-green-500 text-center"><strong>Thank you for reaching out!</strong></h1>
//         )}
//       </div>
//     </div>
//   );
// }

// const LabelInputContainer: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => {
//   return (
//     <div className={`flex flex-col w-full ${className}`}>
//       {children}
//     </div>
//   );
// };


"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import emailjs from 'emailjs-com';

// Function to send the message using EmailJS
const sendMessage = async (data: any) => {
  try {
    const templateParams = {
      from_name: data.name,
      from_email: data.email,
      subject: data.subject,
      message: data.message,
    };

    // Send email using EmailJS
    const response = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAIL_JS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAIL_JS_TEMPLATE_ID!,
      templateParams,
      process.env.NEXT_PUBLIC_EMAIL_JS_PUBLIC_KEY!
    );

    return response;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export default function ContactUs() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [globalMessage, setGlobalMessage] = useState("");
  const [globalSuccess, setGlobalSuccess] = useState("none");

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const result = await sendMessage(data);
      if (result.status === 200) {
        setIsSuccess(true);
        setGlobalMessage("Message sent successfully!");
        setGlobalSuccess("true");
      }
    } catch (error) {
      setGlobalMessage("Failed to send message.");
      setGlobalSuccess("false");
    }
  };

  return (
    <div className="h-[100vh] bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 overflow-y-auto">
      <div className="w-full bg-[#1e293b] py-10">
        <div className="ml-8">
          <h2 className="text-white text-lg">Reach out to Us</h2>
          <h1 className="font-bold text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">
            Contact Us
          </h1>
        </div>
      </div>

      <div className="min-h-[90vh] w-full flex items-start justify-center px-4 sm:px-6 md:px-8 lg:px-10 mt-4 md:mt-8 mb-12">
        {!isSuccess ? (
          <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-6 shadow-input bg-[#1e293b]">
            {globalMessage && (
              <p className={`text-${globalSuccess === 'true' ? 'green' : 'red'}-500`}>
                {globalMessage}
              </p>
            )}
            <h1 className="font-bold text-xl md:text-2xl text-white text-left">
              Send us a message
            </h1>

            <form className="my-8" onSubmit={handleSubmit(onSubmit)}>
              {/* Name */}
              <LabelInputContainer className="mb-4">
                <label htmlFor="name" className="text-neutral-200 mb-1.5">Your Name</label>
                <input
                  id="name"
                  placeholder="Enter your name"
                  {...register("name", { required: true })}
                  className="bg-[#334155] text-white w-full p-2 rounded-md"
                />
                {errors.name && <p className="text-red-500">This field is required</p>}
              </LabelInputContainer>

              {/* Email */}
              <LabelInputContainer className="mb-4">
                <label htmlFor="email" className="text-neutral-200 mb-1.5">Your Email</label>
                <input
                  id="email"
                  placeholder="Ex: abc@gmail.com"
                  type="email"
                  {...register("email", {
                    required: "This field is required",
                    pattern: {
                      value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-.]+$/,
                      message: "Invalid email address",
                    },
                  })}
                  className="bg-[#334155] text-white w-full p-2 rounded-md"
                />
                {errors.email?.message && typeof errors.email.message === 'string' && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </LabelInputContainer>

              {/* Subject */}
              <LabelInputContainer className="mb-4">
                <label htmlFor="subject" className="text-neutral-200 mb-1.5">Subject</label>
                <input
                  id="subject"
                  placeholder="Subject"
                  {...register("subject", { required: true })}
                  className="bg-[#334155] text-white w-full p-2 rounded-md"
                />
                {errors.subject && <p className="text-red-500">This field is required</p>}
              </LabelInputContainer>

              {/* Message */}
              <LabelInputContainer className="mb-4">
                <label htmlFor="message" className="text-neutral-200 mb-1.5">Your Message</label>
                <textarea
                  id="message"
                  placeholder="Do you have anything to say?"
                  {...register("message", { required: true })}
                  rows={5}
                  className="bg-[#334155] text-white w-full p-2 rounded-md"
                />
                {errors.message && <p className="text-red-500">This field is required</p>}
              </LabelInputContainer>

              {/* Submit Button */}
              <button
                type="submit"
                className={`bg-[#20c997] hover:bg-[#17a589] w-full text-white rounded-md h-10 font-medium shadow-lg transition-colors duration-300`}
              >
                Send &rarr;
              </button>
            </form>
          </div>
        ) : (
          // Success message or feedback can be shown here after form submission.
          <h1 className="font-bold text-xl md:text-2xl text-green-500 text-center"><strong>Thank you for reaching out!</strong></h1>
        )}
      </div>
    </div>
  );
}

// LabelInputContainer component for consistent styling of form fields
const LabelInputContainer: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => {
  return (
    <div className={`flex flex-col w-full ${className}`}>
      {children}
    </div>
  );
};