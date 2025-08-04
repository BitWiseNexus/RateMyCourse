"use client";

import React, { useEffect, useState } from "react";
import AddReviewButton from "../AddReviewButton";
import { ChevronRight, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface CoursePageReviewsProps {
  id: string; // Course ID
  reviewCount: number;
}

/* Single Review Card (vertical format) */
const CourseReviewItem = ({ review }: { review: any }) => {
  const formattedDate = new Date(review.created_at).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="p-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow h-full">
      <div className="flex flex-col mb-2">
        <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">
          {review.anonymous_id || "Anonymous"}
        </h4>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {formattedDate}
        </span>
      </div>
      <p className="text-xs text-gray-700 dark:text-gray-300">
        {review.comment || "No comment provided."}
      </p>
    </div>
  );
};

/* Main Reviews Component */
const CoursePageReviews = ({ id, reviewCount }: CoursePageReviewsProps) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false); // Toggle for View All

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);

      // Fetch all reviews
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          id,
          anonymous_id,
          comment,
          created_at
        `)
        .eq("target_id", id)
        .eq("target_type", "course")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching reviews:", error.message);
      } else {
        setReviews(data || []);
      }

      setLoading(false);
    };

    fetchReviews();
  }, [id]);

  // Show only 3 unless expanded
  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-muted dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-muted dark:border-gray-700 flex justify-between items-center">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100">
          Student Reviews
        </h2>
        <AddReviewButton courseId={id} />
      </div>

      {/* Reviews list */}
      <div className="p-3 space-y-3">
        {loading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading reviews...
          </p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No reviews yet for this course.
          </p>
        ) : (
          displayedReviews.map((review) => (
            <CourseReviewItem key={review.id} review={review} />
          ))
        )}
      </div>

      {/* View All Toggle */}
      {reviews.length > 3 && (
        <div
          onClick={() => setShowAll(!showAll)}
          className="p-2 border-t border-muted dark:border-gray-700 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center justify-center w-full">
            {showAll ? "Show less" : `View all reviews`}
            {showAll ? (
              <ChevronDown className="h-4 w-4 ml-1" />
            ) : (
              <ChevronRight className="h-4 w-4 ml-1" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default CoursePageReviews;
