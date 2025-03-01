"use client";
import { useState, useEffect } from "react";
import { useActionState } from "react";
import bannerAction from "@/actions/auth/addCat";

export default function CatBanner({record}: any) {
  const [prev, action, isPending] = useActionState<FormData>(bannerAction, {
    document: null,
    user_id: null,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [documentError, setDocumentError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [title, setTitle] = useState(""); 
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


  useEffect(() => {
    if (record) {
      setTitle(record.title);
      setSelectedFile(record.document);
    }
  }, [record]);

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

  const BannerhandleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!selectedFile || !title) {
      event.preventDefault();
      if (!selectedFile) setDocumentError("Please upload a valid document before submitting.");
      if (!title) setDocumentError("Please enter a title before submitting.");
    }
  };

  return (
    <div>
      <form action={action} onSubmit={BannerhandleSubmit}>
        <div className="mb-4">
          {/* input id hidden */}
          <input hidden onChange={(e) => setTitle(e.target.value)} type="text" name="user_id" value={record ? record.user_id : ""} />
          <input hidden onChange={(e) => setTitle(e.target.value)} type="text" name="id" value={record ? record.id : ""} />
          <label htmlFor="title" className="block text-gray-700">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mt-2"
          />
        </div>
        <div className="mb-4">
          <input
            type="file"
            id="document"

            name="bannerDocument"
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
          {isPending ? "Uploading..." : "Add Category"}
        </button>
      </form>
         {/* Success message display */}
         {successMessage && (
        <p className="text-green-500 text-sm mt-4">{successMessage}</p>
      )}
    </div>
  );
}
