import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import UserDashboard from "@/components/userdashboard";
import KycStatus from "@/components/kyc";
import handleKYCSubmission from "@/actions/auth/kyc";
import TopBar from "@/components/topbar";
export default async function KycPage() {
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: profile, error } = await supabase
    .from("user_profile")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  

  return (
    <div>
       

      <KycStatus handler={handleKYCSubmission} />
    </div>
  );
}
