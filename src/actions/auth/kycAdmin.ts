"use server"; 
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

export async function updateKYC(data: any) {
  const supabase = await createClient();
  const resend = new Resend(process.env.RESEND_API_KEY); // Ensure API key is set

  // Update KYC Table
  const { error } = await supabase
    .from("kyc")
    .update({
      first_name: data.first_name,
      last_name: data.last_name,
      verification_type: data.verification_type,
      id_number: data.id_number,
      kyc_status: data.kyc_status,
    })
    .eq("id", data.id);

  if (error) return { error: error.message };

  // Update User Profile Table
  const { error: profileError } = await supabase
    .from("user_profile")
    .update({
      kyc_status: data.kyc_status,
    })
    .eq("id", data.user_id);

  if (profileError) return { error: profileError.message };

  // Fetch User Email
  const { data: userData, error: userError } = await supabase
    .from("user_profile")
    .select("email, username")
    .eq("id", data.user_id)
    .single();

  if (userError || !userData) {
    return { error: "User not found or email missing." };
  }

  // Determine Email Subject and Content Based on KYC Status
  let subject = "";
  let message = "";

  if (data.kyc_status === "Approved") {
    subject = "🎉 KYC Approved - Welcome Aboard!";
    message = `
      <p>Dear ${userData.username},</p>
      <p>Congratulations! Your KYC verification has been successfully approved.</p>
      <p>You now have full access to our platform.</p>
      <p>Thank you for choosing ${process.env.APP_NAME}!</p>
    `;
  } else if (data.kyc_status === "Rejected") {
    subject = "❌ KYC Rejected - Action Required";
    message = `
      <p>Dear ${userData.username},</p>
      <p>Unfortunately, your KYC verification was rejected. Please check your submitted details and try again.</p>
      <p>For further assistance, contact our support team.</p>
    `;
  }

  // Send Email If KYC is Approved or Rejected
  if (subject && message) {
    await resend.emails.send({
      from: `${process.env.APP_NAME} <${process.env.APP_EMAIL}>`,
      to: userData.email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          ${message}
          <p>Best Regards,</p>
          <p><strong>The ${process.env.APP_NAME} Team</strong></p>
        </div>
      `,
    });
  }
// delete video using [video_path]
  const { error: videoError } = await supabase
    .storage
    .from("videos")
    .remove([data.video]);
  if (videoError) {
    console.error("Error deleting video from bucket:", videoError);
    alert("Failed to delete the video from the storage bucket.");
    return;
  }

  revalidatePath("/admin/kyc", "page"); // Ensure cache refresh
  return { success: true };
}
