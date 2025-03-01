"use client";
import Userdashboard from "@/components/userdashboard";
import Topbar from "@/components/topbar";
import profileUpdate from "@/actions/auth/profileUpdate";
import ProfileForm from "@/components/ProfileForm";
import { redirect } from "next/navigation";
import { FastForwardIcon } from "lucide-react";
import { FaUserAltSlash } from "react-icons/fa";
import { useUser } from "@/context/userContext";

export default function Profile() {

  const profileJson = useUser();
 
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Main Content Area */}
      <div className="flex-1 p-6 bg-gray-50 space-y-6 ">
        {/* Dashboard & Topbar */}
      <div className="col-span-full bg-blue-700 font-semibold text-white shadow-md p-4">
        <FaUserAltSlash className="inline-block mr-2" />
        Profile Page
        </div>
       
        <div className="min-w-2">
          {/* Profile Form */}
          <ProfileForm handler={profileUpdate} profile={profileJson} />
        </div>
      </div>
    </div>
  );
}
