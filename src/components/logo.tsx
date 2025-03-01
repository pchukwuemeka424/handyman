"use client";
import { useState, useEffect } from "react";
import { useActionState } from "react";
import LogoAction from "@/actions/auth/logo";


export default function Logo() {

  const [prev, action, isPending] = useActionState<FormData>(LogoAction, {
    document: null,
    user_id: null,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [documentError, setDocumentError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); 
  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3 MB

  useEffect(() => {
    if (prev?.success) {
      setSuccessMessage(prev.message);
    }
  }, [prev]);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setDocumentError("Image is too large. Please upload a file smaller than 3MB.");
        setSelectedFile(null);
      } else {
        setDocumentError("");
        setSelectedFile(file);
      }
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!selectedFile) {
      event.preventDefault();
      setDocumentError("Please upload a valid document before submitting.");
    }
  };

  return (
    <div>
      <form action={action} onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="file"
            id="document"
            name="document"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border rounded-lg mt-2"
          />
          {documentError && <p className="text-red-500 text-sm mt-1">{documentError}</p>}
        </div>

        {previewUrl && (
          <div className="mt-4">
            <p className="text-gray-600">Image Preview:</p>
            <img src={previewUrl} alt="Preview" className="mt-2 w-40 h-40 object-cover rounded-lg" />
          </div>
        )}

        <button
          type="submit"
          className={`bg-blue-500 text-white px-6 py-2 rounded-lg mt-4 ${documentError ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`}
          disabled={isPending}
        >
          {isPending ? "Uploading..." : "Upload"}
        </button>
      </form>
         {/* Success message display */}
         {successMessage && (
        <p className="text-green-500 text-sm mt-4">{successMessage}</p>
      )}
    </div>
  );
}
