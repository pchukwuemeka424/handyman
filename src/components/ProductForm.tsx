"use client";

import React, { useState } from "react";
import { useActionState } from "react";
import Catlist from "./catlist";

export default function ProductForm({ handler, product,profile }) {
  const [state, action, isPending] = useActionState(handler, undefined);
  const [imageError, setImageError] = useState(""); // Track image errors
  const [isImageValid, setIsImageValid] = useState(true); // Control button state
  const [compressedImage, setCompressedImage] = useState<File | null>(null); // Store compressed image
  const [originalImageSize, setOriginalImageSize] = useState(0); // Store original image size
  const [compressedImageSize, setCompressedImageSize] = useState(0); // Store compressed image size
  const [isSubmitting, setIsSubmitting] = useState(false); // Track form submission

  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3 MB

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalImageSize(file.size);
      if (file.size > MAX_FILE_SIZE) {
        setImageError("Image size exceeds 3 MB. Please select a smaller file.");
        setIsImageValid(false);
      } else {
        setImageError("");
        setIsImageValid(true);
        compressImage(file);
      }
    }
  };

  const compressImage = async (file: File) => {
    const { default: imageCompression } = await import("browser-image-compression");
    const options = {
      maxSizeMB: 0.5, // Target size: 0.5 MB
      maxWidthOrHeight: 1024, // Max width or height: 1024px
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      setCompressedImage(compressedFile);
      setCompressedImageSize(compressedFile.size);
      console.log("Compressed image size:", compressedFile.size);
    } catch (error) {
      console.error("Error compressing the image:", error);
      setImageError("Failed to compress the image. Please try again.");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!compressedImage) {
      setImageError("Please select and compress an image before submitting.");
      setIsSubmitting(false);
      return;
    }

    // Append compressed image to form data
    const formData = new FormData(e.currentTarget);
    formData.append("compressed_image", compressedImage);

    handler(state, formData).finally(() => setIsSubmitting(false)); // Ensure the button is re-enabled after submission
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md col-span-full">
      <form action={action} onSubmit={handleSubmit}>
      <input
            type="hidden"
            id="agentId"
            name="agentId"
            placeholder="Enter product name"
            defaultValue={profile?.agentId || ""}
            className="w-full px-4 py-2 border rounded-lg mt-2"
          />
        <input
            type="hidden"
            id="state"
            name="state"
            placeholder="Enter product name"
            defaultValue={profile?.stat || ""}
            className="w-full px-4 py-2 border rounded-lg mt-2"
          />
    
        {/* Product Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            type="text"
            id="name"
            name="name"
            placeholder="Enter product name"
            defaultValue={product?.name || ""}
            className="w-full px-4 py-2 border rounded-lg mt-2"
          />
          {state?.errors?.name && (
            <p className="text-red-500 text-sm mt-1">{state.errors.name}</p>
          )}
        </div>

        {/* Product Description */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
            Product Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter product description"
            defaultValue={product?.description || ""}
            className="w-full px-4 py-2 border rounded-lg mt-2"
            rows={3}
          ></textarea>
          {state?.errors?.description && (
            <p className="text-red-500 text-sm mt-1">{state.errors.description}</p>
          )}
        </div>

        {/* Product Price */}
        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-semibold text-gray-700">
            Product Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            placeholder="Enter product price"
            defaultValue={product?.price || ""}
            className="w-full px-4 py-2 border rounded-lg mt-2"
          />
          {state?.errors?.price && (
            <p className="text-red-500 text-sm mt-1">{state.errors.price}</p>
          )}
        </div>

        {/* Product Category */}
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-semibold text-gray-700">
            Product Category
          </label>
        <Catlist />
          {state?.errors?.category && (
            <p className="text-red-500 text-sm mt-1">{state.errors.category}</p>
          )}
        </div>

        {/* Stock Quantity */}
        <div className="mb-4">
          <label htmlFor="stock" className="block text-sm font-semibold text-gray-700">
            Stock Quantity
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            placeholder="Enter stock quantity"
            defaultValue={product?.stock || ""}
            className="w-full px-4 py-2 border rounded-lg mt-2"
          />
          {state?.errors?.stock && (
            <p className="text-red-500 text-sm mt-1">{state.errors.stock}</p>
          )}
        </div>

        {/* Product Image Upload */}
        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-semibold text-gray-700">
            Product Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            className="w-full px-4 py-2 border rounded-lg mt-2"
            onChange={handleImageChange}
          />
          {originalImageSize > 0 && (
            <p className="text-sm mt-2 text-gray-500">
              Original Size: {(originalImageSize / 1024).toFixed(2)} KB
            </p>
          )}
          {compressedImageSize > 0 && (
            <p className="text-sm mt-2 text-gray-500">
              Compressed Size: {(compressedImageSize / 1024).toFixed(2)} KB
            </p>
          )}
          {imageError && <p className="text-red-500 text-sm mt-1">{imageError}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`bg-blue-500 text-white px-6 py-2 rounded-lg w-26 mt-4 ${
            isPending || !isImageValid || isSubmitting
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-600"
          }`}
          disabled={isPending || !isImageValid || isSubmitting}
        >
          {isPending || isSubmitting ? "Processing..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
