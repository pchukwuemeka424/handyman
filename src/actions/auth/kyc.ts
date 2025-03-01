"use server";
import { createClient } from "@/utils/supabase/server";

interface KYCFormInput {
  firstName: string;
  lastName: string;
  idNumber: string;
  verificationType: string;
  document: string | null;
  user_id: string | null;
}

export default async function handleKYCSubmission(state: any, formData: FormData) {
  const supabase = await createClient();
  const userDetails = await supabase.auth.getUser();
  const user_id = userDetails.data?.user?.id || null;
  
  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3 MB
  const allowedVerificationTypes = ["bank_statement", "international_passport", "nin"];
  
  // Parse form data
  const formInput: KYCFormInput = {
    firstName: formData.get("firstName")?.toString() || "",
    lastName: formData.get("lastName")?.toString() || "",
    idNumber: formData.get("idNumber")?.toString() || "",
    verificationType: formData.get("verificationType")?.toString() || "",
    document: null,
    user_id: user_id,
  };
  
  const errors: Record<string, string> = {};
  if (!formInput.firstName) errors.firstName = "First name is required.";
  if (!formInput.lastName) errors.lastName = "Last name is required.";
  if (!formInput.idNumber) errors.idNumber = "ID number is required.";
  if (!allowedVerificationTypes.includes(formInput.verificationType)) {
    errors.verificationType = "Invalid verification type.";
  }
  
  const documentFile = formData.get("document") as File | null;
  if (!documentFile) {
    errors.document = "Document is required.";
  } else if (documentFile.size > MAX_FILE_SIZE) {
    errors.document = "Image is too large. Please upload a smaller image.";
  } else {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedImageTypes.includes(documentFile.type)) {
      errors.document = "Invalid document format. Only JPG, PNG, and GIF are allowed.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    const fileName = `kyc_${Date.now()}_${documentFile.name}`;
    const filePath = `kyc_documents/${fileName}`;
  
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("kyc_documents")
      .upload(filePath, documentFile, { contentType: documentFile.type });
  
    if (uploadError) {
      console.error("Error uploading document:", uploadError);
      return { errors: { document: `Error uploading document: ${uploadError.message}` } };
    }
  
    formInput.document = filePath;
  
    const { data: kycData, error: insertError } = await supabase
      .from("kyc")
      .update({
        first_name: formInput.firstName,
        last_name: formInput.lastName,
        id_number: formInput.idNumber,
        verification_type: formInput.verificationType,
        document: filePath,
      })
      .eq("user_id", user_id);
  
    if (insertError) {
      console.error("Error inserting KYC data:", insertError);
      return { errors: { message: `Error submitting KYC data: ${insertError.message}` } };
    }

    // Return a success flag instead of redirecting
    return { success: true, data: kycData };
  } catch (error) {
    console.error("Error processing document:", error);
    return { errors: { document: `Error processing document: ${error.message}` } };
  }
}
