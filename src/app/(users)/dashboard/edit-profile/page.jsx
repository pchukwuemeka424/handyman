import Userdashboard from "@/components/userdashboard";
import Topbar from "@/components/topbar";
import profileUpdate from "@/actions/auth/profileUpdate";
import EditProfile from "@/components/editProfile";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Edit, FastForwardIcon } from "lucide-react";
import { FaUserAltSlash } from "react-icons/fa";

export default async function Profile() {
  // Create Supabase client
  const supabase = await createClient();

  // Authenticate the user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
    return null; // Early return to avoid further execution
  }

  // Fetch the user's profile
  const { data: profile, error } = await supabase
    .from("user_profile")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return <div>Error loading profile. Please try again later.</div>;
  }

  // Convert profile to JSON
  const profileJson = JSON.parse(JSON.stringify(profile));

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
          <EditProfile handler={profileUpdate} defaultValues={profileJson} />
        </div>
      </div>
    </div>
  );
}
