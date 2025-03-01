"use client";

import React, { useRef, useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { FaVideo } from "react-icons/fa"; // Import the video icon

const supabase = createClient();

const VideoVerification: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [recorded, setRecorded] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [kycData, setKycData] = useState<{ name: string; id_number: string } | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (recording && countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, recording]);

  useEffect(() => {
    const fetchKycData = async () => {
      const user = await supabase.auth.getUser();
      const userId = user?.data?.user?.id;

      if (!userId) return;

      const { data, error } = await supabase.from("kyc").select("*").eq("user_id", userId).single();

      if (error) {
        console.error("Error fetching KYC data:", error.message);
        return;
      }

      setKycData(data);
    };

    fetchKycData();
  }, []);

  const startRecording = async () => {
    if (typeof window === "undefined") return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 360 },
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        const recorder = new MediaRecorder(stream);
        const chunks: BlobPart[] = [];

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: "video/mp4" });
          setVideoBlob(blob);
          const url = URL.createObjectURL(blob);
          setVideoUrl(url);
          setRecorded(true);
          setRecording(false);
          setCountdown(null);

          if (previewRef.current) {
            previewRef.current.src = url;
            previewRef.current.load();
          }

          stream.getTracks().forEach((track) => track.stop());
        };

        recorder.start();
        setRecording(true);
        setCountdown(10);

        setTimeout(() => {
          if (recorder.state === "recording") {
            recorder.stop();
          }
        }, 10000);
      }
    } catch (error) {
      console.error("Error accessing media devices:", error);
      alert("An error occurred while accessing your camera.");
    }
  };

  const uploadVideo = async () => {
    if (!videoBlob) {
      alert("No video to upload!");
      return;
    }

    setUploading(true);
    const user = await supabase.auth.getUser();
    const userId = user?.data?.user?.id;

    if (!userId) {
      alert("User not authenticated!");
      setUploading(false);
      return;
    }

    const filename = `${userId}-${Date.now()}.mp4`;

    const { error } = await supabase.storage.from("videos").upload(filename, videoBlob, {
      contentType: "video/mp4",
    });

    if (error) {
      console.error("Upload error:", error.message);
      alert("Video upload failed!");
      setUploading(false);
      return;
    }

    const { publicUrl } = supabase.storage.from("videos").getPublicUrl(filename);

    const { error: dbError } = await supabase.from("kyc").update({ video: filename }).eq("user_id", userId);

    if (dbError) {
      console.error("Database update error:", dbError.message);
      alert("Failed to save video data!");
      setUploading(false);
      return;
    }

    alert("Video uploaded successfully!");
    setUploading(false);
    redirect("/dashboard/kyc-success");
  };

  if (!isClient) {
    return <div className="text-white text-center">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <div className="w-full max-w-lg bg-gray-800 p-6 rounded-2xl shadow-xl text-center">
        <h1 className="text-3xl font-bold mb-4 text-blue-400">
          10-Second Video Verification
        </h1>
        {kycData ? (
          <p className="text-gray-300 mb-4">
            Please clearly state your <strong className="font-semibold text-2xl"> {kycData?.first_name} {kycData?.last_name}</strong> and ID number {kycData.id_number}.
          </p>
        ) : (
          <p className="text-gray-300 mb-4">Fetching KYC data...</p>
        )}

        <div className="relative mb-4 w-full max-w-md h-56 flex items-center justify-center bg-gray-700 rounded-lg shadow-lg border border-blue-500 overflow-hidden">
          {!recording && !recorded && (
            <FaVideo className="text-gray-400 text-6xl absolute" />
          )}
          <video ref={videoRef} autoPlay className="absolute w-full h-full object-cover" />
          {recording && countdown !== null && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg text-lg">
              {countdown}
            </div>
          )}
        </div>

        {recorded && videoUrl && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Preview</h2>
            <video ref={previewRef} src={videoUrl} controls className="w-full max-w-md rounded-lg shadow-lg border border-green-500" />
          </div>
        )}

        <div className="flex justify-center space-x-4">
          {/* Start Recording Button */}
          {!recording && !recorded && (
            <button
              onClick={startRecording}
              className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
            >
              Start Recording
            </button>
          )}

          {/* Cancel Button while Recording */}
          {recording && (
            <button
              onClick={() => setRecording(false)}
              className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          )}

          {/* Submit and Rerecord after Recording */}
          {recorded && (
            <>
              <button
                onClick={uploadVideo}
                disabled={uploading}
                className={`px-6 py-3 ${uploading ? "bg-gray-500" : "bg-green-500 hover:bg-green-600"} text-white font-semibold rounded-lg shadow-md transition`}
              >
                {uploading ? "Uploading..." : "Submit"}
              </button>
              <button
                onClick={() => {
                  setRecorded(false);
                  setVideoBlob(null);
                  setVideoUrl(null);
                }}
                className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
              >
                Rerecord
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoVerification;
