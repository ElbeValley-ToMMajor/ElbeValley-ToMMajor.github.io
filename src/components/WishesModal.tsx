"use client";

import { useState, useMemo } from "react";
import { useWishes } from "@/hooks/useWishes";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/context/ToastContext";
import { useT } from "@/context/LanguageContext";
import { WishCard } from "@/components/WishCard";
import { X, Plus, Lightbulb, Check, CheckCircle2 } from "lucide-react";

const inputClass =
  "mt-1 block w-full rounded-lg border border-gray-200 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500/20 sm:text-sm p-2.5 bg-white outline-none transition-all";
const labelClass = "block text-sm font-semibold text-gray-700";

interface WishesModalProps {
  onClose: () => void;
}

export function WishesModal({ onClose }: WishesModalProps) {
  const { wishes, addWish, voteWish, solveWish, userVotes, isLoaded } = useWishes();
  const { username } = useUser();
  const { toast } = useToast();
  const t = useT();

  const [tab, setTab] = useState<"open" | "solved">("open");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creator, setCreator] = useState(username);

  const openWishes   = useMemo(() => wishes.filter((w) => !w.solved).sort((a, b) => b.rating - a.rating), [wishes]);
  const solvedWishes = useMemo(() => wishes.filter((w) =>  w.solved).sort((a, b) => b.rating - a.rating), [wishes]);
  const displayed    = tab === "open" ? openWishes : solvedWishes;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !creator) return;
    addWish({ title, description, creator });
    toast(t("wishSubmitted"), "success");
    setTitle(""); setDescription(""); setCreator(username);
    setIsFormOpen(false);
  };

  const handleVote = (id: string, dir: 1 | -1) => {
    voteWish(id, dir);
    toast(dir === 1 ? t("upvoteSaved") : t("downvoteSaved"), "success");
  };

  const handleSolve = async (id: string, solutionText: string) => {
    await solveWish(id, solutionText);
    toast(t("wishImplemented"), "success");
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
            <h2 className="text-xl font-bold text-gray-900">{t("featureWishes")}</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {t("featureWishesSubtitle")}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => { setCreator(username); setIsFormOpen(true); }}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">{t("addWish")}</span>
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-5 sm:px-6 pt-4">
          <button
            onClick={() => setTab("open")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === "open"
                ? "bg-green-600 text-white shadow-sm"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            {t("open")}
            <span className={`text-xs rounded-full px-1.5 py-0.5 font-semibold ${tab === "open" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-500"}`}>
              {openWishes.length}
            </span>
          </button>
          <button
            onClick={() => setTab("solved")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === "solved"
                ? "bg-green-600 text-white shadow-sm"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {t("implemented")}
            <span className={`text-xs rounded-full px-1.5 py-0.5 font-semibold ${tab === "solved" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-500"}`}>
              {solvedWishes.length}
            </span>
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 px-5 sm:px-6 py-4 space-y-3">
          {!isLoaded ? (
            <div className="flex justify-center py-10">
              <div className="w-7 h-7 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : displayed.length === 0 ? (
            <div className="text-center py-12 text-gray-400 font-medium">
              {tab === "open" ? t("noOpenWishes") : t("noImplementedWishes")}
            </div>
          ) : (
            displayed.map((wish, i) => (
              <WishCard
                key={wish.id}
                wish={wish}
                onVote={handleVote}
                onSolve={handleSolve}
                userVote={userVotes[wish.id] ?? 0}
                rank={i + 1}
              />
            ))
          )}
        </div>

        {/* Inline add form */}
        {isFormOpen && (
          <div className="border-t border-gray-100 p-5 sm:p-6 bg-gray-50 rounded-b-2xl">
            <h3 className="text-sm font-bold text-gray-700 mb-4">{t("suggestFeature")}</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className={labelClass}>{t("titleField")}</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder={t("wishTitlePlaceholder")} />
              </div>
              <div>
                <label className={labelClass}>{t("descriptionField")}</label>
                <textarea required rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} placeholder={t("whyUseful")} />
              </div>
              <div>
                <label className={labelClass}>{t("yourName")}</label>
                <input type="text" required value={creator} onChange={(e) => setCreator(e.target.value)} className={inputClass} placeholder="Maria Muster" />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">{t("cancel")}</button>
                <button type="submit" className="flex-1 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4" /> {t("submit")}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
