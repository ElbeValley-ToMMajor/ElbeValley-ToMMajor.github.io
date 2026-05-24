"use client";

import { useState, useMemo } from "react";
import { useWishes } from "@/hooks/useWishes";
import { useUser } from "@/hooks/useUser";
import { WishCard } from "@/components/WishCard";
import { Plus, Lightbulb, ArrowLeft, X, Check } from "lucide-react";
import Link from "next/link";

const inputClass =
  "mt-1 block w-full rounded-lg border border-gray-200 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500/20 sm:text-sm p-2.5 bg-white outline-none transition-all";
const labelClass = "block text-sm font-semibold text-gray-700";

export default function WishesPage() {
  const { wishes, addWish, voteWish, isLoaded } = useWishes();
  const { username } = useUser();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creator, setCreator] = useState(username);

  const sorted = useMemo(
    () => [...wishes].sort((a, b) => b.rating - a.rating),
    [wishes]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !creator) return;
    addWish({ title, description, creator });
    setTitle("");
    setDescription("");
    setCreator(username);
    setIsFormOpen(false);
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center p-16">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back */}
      <div className="mb-5">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to ideas
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-green-700 to-green-500 h-2" />
        <div className="p-5 sm:p-6 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-6 h-6 text-green-700" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Feature Wishes</h1>
            <p className="mt-1 text-sm text-gray-500">
              Help shape this platform. Suggest improvements, vote on what matters most — the top-ranked wishes guide our roadmap.
            </p>
          </div>
          <button
            onClick={() => { setCreator(username); setIsFormOpen(true); }}
            className="flex-shrink-0 inline-flex items-center gap-2 px-3 py-2 sm:px-4 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Wish</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Count */}
      <p className="text-sm text-gray-500 mb-4 px-1">
        {sorted.length} {sorted.length === 1 ? "wish" : "wishes"} — sorted by votes
      </p>

      {/* Cards */}
      <div className="space-y-3 sm:space-y-4">
        {sorted.length === 0 ? (
          <div className="bg-white rounded-xl border border-green-100 p-12 text-center">
            <p className="text-gray-400 font-medium">No wishes yet. Be the first to suggest something!</p>
          </div>
        ) : (
          sorted.map((wish, index) => (
            <WishCard key={wish.id} wish={wish} onVote={voteWish} rank={index + 1} />
          ))
        )}
      </div>

      {/* Form modal */}
      {isFormOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={(e) => { if (e.target === e.currentTarget) setIsFormOpen(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Suggest a Feature</h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={labelClass}>Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={inputClass}
                  placeholder="e.g., Dark mode support"
                />
              </div>
              <div>
                <label className={labelClass}>Description *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={inputClass}
                  placeholder="Explain what you'd like and why it would be useful..."
                />
              </div>
              <div>
                <label className={labelClass}>
                  Your Name *
                  {username && (
                    <span className="ml-2 text-xs font-normal text-green-600">(from your profile)</span>
                  )}
                </label>
                <input
                  type="text"
                  required
                  value={creator}
                  onChange={(e) => setCreator(e.target.value)}
                  className={inputClass}
                  placeholder="Maria Muster"
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
