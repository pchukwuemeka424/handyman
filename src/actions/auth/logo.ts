"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import sharp from "sharp";

export default async function handleLogoSubmission(_: any, formData: FormData) {
  const supabase = await createClient();

  if (!supabase) {
    return { errors: { message: "Supabase client failed to initialize." } };
  }

  const { data: userDetails, error: userError } = await supabase.auth.getUser();
  if (userError || !userDetails?.user) {
    return { errors: { message: "User authentication failed." } };
  }

  const user_id = userDetails.user.id;
  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3 MB
  const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];

  const errors: Record<string, string> = {};
  const documentFile = formData.get("document") as File | null;

  if (!documentFile) {
    errors.document = "Document is required.";
  } else if (documentFile.size > MAX_FILE_SIZE) {
    errors.document = "Image is too large. Please upload a smaller image.";
  } else if (!allowedImageTypes.includes(documentFile.type)) {
    errors.document = "Invalid document format. Only JPG, PNG, and GIF are allowed.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    // Compress the image
    const buffer = await documentFile.arrayBuffer();
    const compressedDocument = await sharp(Buffer.from(buffer))
      // .resize({ width: 300, height: 300, fit: "cover" })
      .png({ quality: 70 })
      .toBuffer();

    // Generate file path
    const fileName = `avatar_${user_id}_${Date.now()}.jpg`;
    const filePath = `public/${fileName}`;

    // Upload image to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("logos")
      .upload(filePath, compressedDocument, { contentType: "image/jpeg" });

    if (uploadError) {
      console.error("Error uploading document:", uploadError);
      return { errors: { document: `Error uploading document: ${uploadError.message}` } };
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage.from("logos").getPublicUrl(filePath);
    const imageUrl = publicUrlData.publicUrl;

    // Update user profile with new avatar URL
    const { error: updateError } = await supabase
      .from("user_profile")
      .update({ avatar: imageUrl, avatar: imageUrl }) // Fixed `avater` typo
      .eq("user_id", user_id);

    if (updateError) {
      console.error("Error updating user profile:", updateError);
      return { errors: { message: `Error updating user profile: ${updateError.message}` } };
    }

    revalidatePath("/dashboard/profile");
    return { success: true, message: "Logo uploaded successfully!" };
  } catch (error: any) {
    console.error("Error processing document:", error);
    return { errors: { document: `Error processing document: ${error.message}` } };
  }
}
