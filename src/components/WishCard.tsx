"use client";

import { FeatureWish } from "@/types";
import { ThumbsUp, ThumbsDown, CalendarDays } from "lucide-react";

interface WishCardProps {
  wish: FeatureWish;
  onVote: (id: string, direction: 1 | -1) => void;
  userVote?: 1 | -1 | 0;
  rank: number;
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function WishCard({ wish, onVote, userVote = 0, rank }: WishCardProps) {
  const rankColor =
    rank === 1 ? "text-yellow-500 border-yellow-400 bg-yellow-50" :
    rank === 2 ? "text-gray-400 border-gray-300 bg-gray-50" :
    rank === 3 ? "text-orange-400 border-orange-300 bg-orange-50" :
    "text-gray-300 border-gray-200 bg-white";

  return (
    <div className="bg-white rounded-xl border border-green-100 shadow-sm hover:shadow-md hover:border-green-300 transition-all duration-200 p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
      {/* Rank */}
      <div className={`hidden sm:flex flex-shrink-0 w-10 h-10 rounded-full border-2 items-center justify-center text-sm font-bold ${rankColor}`}>
        #{rank}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug line-clamp-2">
          {wish.title}
        </h3>
        <p className="mt-1.5 text-sm text-gray-500 line-clamp-3 leading-relaxed">
          {wish.description}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
          <span className="font-semibold text-gray-700">{wish.creator}</span>
          <span className="flex items-center gap-1">
            <CalendarDays className="w-3.5 h-3.5" />
            {formatDate(wish.createdAt)}
          </span>
        </div>
      </div>

      {/* Vote widget */}
      <div className="flex flex-col items-center flex-shrink-0 bg-green-50 border border-green-200 rounded-xl px-2 py-2 sm:px-3 min-w-[3rem] sm:min-w-[3.5rem]">
        <button
          onClick={() => onVote(wish.id, 1)}
          className={`p-1.5 rounded-lg transition-colors touch-manipulation ${
            userVote === 1
              ? "text-green-600 bg-green-100"
              : "text-gray-400 hover:text-green-600 hover:bg-green-100"
          }`}
          aria-label="Upvote"
        >
          <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <span className="text-base sm:text-lg font-bold text-gray-800 my-1 tabular-nums">
          {wish.rating}
        </span>
        <button
          onClick={() => onVote(wish.id, -1)}
          className={`p-1.5 rounded-lg transition-colors touch-manipulation ${
            userVote === -1
              ? "text-red-500 bg-red-50"
              : "text-gray-400 hover:text-red-500 hover:bg-red-50"
          }`}
          aria-label="Downvote"
        >
          <ThumbsDown className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}
