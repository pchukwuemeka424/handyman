"use client";

import React from "react";
import {redirect } from "next/navigation";
import { useActionState } from "react";
import { FaHome, FaPlus, FaCog, FaLock, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { LuList } from "react-icons/lu";
import logout from "@/actions/auth/logout"; // Import the logout function

export default function UserDashboard() {
// use the useActionState hook to get the state of the logout action
  const [state, action, isPending] = useActionState(logout, undefined, null);


  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="m-2 text-2xl" variant="outline">
          <LuList size={10} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Products Categories</SheetTitle>
        </SheetHeader>
        <ul>
          <li className="mb-4 flex items-center">
            <FaHome className="h-5 w-5 mr-2" />
            <Link href="/dashboard/" className="hover:bg-gray-700 p-2 rounded">
              Dashboard
            </Link>
          </li>
          <li className="mb-4 flex items-center">
            <FaPlus className="h-5 w-5 mr-2" />
            <Link href="/dashboard/addproduct" className="hover:bg-gray-700 p-2 rounded">
              Add Products
            </Link>
          </li>
          <li className="mb-4 flex items-center">
            <FaCog className="h-5 w-5 mr-2" />
            <Link href="/dashboard/productlist" className="hover:bg-gray-700 p-2 rounded">
              Manage Products
            </Link>
          </li>
          
       
          <li className="mb-4 flex items-center">
            <FaUserCircle className="h-5 w-5 mr-2" />
            <Link href="/dashboard/profile" className="hover:bg-gray-700 p-2 rounded">
              Profile
            </Link>
          </li>
          <li className="mb-4 flex items-center">
            <FaSignOutAlt className="h-5 w-5 mr-2" />
            <form action={action}>
              <Button
                type="submit"
                className="p-2 rounded"
                disabled={isPending} // Disable button while logout is running
              >
                {isPending ? "Logging out..." : " Logout"}
              </Button>
             
            </form>
          </li>
        </ul>
      </SheetContent>
    </Sheet>
  );
}
