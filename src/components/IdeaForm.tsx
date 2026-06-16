"use client";

import { useState, useEffect } from "react";
import { Idea } from "@/types";
import { X } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useT } from "@/context/LanguageContext";

interface IdeaFormProps {
  onSubmit: (idea: Omit<Idea, "id" | "rating" | "solved" | "createdAt">) => Promise<void>;
  onCancel: () => void;
}

const inputClass =
  "mt-1 block w-full rounded-lg border border-gray-200 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500/20 sm:text-sm p-2.5 bg-white outline-none transition-all";
const labelClass = "block text-sm font-semibold text-gray-700";

export function IdeaForm({ onSubmit, onCancel }: IdeaFormProps) {
  const { username } = useUser();
  const t = useT();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [creator, setCreator] = useState(username);

  // Sync creator once username loads from localStorage
  useEffect(() => {
    if (username && !creator) setCreator(username);
  }, [username]);
  const [category, setCategory] = useState("Community");
  const [customCategory, setCustomCategory] = useState("");
  const [costs, setCosts] = useState("");

  const handleCostsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\./g, "").replace(/\D/g, "");
    if (raw === "") { setCosts(""); return; }
    const num = parseInt(raw, 10);
    if (!isNaN(num)) setCosts(num.toLocaleString("de-DE"));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = category === "Other" ? customCategory.trim() || "Other" : category;
    if (!title || !subtitle || !creator || !finalCategory) return;
    await onSubmit({ title, subtitle, creator, category: finalCategory, costs: costs || undefined });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">{t("proposeNewIdea")}</h2>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className={labelClass}>{t("titleLabel")}</label>
            <input
              type="text"
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              placeholder={t("titlePlaceholder")}
            />
          </div>

          <div>
            <label htmlFor="subtitle" className={labelClass}>{t("descriptionLabel")}</label>
            <textarea
              id="subtitle"
              required
              rows={3}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className={inputClass}
              placeholder={t("descriptionPlaceholder")}
            />
          </div>

          <div>
            <label htmlFor="creator" className={labelClass}>
              {t("yourNameField")}
              {username && (
                <span className="ml-2 text-xs font-normal text-green-600">{t("fromYourProfile")}</span>
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
              <label htmlFor="category" className={labelClass}>{t("categoryLabel")}</label>
              <select
                id="category"
                value={category}
                onChange={(e) => { setCategory(e.target.value); setCustomCategory(""); }}
                className={inputClass}
              >
                <option value="Community">Community</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Environment">Environment</option>
                <option value="Events">Events</option>
                <option value="Other">Other…</option>
              </select>
              {category === "Other" && (
                <input
                  type="text"
                  autoFocus
                  required
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className={inputClass + " mt-2"}
                  placeholder={t("enterCategory")}
                />
              )}
            </div>
            <div>
              <label htmlFor="costs" className={labelClass}>{t("amountEur")}</label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">€</span>
                <input
                  type="text"
                  id="costs"
                  value={costs}
                  onChange={handleCostsChange}
                  className="block w-full rounded-lg border border-gray-200 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500/20 sm:text-sm pl-7 pr-3 py-2.5 bg-white outline-none transition-all"
                  placeholder="5.000"
                  inputMode="numeric"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
            >
              {t("submitIdea")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
