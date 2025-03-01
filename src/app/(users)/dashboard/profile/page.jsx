"use client";

import Userdashboard from "@/components/userdashboard";
import Topbar from "@/components/topbar";
import profileUpdate from "@/actions/auth/profileUpdate";
import ProfileForm from "@/components/ProfileForm";
import { useUser } from "@/context/userContext";
import Image from "next/image";
import BannwerModalLogo from "@/components/bannerModel";
import LogoModel from "@/components/logoModel";

export default function Profile() {
  const profileJson = useUser();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Full-width Banner Image */}
      <div className="w-full h-48 relative overflow-hidden bg-gray-300">
        {profileJson?.Banner && (
          <Image
            src={profileJson.Banner}
            alt="Banner Image"
            layout="fill"
            objectFit="cover"
            className="rounded-b-lg"
          />
        )}

        {/* Logo (Avatar) */}
        <div className="absolute top-10 left-6">
          {profileJson?.avatar && (
            <Image
              src={profileJson.avatar}
              alt="Logo"
              width={100}
              height={100}
              className="h-32 w-32 rounded-full border-4 border-white shadow-lg"
            />
          )}
        </div>
      </div>

      <div className=" flex my-2 space-x-2 ">
        <LogoModel />
        <BannwerModalLogo />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 bg-white shadow-md rounded-lg mx-4 md:mx-12 mt-6">
        <ProfileForm handler={profileUpdate} profile={profileJson} />
      </div>
    </div>
  );
}
