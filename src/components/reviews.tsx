import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const supabase = createClient();

export default function Reviews({ userDetail }) {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [userName, setUserName] = useState("");
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    const { data, error } = await supabase
      .from("rating")
      .select("*")
      .eq("user_id", userDetail.user_id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error.message);
    } else {
      setReviews(data);
    }
  }

  async function submitReview() {
    if (!newReview.trim() || rating === 0 || !userName.trim()) {
      console.error("All fields are required");
      return;
    }

    if (!userDetail?.user_id) {
      console.error("User ID is missing. Ensure userDetail is populated.");
      return;
    }

    const { data, error } = await supabase.from("rating").insert([
      {
        user_id: userDetail.user_id,
        fname: userName,
        comment: newReview,
        stars: rating,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Error inserting review:", error.message);
      return;
    }

    setNewReview("");
    setUserName("");
    setRating(0);
    fetchReviews();
  }

  return (
    <div className="mx-auto bg-white ">
      <h4 className="text-xl font-semibold mb-4">Customer Reviews</h4>
      <div className="space-y-4 mb-6">
        {reviews.slice(0, visibleCount).map((review, index) => (
          <Card key={index} className="p-3 ">
            <strong className="text-lg">{review.fname}</strong>
            <p className="text-gray-500 text-sm">{new Date(review.created_at).toLocaleDateString()}</p>
            <p className="text-yellow-500">{review.stars}/5 Review</p>
            <p className="text-gray-700">{review.comment}</p>
          </Card>
        ))}
      </div>
      {visibleCount < reviews.length && (
        <Button
          onClick={() => setVisibleCount((prev) => prev + 3)}
          className="w-full bg-gray-300 text-black py-2 rounded-lg hover:bg-gray-400 mb-6"
        >
          Load More
        </Button>
      )}
      <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
        <Label className="block text-gray-700 font-semibold">Your Name</Label>
        <Input
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your name"
          className="w-full p-2 border rounded mb-3"
        />
        <Label className="block text-gray-700 font-semibold">Your Review</Label>
        <Textarea
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="Write your review..."
          className="w-full p-2 border rounded mb-3"
        />
        <Label className="block text-gray-700 font-semibold">Rating</Label>
        <div className="flex space-x-2 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              className={`cursor-pointer text-3xl ${rating >= star ? "text-yellow-500" : "text-gray-400"}`}
            >
              ★
            </span>
          ))}
        </div>
        <Button
          onClick={submitReview}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Submit Review
        </Button>
      </div>
    </div>
  );
}
