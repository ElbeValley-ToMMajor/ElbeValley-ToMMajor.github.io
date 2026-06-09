"use client";

import { useState } from "react";
import { FeatureWish } from "@/types";
import { ThumbsUp, ThumbsDown, CalendarDays, CheckCircle2, ShieldCheck, X, Check, Loader2 } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";

interface WishCardProps {
  wish: FeatureWish;
  onVote:  (id: string, direction: 1 | -1) => void;
  onSolve: (id: string, solutionText: string) => Promise<void>;
  userVote?: 1 | -1 | 0;
  rank: number;
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("de-DE", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export function WishCard({ wish, onVote, onSolve, userVote = 0, rank }: WishCardProps) {
  const { isAdmin } = useAdmin();
  const [solveOpen, setSolveOpen] = useState(false);
  const [solutionText, setSolutionText] = useState("");
  const [saving, setSaving] = useState(false);

  const rankColor =
    rank === 1 ? "text-yellow-500 border-yellow-400 bg-yellow-50" :
    rank === 2 ? "text-gray-400 border-gray-300 bg-gray-50" :
    rank === 3 ? "text-orange-400 border-orange-300 bg-orange-50" :
    "text-gray-300 border-gray-200 bg-white";

  const handleSolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!solutionText.trim()) return;
    setSaving(true);
    await onSolve(wish.id, solutionText.trim());
    setSaving(false);
    setSolveOpen(false);
  };

  return (
    <div className={`bg-white rounded-xl border shadow-sm transition-all duration-200 p-4 sm:p-5 ${
      wish.solved ? "border-green-200 bg-green-50/30" : "border-green-100 hover:shadow-md hover:border-green-300"
    }`}>
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Rank */}
        <div className={`hidden sm:flex flex-shrink-0 w-10 h-10 rounded-full border-2 items-center justify-center text-sm font-bold ${rankColor}`}>
          #{rank}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title + solved badge */}
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug line-clamp-2">
              {wish.title}
            </h3>
            {wish.solved && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 flex-shrink-0">
                <CheckCircle2 className="w-3 h-3" /> Implemented
              </span>
            )}
          </div>

          <p className="mt-1 text-sm text-gray-500 line-clamp-3 leading-relaxed">
            {wish.description}
          </p>

          {/* Solution text */}
          {wish.solved && wish.solutionText && (
            <div className="mt-3 p-3 bg-green-100 rounded-lg border border-green-200">
              <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1">How it was implemented</p>
              <p className="text-sm text-green-900 leading-relaxed">{wish.solutionText}</p>
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
            <span className="font-semibold text-gray-700">{wish.creator}</span>
            <span className="flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5" />
              {formatDate(wish.createdAt)}
            </span>
            {/* Admin solve button */}
            {isAdmin && !wish.solved && (
              <button
                onClick={() => setSolveOpen(true)}
                className="ml-auto flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors"
              >
                <ShieldCheck className="w-3 h-3" /> Mark Implemented
              </button>
            )}
          </div>

          {/* Inline solve form */}
          {solveOpen && (
            <form onSubmit={handleSolve} className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Implementation Note</span>
                <button type="button" onClick={() => setSolveOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <textarea
                autoFocus
                required
                rows={2}
                value={solutionText}
                onChange={(e) => setSolutionText(e.target.value)}
                placeholder="Describe how this was implemented…"
                className="w-full rounded-lg border border-amber-300 px-3 py-2 text-sm bg-white outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setSolveOpen(false)}
                  className="flex-1 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving || !solutionText.trim()}
                  className="flex-1 py-1.5 text-xs font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1">
                  {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                  {saving ? "Saving…" : "Confirm"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Vote widget — hidden when solved */}
        {!wish.solved && (
          <div className="flex flex-col items-center flex-shrink-0 bg-green-50 border border-green-200 rounded-xl px-2 py-2 sm:px-3 min-w-[3rem] sm:min-w-[3.5rem]">
            <button onClick={() => onVote(wish.id, 1)}
              className={`p-1.5 rounded-lg transition-colors touch-manipulation ${userVote === 1 ? "text-green-600 bg-green-100" : "text-gray-400 hover:text-green-600 hover:bg-green-100"}`}
              aria-label="Upvote">
              <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <span className="text-base sm:text-lg font-bold text-gray-800 my-1 tabular-nums">{wish.rating}</span>
            <button onClick={() => onVote(wish.id, -1)}
              className={`p-1.5 rounded-lg transition-colors touch-manipulation ${userVote === -1 ? "text-red-500 bg-red-50" : "text-gray-400 hover:text-red-500 hover:bg-red-50"}`}
              aria-label="Downvote">
              <ThumbsDown className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
