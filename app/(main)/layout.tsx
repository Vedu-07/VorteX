"use client"

import { Spinner } from "@/components/spinner";
import { useAuth } from "@clerk/clerk-react";
import { redirect } from "next/navigation";
import  Navigation from "./_components/navigation";
import { SearchCommand } from "@/components/search-command";
import { ModalProvider } from "@/components/providers/modal-provider";

const MainLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {

    const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg"/>
      </div>
    )
  }

  if (!isSignedIn) {
    return redirect("/");
  }

  return ( 
    <div className="h-full flex dark:bg-[#1F1F1F]">
      <Navigation />
       <main className="flex-1 h-full overflow-y-auto">
         <SearchCommand />
         <ModalProvider/>
         {children}
       </main>
    </div>
   );
}
 
export default MainLayout;