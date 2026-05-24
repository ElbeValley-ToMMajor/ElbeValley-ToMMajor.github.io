"use client";

import { useData } from "@/hooks/useData";
import { ThumbsUp, ThumbsDown, CheckCircle2, ArrowLeft, CalendarDays, Banknote, User } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const CATEGORY_COLORS: Record<string, string> = {
  Infrastructure: "bg-blue-100 text-blue-800",
  Environment:    "bg-emerald-100 text-emerald-800",
  Community:      "bg-purple-100 text-purple-800",
  Events:         "bg-orange-100 text-orange-800",
  Other:          "bg-gray-100 text-gray-700",
};

export default function IdeaDetailClient() {
  const params = useParams();
  const id = params.id as string;
  const { ideas, voteIdea, isLoaded } = useData();

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center p-16">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const idea = ideas.find((i) => i.id === id);

  if (!idea) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <p className="text-5xl mb-4">🔍</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Idea not found</h1>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all ideas
        </Link>
      </div>
    );
  }

  const badgeClass = CATEGORY_COLORS[idea.category] ?? "bg-gray-100 text-gray-700";

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back link */}
      <div className="mb-5">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all ideas
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden">
        {/* Header stripe */}
        <div className="bg-gradient-to-r from-green-700 to-green-500 h-2" />

        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-4 sm:gap-6">
            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${badgeClass}`}>
                  {idea.category}
                </span>
                {idea.solved && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                    <CheckCircle2 className="w-4 h-4" />
                    Solved
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-5">
                {idea.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pb-6 mb-6 border-b border-gray-100">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-green-600" />
                  <span className="text-gray-500">Submitted by</span>
                  <span className="font-semibold text-gray-900">{idea.creator}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays className="w-4 h-4 text-green-600" />
                  <span className="text-gray-500">
                    {new Date(idea.createdAt).toLocaleDateString("de-DE", {
                      day: "2-digit", month: "long", year: "numeric",
                    })}
                  </span>
                </div>
                {idea.costs && (
                  <div className="flex items-center gap-2 text-sm">
                    <Banknote className="w-4 h-4 text-green-600" />
                    <span className="text-gray-500">Estimated:</span>
                    <span className="font-semibold text-green-700">{idea.costs}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h2 className="text-base font-bold text-gray-700 uppercase tracking-wider mb-3">
                  About this idea
                </h2>
                <p className="text-gray-700 leading-relaxed text-base sm:text-lg whitespace-pre-wrap">
                  {idea.subtitle}
                </p>
              </div>
            </div>

            {/* Vote widget */}
            <div className="flex flex-col items-center bg-green-50 border border-green-200 rounded-2xl px-3 py-4 sm:px-4 min-w-[4.5rem] flex-shrink-0">
              <button
                onClick={() => voteIdea(idea.id, 1)}
                className="p-2 rounded-xl text-gray-400 hover:text-green-600 hover:bg-green-100 transition-colors touch-manipulation"
                aria-label="Upvote"
              >
                <ThumbsUp className="w-6 h-6 sm:w-7 sm:h-7" />
              </button>
              <span className="text-2xl sm:text-3xl font-bold text-gray-800 my-2 tabular-nums">
                {idea.rating}
              </span>
              <button
                onClick={() => voteIdea(idea.id, -1)}
                className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors touch-manipulation"
                aria-label="Downvote"
              >
                <ThumbsDown className="w-6 h-6 sm:w-7 sm:h-7" />
              </button>
              <span className="mt-2 text-xs text-gray-400 font-medium">votes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
