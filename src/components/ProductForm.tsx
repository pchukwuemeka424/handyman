"use client";

import React, { useState } from "react";
import { useActionState } from "react";

export default function ProductForm({ handler, profile }) {
  const [state, action, isPending] = useActionState(handler, undefined);
  const [imageError, setImageError] = useState(""); // Track image errors
  const [isImageValid, setIsImageValid] = useState(true); // Control button state
  const [compressedImages, setCompressedImages] = useState<File[]>([]); // Store compressed images
  const [originalImageSizes, setOriginalImageSizes] = useState<number[]>([]); // Store original image sizes
  const [compressedImageSizes, setCompressedImageSizes] = useState<number[]>([]); // Store compressed image sizes
  const [isSubmitting, setIsSubmitting] = useState(false); // Track form submission

  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3 MB

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    let valid = true;
    let originalSizes: number[] = [];
    let compressedFiles: File[] = [];
    let compressedSizes: number[] = [];

    for (const file of files) {
      originalSizes.push(file.size);
      if (file.size > MAX_FILE_SIZE) {
        setImageError("One or more images exceed 3 MB. Please select smaller files.");
        setIsImageValid(false);
        valid = false;
        continue;
      }
      try {
        const compressedFile = await compressImage(file);
        compressedFiles.push(compressedFile);
        compressedSizes.push(compressedFile.size);
      } catch (error) {
        console.error("Error compressing an image:", error);
        setImageError("Failed to compress some images. Please try again.");
        valid = false;
      }
    }

    if (valid) {
      setImageError("");
      setIsImageValid(true);
    }

    setOriginalImageSizes(originalSizes);
    setCompressedImages(compressedFiles);
    setCompressedImageSizes(compressedSizes);
  };

  const compressImage = async (file: File) => {
    const { default: imageCompression } = await import("browser-image-compression");
    const options = {
      maxSizeMB: 0.5, // Target size: 0.5 MB
      maxWidthOrHeight: 1024, // Max width or height: 1024px
      useWebWorker: true,
    };
    return await imageCompression(file, options);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!compressedImages.length) {
      setImageError("Please select and compress at least one image before submitting.");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    compressedImages.forEach((image, index) => {
      formData.append(`compressed_image_${index}`, image);
    });

    handler(state, formData).finally(() => setIsSubmitting(false));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md col-span-full">
      <form action={action} onSubmit={handleSubmit}>
        <input type="hidden" id="userId" name="userId" defaultValue={profile?.userId || ""} />

        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-semibold text-gray-700">
            Upload Images
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            multiple
            className="w-full px-4 py-2 border rounded-lg mt-2"
            onChange={handleImageChange}
          />
          {originalImageSizes.length > 0 && (
            <p className="text-sm mt-2 text-gray-500">
              Original Sizes: {originalImageSizes.map(size => (size / 1024).toFixed(2)).join(", ")} KB
            </p>
          )}
          {compressedImageSizes.length > 0 && (
            <p className="text-sm mt-2 text-gray-500">
              Compressed Sizes: {compressedImageSizes.map(size => (size / 1024).toFixed(2)).join(", ")} KB
            </p>
          )}
          {imageError && <p className="text-red-500 text-sm mt-1">{imageError}</p>}
        </div>

        <button
          type="submit"
          className={`bg-blue-500 text-white px-6 py-2 rounded-lg w-26 mt-4 ${
            isPending || !isImageValid || isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
          }`}
          disabled={isPending || !isImageValid || isSubmitting}
        >
          {isPending || isSubmitting ? "Processing..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
