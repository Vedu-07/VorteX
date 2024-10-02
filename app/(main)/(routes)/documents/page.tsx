"use client"

import Image from "next/image";
import {useUser} from "@clerk/clerk-react"
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api"
import { toast } from "sonner";
const DocumentsPage = () => {

  const {user} = useUser();
  // Creating Document According To Schema Which We Have Created
  const create = useMutation(api.documents.create);

  const onCreate = () => {
    const promise = create({title:"Untitled"});

    toast.promise(promise,{
      loading: "Creating A New Note...",
      success: "New Note Created !!!",
      error:"Failed To Create A New Note."
    });
  }

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image 
      src="/empty.png"
      height="300"
      width="300"
      alt="Empty"
      className="dark:hidden"
      />
      <Image 
      src="/empty-dark.png"
      height="300"
      width="300"
      alt="Empty"
      className="hidden dark:block"
      />
      <h2 className="text-lg font-medium" >
        Welcome {user?.firstName}
      </h2>
      <Button onClick={onCreate}>
        <PlusCircle className="h-4 w-4 mr-2"/>Create a Note
      </Button> 
    </div>
  )
}

export default DocumentsPage;
