"use client";
import { useState } from "react";
import { FaShareAlt, FaCopy } from "react-icons/fa";
import { Button } from "./ui/button";

const ShopUrlDisplay = ({ siteData, profile }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  
  const handleCopyClick = () => {
    const url = `${siteData.siteUrl}store/${profile?.username}`;
    navigator.clipboard.writeText(url)
      .then(() => setCopySuccess(true))
      .catch((err) => console.error('Error copying text: ', err));
  };

  const handleShareClick = () => {
    const url = `${siteData.siteUrl}store/${profile?.username}`;
    if (navigator.share) {
      navigator.share({
        title: "Check out my shop!",
        url: url,
      })
      .catch((err) => console.error("Error sharing:", err));
    } else {
      // Fallback if the browser doesn't support the Web Share API
      window.open(`https://twitter.com/share?url=${url}`, "_blank");
    }
  };

  return (
    siteData?.siteUrl && (
      <div className="bg-gray-100 p-4 rounded-md shadow-md">
        <span className="text-gray-800 font-semibold">Shop URL: </span>
        <a href={`${siteData.siteUrl}store/${profile?.username}`} className="text-blue-500 hover:underline">
          {siteData.siteUrl}store/{profile?.username}
        </a>

        <div className="flex space-x-4 ml-auto">
          <Button onClick={handleCopyClick} className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md shadow-md">
            <FaCopy size={20} />
            <span>{copySuccess ? "Copied!" : "Copy URL"}</span>
          </Button>
          <Button onClick={handleShareClick} className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md">
            <FaShareAlt size={20} />
            <span>Share</span>
          </Button>
        </div>
      </div>
    )
  );
};

export default ShopUrlDisplay;
