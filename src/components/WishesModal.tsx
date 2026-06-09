"use client";

import { useState, useMemo } from "react";
import { useWishes } from "@/hooks/useWishes";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/context/ToastContext";
import { WishCard } from "@/components/WishCard";
import { X, Plus, Lightbulb, Check } from "lucide-react";

const inputClass =
  "mt-1 block w-full rounded-lg border border-gray-200 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500/20 sm:text-sm p-2.5 bg-white outline-none transition-all";
const labelClass = "block text-sm font-semibold text-gray-700";

interface WishesModalProps {
  onClose: () => void;
}

export function WishesModal({ onClose }: WishesModalProps) {
  const { wishes, addWish, voteWish, userVotes, isLoaded } = useWishes();
  const { username } = useUser();
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creator, setCreator] = useState(username);

  const sorted = useMemo(() => [...wishes].sort((a, b) => b.rating - a.rating), [wishes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !creator) return;
    addWish({ title, description, creator });
    toast("Feature wish submitted!", "success");
    setTitle("");
    setDescription("");
    setCreator(username);
    setIsFormOpen(false);
  };

  const handleVote = (id: string, dir: 1 | -1) => {
    voteWish(id, dir);
    toast(dir === 1 ? "Upvote saved!" : "Downvote saved!", "success");
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 to-green-500 h-2 rounded-t-2xl" />
        <div className="p-5 sm:p-6 flex items-start gap-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-5 h-5 text-green-700" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-900">Feature Wishes</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Suggest improvements and vote on what matters most.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => { setCreator(username); setIsFormOpen(true); }}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Wish</span>
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-3">
          {!isLoaded ? (
            <div className="flex justify-center py-10">
              <div className="w-7 h-7 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-12 text-gray-400 font-medium">
              No wishes yet. Be the first!
            </div>
          ) : (
            sorted.map((wish, i) => (
              <WishCard key={wish.id} wish={wish} onVote={handleVote} userVote={userVotes[wish.id] ?? 0} rank={i + 1} />
            ))
          )}
        </div>

        {/* Inline add form */}
        {isFormOpen && (
          <div className="border-t border-gray-100 p-5 sm:p-6 bg-gray-50 rounded-b-2xl">
            <h3 className="text-sm font-bold text-gray-700 mb-4">Suggest a Feature</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className={labelClass}>Title *</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="e.g., Dark mode support" />
              </div>
              <div>
                <label className={labelClass}>Description *</label>
                <textarea required rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} placeholder="Why would this be useful?" />
              </div>
              <div>
                <label className={labelClass}>Your Name *</label>
                <input type="text" required value={creator} onChange={(e) => setCreator(e.target.value)} className={inputClass} placeholder="Maria Muster" />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4" /> Submit
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
