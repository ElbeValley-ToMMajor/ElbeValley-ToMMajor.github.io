"use client";

import { useState } from "react";
import { Idea } from "@/types";
import { useAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/context/ToastContext";
import { AdminSolveModal } from "@/components/AdminSolveModal";
import { formatCosts } from "@/lib/formatCosts";
import {
  X, ThumbsUp, ThumbsDown, CheckCircle2, Clock,
  CalendarDays, Banknote, User, ShieldCheck,
  Trash2, Share2, Check,
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
  onVote:          (id: string, direction: 1 | -1) => void;
  onSolve:         (id: string, solutionText: string, imageFile?: File) => Promise<void>;
  onSetInProgress: (id: string, value: boolean, note?: string, percent?: number) => Promise<void>;
  onDelete:        (id: string) => Promise<void>;
  onClose: () => void;
}

/** Thin progress bar shown to all users when an idea has progress data. */
function ProgressBar({ percent, note, solved }: { percent: number; note?: string; solved?: boolean }) {
  const pct = Math.min(100, Math.max(0, percent));
  return (
    <div className={`mt-6 p-4 rounded-xl border ${solved ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-bold uppercase tracking-wider ${solved ? "text-green-700" : "text-blue-700"}`}>
          {solved ? "Completed" : "Progress"}
        </span>
        <span className={`text-sm font-bold tabular-nums ${solved ? "text-green-700" : "text-blue-700"}`}>
          {pct}%
        </span>
      </div>
      <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-gray-200">
        <div
          className={`h-full rounded-full transition-all duration-500 ${solved ? "bg-green-500" : "bg-blue-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {note && (
        <p className={`mt-2 text-sm leading-relaxed ${solved ? "text-green-800" : "text-blue-800"}`}>
          {note}
        </p>
      )}
    </div>
  );
}

export function IdeaDetailModal({
  idea, userVote, onVote, onSolve, onSetInProgress, onDelete, onClose,
}: IdeaDetailModalProps) {
  const { isAdmin } = useAdmin();
  const { toast } = useToast();

  const [solveOpen, setSolveOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [copied, setCopied] = useState(false);

  // Inline "Mark In Progress" form state
  const [progressFormOpen, setProgressFormOpen] = useState(false);
  const [progressNote, setProgressNote] = useState(idea.progressNote ?? "");
  const [progressPercent, setProgressPercent] = useState(idea.progressPercent ?? 0);
  const [savingProgress, setSavingProgress] = useState(false);

  const badgeClass = CATEGORY_COLORS[idea.category] ?? "bg-gray-100 text-gray-700";

  const handleVote = (dir: 1 | -1) => {
    onVote(idea.id, dir);
    toast(dir === 1 ? "Upvote saved!" : "Downvote saved!", "success");
  };

  const handleShare = () => {
    const url = `${window.location.origin}${window.location.pathname}?idea=${idea.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast("Link copied to clipboard!", "info");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDelete = async () => {
    await onDelete(idea.id);
    toast("Idea deleted.", "info");
    onClose();
  };

  const handleSaveProgress = async () => {
    setSavingProgress(true);
    await onSetInProgress(idea.id, true, progressNote, progressPercent);
    setSavingProgress(false);
    setProgressFormOpen(false);
    toast("Progress updated.", "info");
  };

  const handleUndoInProgress = async () => {
    await onSetInProgress(idea.id, false);
    setProgressFormOpen(false);
    toast("Marked as Open.", "info");
  };

  // Show progress bar if there's meaningful progress data
  const showProgress =
    (idea.inProgress || idea.solved) &&
    typeof idea.progressPercent === "number" &&
    idea.progressPercent >= 0;

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
          <div className={`h-2 rounded-t-2xl ${
            idea.solved      ? "bg-gradient-to-r from-green-700 to-green-400" :
            idea.inProgress  ? "bg-gradient-to-r from-blue-600 to-blue-400"  :
                               "bg-gradient-to-r from-green-700 to-green-500"
          }`} />

          <div className="p-6 sm:p-8">
            {/* Header row */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${badgeClass}`}>
                  {idea.category}
                </span>
                {idea.solved && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                    <CheckCircle2 className="w-4 h-4" />Solved
                  </span>
                )}
                {!idea.solved && idea.inProgress && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                    <Clock className="w-4 h-4" />In Progress
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={handleShare} title="Copy shareable link"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
                </button>
                <button onClick={onClose}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
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

            {/* Description + vote */}
            <div className="flex items-start gap-6">
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">About this idea</h3>
                <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap">{idea.subtitle}</p>
              </div>

              {/* Vote widget */}
              <div className="flex flex-col items-center flex-shrink-0 bg-green-50 border border-green-200 rounded-2xl px-3 py-4 sm:px-4 min-w-[4.5rem]">
                <button onClick={() => handleVote(1)}
                  className={`p-2 rounded-xl transition-colors touch-manipulation ${userVote === 1 ? "text-green-600 bg-green-100" : "text-gray-400 hover:text-green-600 hover:bg-green-100"}`}
                  aria-label="Upvote">
                  <ThumbsUp className="w-6 h-6" />
                </button>
                <span className="text-2xl font-bold text-gray-800 my-2 tabular-nums">{idea.rating}</span>
                <button onClick={() => handleVote(-1)}
                  className={`p-2 rounded-xl transition-colors touch-manipulation ${userVote === -1 ? "text-red-500 bg-red-50" : "text-gray-400 hover:text-red-500 hover:bg-red-50"}`}
                  aria-label="Downvote">
                  <ThumbsDown className="w-6 h-6" />
                </button>
                <span className="mt-2 text-xs text-gray-400 font-medium">votes</span>
              </div>
            </div>

            {/* Progress bar — visible to all users */}
            {showProgress && (
              <ProgressBar
                percent={idea.progressPercent!}
                note={idea.progressNote}
                solved={idea.solved}
              />
            )}

            {/* Solution section */}
            {idea.solved && (idea.solutionText || idea.solutionImageUrl) && (
              <div className="mt-6 p-5 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <h3 className="text-sm font-bold text-green-800 uppercase tracking-wider">Solution</h3>
                </div>
                {idea.solutionText && (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">{idea.solutionText}</p>
                )}
                {idea.solutionImageUrl && (
                  <img src={idea.solutionImageUrl} alt="Solution"
                    className="rounded-xl w-full max-h-80 object-cover border border-green-100" />
                )}
              </div>
            )}

            {/* ── Admin section ── */}
            {isAdmin && (
              <div className="mt-6 pt-5 border-t border-gray-100">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Admin
                  </span>

                  {/* Open → show progress form */}
                  {!idea.solved && !idea.inProgress && (
                    <button
                      onClick={() => { setProgressNote(""); setProgressPercent(0); setProgressFormOpen(true); }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                    >
                      <Clock className="w-4 h-4" /> Mark In Progress
                    </button>
                  )}

                  {/* In progress → edit progress or undo */}
                  {!idea.solved && idea.inProgress && !progressFormOpen && (
                    <>
                      <button
                        onClick={() => { setProgressNote(idea.progressNote ?? ""); setProgressPercent(idea.progressPercent ?? 0); setProgressFormOpen(true); }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                      >
                        <Clock className="w-4 h-4" /> Edit Progress
                      </button>
                      <button
                        onClick={handleUndoInProgress}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        Undo In Progress
                      </button>
                    </>
                  )}

                  {!idea.solved && (
                    <button
                      onClick={() => setSolveOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Mark as Solved
                    </button>
                  )}

                  {/* Delete */}
                  {!confirmDelete ? (
                    <button onClick={() => setConfirmDelete(true)}
                      className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  ) : (
                    <div className="ml-auto flex items-center gap-2">
                      <span className="text-xs text-red-600 font-medium">Sure?</span>
                      <button onClick={handleDelete}
                        className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors">
                        Yes, delete
                      </button>
                      <button onClick={() => setConfirmDelete(false)}
                        className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Inline progress form */}
                {progressFormOpen && !idea.solved && (
                  <div className="mt-3 p-4 bg-blue-50 rounded-xl border border-blue-200 space-y-4">
                    {/* % slider + numeric input */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-sm font-semibold text-blue-800">Progress</label>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min={0} max={99}
                            value={progressPercent}
                            onChange={(e) => setProgressPercent(Math.min(99, Math.max(0, Number(e.target.value))))}
                            className="w-14 text-center border border-blue-300 rounded-lg px-2 py-1 text-sm font-bold text-blue-800 bg-white outline-none focus:border-blue-500"
                          />
                          <span className="text-sm font-bold text-blue-800">%</span>
                        </div>
                      </div>
                      <input
                        type="range"
                        min={0} max={99}
                        value={progressPercent}
                        onChange={(e) => setProgressPercent(Number(e.target.value))}
                        className="w-full accent-blue-600"
                      />
                    </div>

                    {/* Note field */}
                    <div>
                      <label className="text-sm font-semibold text-blue-800 block mb-1">Status Note</label>
                      <textarea
                        rows={2}
                        value={progressNote}
                        onChange={(e) => setProgressNote(e.target.value)}
                        placeholder="e.g., Funding approved, procurement started…"
                        className="w-full rounded-lg border border-blue-300 px-3 py-2 text-sm bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setProgressFormOpen(false)}
                        className="flex-1 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProgress}
                        disabled={savingProgress}
                        className="flex-1 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {savingProgress ? "Saving…" : "Save Progress"}
                      </button>
                    </div>
                  </div>
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
            toast("Idea marked as solved!", "success");
          }}
          onCancel={() => setSolveOpen(false)}
        />
      )}
    </>
  );
}
