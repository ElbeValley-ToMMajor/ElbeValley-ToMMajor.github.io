"use client";

import { useState, useEffect } from "react";
import { Idea } from "@/types";
import { X } from "lucide-react";
import { useUser } from "@/hooks/useUser";

interface IdeaFormProps {
  onSubmit: (idea: Omit<Idea, "id" | "rating" | "solved" | "createdAt">) => void;
  onCancel: () => void;
}

const inputClass =
  "mt-1 block w-full rounded-lg border border-gray-200 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500/20 sm:text-sm p-2.5 bg-white outline-none transition-all";
const labelClass = "block text-sm font-semibold text-gray-700";

export function IdeaForm({ onSubmit, onCancel }: IdeaFormProps) {
  const { username } = useUser();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [creator, setCreator] = useState(username);

  // Sync creator once username loads from localStorage
  useEffect(() => {
    if (username && !creator) setCreator(username);
  }, [username]);
  const [category, setCategory] = useState("Community");
  const [costs, setCosts] = useState("");

  const handleCostsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\./g, "").replace(/\D/g, "");
    if (raw === "") { setCosts(""); return; }
    const num = parseInt(raw, 10);
    if (!isNaN(num)) setCosts(num.toLocaleString("de-DE"));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subtitle || !creator || !category) return;
    onSubmit({ title, subtitle, creator, category, costs: costs || undefined });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Propose a New Idea</h2>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className={labelClass}>Title *</label>
            <input
              type="text"
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              placeholder="e.g., New cycling path on Elbestraße"
            />
          </div>

          <div>
            <label htmlFor="subtitle" className={labelClass}>Description *</label>
            <textarea
              id="subtitle"
              required
              rows={3}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className={inputClass}
              placeholder="Describe your idea in more detail..."
            />
          </div>

          <div>
            <label htmlFor="creator" className={labelClass}>
              Your Name *
              {username && (
                <span className="ml-2 text-xs font-normal text-green-600">(from your profile)</span>
              )}
            </label>
            <input
              type="text"
              id="creator"
              required
              value={creator}
              onChange={(e) => setCreator(e.target.value)}
              className={inputClass}
              placeholder="Maria Muster"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className={labelClass}>Category *</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputClass}
              >
                <option value="Community">Community</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Environment">Environment</option>
                <option value="Events">Events</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="costs" className={labelClass}>Est. Costs</label>
              <input
                type="text"
                id="costs"
                value={costs}
                onChange={handleCostsChange}
                className={inputClass}
                placeholder="z.B. 5.000"
                inputMode="numeric"
              />
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
            >
              Submit Idea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
