"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, FC } from "react";
import { FaStore, FaPhone, FaMapMarkerAlt, FaStar, FaCheckCircle } from "react-icons/fa";
import supabaseDb from "@/utils/supabase-db";
import Image from "next/image";
import TabFetch from "@/components/tabsFetch";

const ProductPage: FC = () => {
  const params = useParams();
  const id = params?.id as string;

  const [userDetail, setUserDetail] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Invalid user ID.");
      setLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        // Fetch user profile
        const { data: userData, error: userError } = await supabaseDb
          .from("user_profile")
          .select("*")
          .eq("user_id", id)
          .maybeSingle();

        if (userError) {
          setError(userError.message);
          return;
        }

        // Fetch ratings
        const { data: ratingData, error: ratingError } = await supabaseDb
          .from("rating")
          .select("stars")
          .eq("user_id", id);

        if (ratingError) {
          setError(ratingError.message);
          return;
        }

        // Ensure data is valid before calculations
        const validRatings = ratingData?.map(r => Number(r.stars)).filter(star => !isNaN(star)) || [];

        // Calculate the average rating
        const reviewCount = validRatings.length;
        const totalStars = validRatings.reduce((sum, stars) => sum + stars, 0);
        const averageRating = reviewCount > 0 ? (totalStars / reviewCount).toFixed(1) : "0.0"; // Keep 1 decimal place

        setUserDetail({
          ...userData,
          rating: averageRating, // Properly formatted rating (e.g., "4.5")
          reviews: reviewCount, // Total number of reviews
        });
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("An error occurred while fetching the user profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-600">Loading user profile...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">Error: {error}</p>;
  }

  if (!userDetail) {
    return <p className="text-center text-gray-600">User not found.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="h-40 sm:h-64 relative">
        <Image
          src={userDetail?.Banner}
          alt="Banner Image"
          width={600}
          height={400}
          className="w-full h-40 sm:h-64 object-cover rounded-t-lg"
        />

        <div className="absolute top-1/2 left-2/2 transform -translate-y-1/2 mx-4">
          <Image
            src={userDetail.avatar}
            alt="Avatar"
            width={600}
            height={400}
            className="h-20 w-20 sm:h-36 sm:w-36 object-cover rounded-full border-4 border-white"
          />
        </div>
      </div>

      <div className="bg-white p-6 mt-6">
        {/* Shop Name */}
        <h2 className="text-2xl sm:text-4xl font-semibold text-gray-800 mb-2">{userDetail.busName}</h2>

        <div className="flex justify-between flex-col lg:flex-row">
          <div>
            {/* Reviews, Location, and Verified Badge */}
            <div className="flex items-center gap-2 text-gray-700">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className={index < Math.round(parseFloat(userDetail.rating)) ? "text-yellow-400" : "text-gray-300"}
                />
              ))}
              <span className="text-sm">
                {userDetail.rating}/5 ({userDetail.reviews} Reviews)
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-gray-600 mt-2">
              <FaMapMarkerAlt className="text-red-500" />
              <span>{userDetail.city}, {userDetail.state}</span>
            </div>

            {/* Verified & Unverified Badge */} 
            {userDetail.kyc_status === "Approved" && (
              <div className="flex items-center text-green-600 font-medium mt-2">
                <FaCheckCircle className="mr-1 text-lg" /> Verified
              </div>
            )}
            {userDetail.kyc_status === "Pending" && (
              <div className="flex items-center text-red-600 font-medium mt-2">
                <FaCheckCircle className="mr-1 text-lg" /> Not Verified
              </div>
            )}
          </div>

          {/* Call & Message Buttons */}
          <div className="w-full sm:w-96 flex flex-col gap-2 mt-6 lg:mt-0">
            <button className="flex items-center justify-center gap-2 bg-red-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-105">
              <FaPhone /> Call Now
            </button>
            <button className="flex items-center justify-center gap-2 border-black border-2 bg-white text-black font-bold py-2 px-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-105">
              <FaStore /> Send a Message
            </button>
          </div>
        </div>
      </div>
      <TabFetch userDetail={userDetail} />
    </div>
  );
};

export default ProductPage;
