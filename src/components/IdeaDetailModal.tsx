"use client";

import { useState } from "react";
import { Idea } from "@/types";
import { useAdmin } from "@/hooks/useAdmin";
import { AdminSolveModal } from "@/components/AdminSolveModal";
import { formatCosts } from "@/lib/formatCosts";
import {
  X, ThumbsUp, ThumbsDown, CheckCircle2,
  CalendarDays, Banknote, User, ShieldCheck,
} from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
  Infrastructure: "bg-blue-100 text-blue-800",
  Environment:    "bg-emerald-100 text-emerald-800",
  Community:      "bg-purple-100 text-purple-800",
  Events:         "bg-orange-100 text-orange-800",
  Other:          "bg-gray-100 text-gray-700",
};

interface IdeaDetailModalProps {
  idea: Idea;
  userVote: 1 | -1 | 0;
  onVote: (id: string, direction: 1 | -1) => void;
  onSolve: (id: string, solutionText: string, imageFile?: File) => Promise<void>;
  onClose: () => void;
}

export function IdeaDetailModal({ idea, userVote, onVote, onSolve, onClose }: IdeaDetailModalProps) {
  const { isAdmin } = useAdmin();
  const [solveOpen, setSolveOpen] = useState(false);

  const badgeClass = CATEGORY_COLORS[idea.category] ?? "bg-gray-100 text-gray-700";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal panel */}
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top colour bar */}
          <div className={`h-2 rounded-t-2xl ${idea.solved ? "bg-gradient-to-r from-green-700 to-green-400" : "bg-gradient-to-r from-green-700 to-green-500"}`} />

          <div className="p-6 sm:p-8">
            {/* Header row */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${badgeClass}`}>
                  {idea.category}
                </span>
                {idea.solved && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                    <CheckCircle2 className="w-4 h-4" />
                    Solved
                  </span>
                )}
                {isAdmin && !idea.solved && (
                  <button
                    onClick={() => setSolveOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Mark as Solved
                  </button>
                )}
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-5">
              {idea.title}
            </h2>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pb-5 mb-5 border-b border-gray-100 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-green-600" />
                <span className="text-gray-500">by</span>
                <span className="font-semibold text-gray-900">{idea.creator}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <CalendarDays className="w-4 h-4 text-green-600" />
                {new Date(idea.createdAt).toLocaleDateString("de-DE", {
                  day: "2-digit", month: "long", year: "numeric",
                })}
              </div>
              {idea.costs && (
                <div className="flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-700">{formatCosts(idea.costs)}</span>
                </div>
              )}
            </div>

            {/* Description + vote side by side */}
            <div className="flex items-start gap-6">
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">About this idea</h3>
                <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap">
                  {idea.subtitle}
                </p>
              </div>

              {/* Vote widget */}
              <div className="flex flex-col items-center flex-shrink-0 bg-green-50 border border-green-200 rounded-2xl px-3 py-4 sm:px-4 min-w-[4.5rem]">
                <button
                  onClick={() => onVote(idea.id, 1)}
                  className={`p-2 rounded-xl transition-colors touch-manipulation ${
                    userVote === 1 ? "text-green-600 bg-green-100" : "text-gray-400 hover:text-green-600 hover:bg-green-100"
                  }`}
                  aria-label="Upvote"
                >
                  <ThumbsUp className="w-6 h-6" />
                </button>
                <span className="text-2xl font-bold text-gray-800 my-2 tabular-nums">{idea.rating}</span>
                <button
                  onClick={() => onVote(idea.id, -1)}
                  className={`p-2 rounded-xl transition-colors touch-manipulation ${
                    userVote === -1 ? "text-red-500 bg-red-50" : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                  }`}
                  aria-label="Downvote"
                >
                  <ThumbsDown className="w-6 h-6" />
                </button>
                <span className="mt-2 text-xs text-gray-400 font-medium">votes</span>
              </div>
            </div>

            {/* Solution section */}
            {idea.solved && (idea.solutionText || idea.solutionImageUrl) && (
              <div className="mt-6 p-5 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <h3 className="text-sm font-bold text-green-800 uppercase tracking-wider">Solution</h3>
                </div>
                {idea.solutionText && (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
                    {idea.solutionText}
                  </p>
                )}
                {idea.solutionImageUrl && (
                  <img
                    src={idea.solutionImageUrl}
                    alt="Solution"
                    className="rounded-xl w-full max-h-80 object-cover border border-green-100"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Admin solve modal */}
      {solveOpen && (
        <AdminSolveModal
          ideaTitle={idea.title}
          onConfirm={async (text, file) => {
            await onSolve(idea.id, text, file);
            setSolveOpen(false);
          }}
          onCancel={() => setSolveOpen(false)}
        />
      )}
    </>
  );
}
