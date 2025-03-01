"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import sharp from "sharp";

export default async function bannerAction(_: any, formData: FormData) {
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
  const documentFile = formData.get("bannerDocument") as File | null;

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
      .jpeg({ quality: 70 })
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

    // Extract the category ID from the form data
    const categoryId = formData.get("id");

    // Update category with new banner and title
    const { error: updateError } = await supabase
      .from("category")
      .update({
        banner: imageUrl,
        title: formData.get("title"),
      })
      .eq("id", categoryId);

    if (updateError) {
      console.error("Error updating category:", updateError);
      return { errors: { message: `Error updating category: ${updateError.message}` } };
    }

    revalidatePath("/category");
    return { success: true, message: "Banner updated successfully!" };
  } catch (error: any) {
    console.error("Error processing document:", error);
    return { errors: { document: `Error processing document: ${error.message}` } };
  }
}
