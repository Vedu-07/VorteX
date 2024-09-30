// "use client";
// import React, { useState } from "react";
// import {
//   motion,
//   AnimatePresence,
//   useScroll,
//   useMotionValueEvent,
// } from "framer-motion";
// import { cn } from "@/lib/utils";
// import Link from "next/link";
// import { useConvexAuth } from "convex/react";
// import { SignInButton,UserButton } from "@clerk/clerk-react";
// import { Spinner } from "@/components/ui/spinner";

// export const FloatingNav = ({
//   navItems,
//   className,
// }: {
//   navItems: {
//     name: string;
//     link: string;
//     icon?: JSX.Element;
//   }[];
//   className?: string;
// }) => {
//   const { scrollYProgress } = useScroll();
//   const [visible, setVisible] = useState(false);
//   const {isAuthenticated,isLoading} = useConvexAuth();
//   useMotionValueEvent(scrollYProgress, "change", (current) => {
//     // Check if current is not undefined and is a number
//     if (typeof current === "number") {
//       let direction = current - scrollYProgress.getPrevious()!;

//       if (scrollYProgress.get() < 0.05) {
//         setVisible(true);
//       } else {
//         if (direction < 0) {
//           setVisible(true);
//         } else {
//           setVisible(false);
//         }
//       }
//     }
//   });

//   return (
//     <AnimatePresence mode="wait">
//       <motion.div
//         initial={{
//           opacity: 1,
//           y: -100,
//         }}
//         animate={{
//           y: visible ? 0 : -100,
//           opacity: visible ? 1 : 0,
//         }}
//         transition={{
//           duration: 0.2,
//         }}
//         className={cn(
//           "flex max-w-[50vw] fixed top-10 inset-x-0 mx-auto border border-white/[0.2] rounded-2xl dark:bg-black-100 bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] px-8 py-6 items-center justify-between", // Use justify-between for spacing
//           className
//         )}
//       >
//         <div className="flex items-center space-x-4"> {/* Wrap links in a div for proper alignment */}
//           {navItems.map((navItem: any, idx: number) => (
//             <Link
//               key={`link=${idx}`}
//               href={navItem.link}
//               className={cn(
//                 "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 font-bold dark:hover:text-neutral-300 hover:text-neutral-500"
//               )}
//             >
//               <span className="block sm:hidden text-3xl text-white">{navItem.icon}</span>
//               <span className="hidden sm:block text-sm text-white font-extrabold">{navItem.name}</span>
//             </Link>
//           ))}
//         </div>
//         {isLoading && (
//           <Spinner/>
//         )}
//         {!isAuthenticated && !isLoading && (
//           <>
//           <SignInButton mode="modal">
//           <button className="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full">
//           <span>Login</span>
//           <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
//           </button>
//           </SignInButton>
//           </>
//         )}
//         {isAuthenticated && !isLoading && (
//           <>
//           <button className="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full">
//           <Link href="/documents">
//           Enter Vortex</Link>
//           <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
//           </button>
//           <UserButton afterSignOutUrl="/" />
//           </>
//         )

//         }
//       </motion.div>
//     </AnimatePresence>
//   );
// };


"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuth } from "@clerk/clerk-react";  // Import Clerk's useAuth
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Spinner } from "@/components/ui/spinner";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);

  // Use Clerk's authentication hook
  const { isSignedIn, isLoaded } = useAuth();  // Replacing useConvexAuth with Clerk's useAuth

  useEffect(() => {
    console.log("isSignedIn:", isSignedIn); // Check Clerk's authentication state
    console.log("isLoaded:", isLoaded);
  }, [isSignedIn, isLoaded]);

  // Visibility logic based on scroll direction
  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      let direction = current - scrollYProgress.getPrevious()!;

      if (scrollYProgress.get() < 0.05) {
        setVisible(true);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 1, y: -100 }}
        animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "flex max-w-[50vw] fixed top-10 inset-x-0 mx-auto border border-white/[0.2] rounded-2xl dark:bg-black-100 bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] px-8 py-6 items-center justify-between",
          className
        )}
      >
        <div className="flex items-center space-x-4">
          {navItems.map((navItem: any, idx: number) => (
            <Link
              key={`link=${idx}`}
              href={navItem.link}
              className={cn(
                "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 font-bold dark:hover:text-neutral-300 hover:text-neutral-500"
              )}
            >
              <span className="block sm:hidden text-3xl text-white">{navItem.icon}</span>
              <span className="hidden sm:block text-sm text-white font-extrabold">{navItem.name}</span>
            </Link>
          ))}
        </div>

        {/* Conditional Buttons Based on Authentication State */}
        {!isLoaded && <Spinner />} {/* Replace isLoading with Clerk's isLoaded */}

        {!isSignedIn && isLoaded && (
          <SignInButton mode="modal">
            <button className="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full">
              <span>Login</span>
              <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
            </button>
          </SignInButton>
        )}

        {isSignedIn && isLoaded && (
          <>
            <button   className="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full" >
              <Link href="/documents" >Enter VorteX</Link>
              <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
            </button>
            <UserButton afterSignOutUrl="/" />
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
