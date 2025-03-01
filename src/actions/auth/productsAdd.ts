"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

interface FormInput {
  images: string[];
  user_id: string | null;
}

export default async function addProduct(state: any, formData: FormData) {
  const supabase = await createClient();
  const userDetails = await supabase.auth.getUser();
  const user_id = userDetails.data?.user?.id || null;
  
  const formInput: FormInput = {
    images: [],
    user_id: user_id,
  };

  const imageFiles = formData.getAll("image") as File[];
  if (!imageFiles.length) {
    return { errors: { message: "At least one image file is required." } };
  }

  const uploadedImagePaths: string[] = [];

  for (const imageFile of imageFiles) {
    const imageBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);

    const fileName = `${Date.now()}-${imageFile.name}`;
    const filePath = `public/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, buffer, {
        contentType: imageFile.type,
      });

    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      return { errors: { message: "Error uploading images." } };
    }

    uploadedImagePaths.push(filePath);
  }

  formInput.images = uploadedImagePaths;

  const { error: insertError } = await supabase
    .from("images")
    .insert(
      uploadedImagePaths.map((imagePath) => ({
        image: imagePath,
        user_id: user_id,
      }))
    );

  if (insertError) {
    console.error("Error inserting images:", insertError);
    return { errors: { message: "Error inserting images." } };
  }

  console.log("Images uploaded successfully:", uploadedImagePaths);

  return redirect("/dashboard/productlist");
}
