"use client";

import { Idea } from "@/types";
import { ThumbsUp, ThumbsDown, CheckCircle2, CalendarDays, Banknote } from "lucide-react";
import Link from "next/link";

interface IdeaCardProps {
  idea: Idea;
  onVote: (id: string, increment: number) => void;
  rank: number;
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const CATEGORY_COLORS: Record<string, string> = {
  Infrastructure: "bg-blue-100 text-blue-800",
  Environment:    "bg-emerald-100 text-emerald-800",
  Community:      "bg-purple-100 text-purple-800",
  Events:         "bg-orange-100 text-orange-800",
  Other:          "bg-gray-100 text-gray-700",
};

function categoryBadge(category: string) {
  return CATEGORY_COLORS[category] ?? "bg-gray-100 text-gray-700";
}

export function IdeaCard({ idea, onVote, rank }: IdeaCardProps) {
  const rankColor =
    rank === 1 ? "text-yellow-500 border-yellow-400 bg-yellow-50" :
    rank === 2 ? "text-gray-400 border-gray-300 bg-gray-50" :
    rank === 3 ? "text-orange-400 border-orange-300 bg-orange-50" :
    "text-gray-300 border-gray-200 bg-white";

  return (
    <Link href={`/idea/${idea.id}`} className="block group">
      <div className="bg-white rounded-xl border border-green-100 shadow-sm hover:shadow-md hover:border-green-300 transition-all duration-200 p-4 sm:p-5 flex items-start gap-3 sm:gap-4">

        {/* Rank */}
        <div className={`hidden sm:flex flex-shrink-0 w-10 h-10 rounded-full border-2 items-center justify-center text-sm font-bold ${rankColor}`}>
          #{rank}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Tags row */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${categoryBadge(idea.category)}`}>
              {idea.category}
            </span>
            {idea.solved && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                <CheckCircle2 className="w-3 h-3" />
                Solved
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug group-hover:text-green-700 transition-colors line-clamp-2">
            {idea.title}
          </h3>

          {/* Subtitle */}
          <p className="mt-1 text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {idea.subtitle}
          </p>

          {/* Meta row */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
            <span className="font-semibold text-gray-700">{idea.creator}</span>
            <span className="flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5" />
              {formatDate(idea.createdAt)}
            </span>
            {idea.costs && (
              <span className="flex items-center gap-1 text-green-700 font-medium">
                <Banknote className="w-3.5 h-3.5" />
                {idea.costs}
              </span>
            )}
          </div>
        </div>

        {/* Vote widget */}
        <div className="flex flex-col items-center flex-shrink-0 bg-green-50 border border-green-200 rounded-xl px-2 py-2 sm:px-3 min-w-[3rem] sm:min-w-[3.5rem]">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onVote(idea.id, 1);
            }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-100 transition-colors touch-manipulation"
            aria-label="Upvote"
          >
            <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <span className="text-base sm:text-lg font-bold text-gray-800 my-1 tabular-nums">
            {idea.rating}
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onVote(idea.id, -1);
            }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors touch-manipulation"
            aria-label="Downvote"
          >
            <ThumbsDown className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </Link>
  );
}
