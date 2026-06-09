"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useData } from "@/hooks/useData";
import { useToast } from "@/context/ToastContext";
import { IdeaCard } from "@/components/IdeaCard";
import { IdeaDetailModal } from "@/components/IdeaDetailModal";
import { WishesModal } from "@/components/WishesModal";
import { LeftSidebar } from "@/components/LeftSidebar";
import { IdeaForm } from "@/components/IdeaForm";
import { Idea } from "@/types";
import {
  Plus, LayoutGrid, Trophy, CheckCircle2,
  Tag, Lightbulb, Search, ArrowDownUp, X,
} from "lucide-react";

// Inner component that uses useSearchParams (must be inside Suspense)
function IdeaFindingPageInner() {
  const { ideas, addIdea, voteIdea, solveIdea, setInProgress, deleteIdea, userVotes, isLoaded } = useData();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"votes" | "newest">("votes");
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [wishesOpen, setWishesOpen] = useState(false);

  // Auto-open idea from ?idea= URL param
  useEffect(() => {
    if (!isLoaded) return;
    const ideaId = searchParams.get("idea");
    if (ideaId) {
      const found = ideas.find((i) => i.id === ideaId);
      if (found) setSelectedIdea(found);
    }
  }, [isLoaded, searchParams]);

  // Clear ?idea= param when modal closes
  const handleCloseModal = () => {
    setSelectedIdea(null);
    if (searchParams.get("idea")) {
      router.replace("/");
    }
  };

  const categories = useMemo(() => Array.from(new Set(ideas.map((i) => i.category))), [ideas]);

  const ideaCounts = useMemo(() => {
    const counts: Record<string, number> = { solved: 0 };
    for (const idea of ideas) {
      counts[idea.category] = (counts[idea.category] ?? 0) + 1;
      if (idea.solved) counts["solved"]++;
    }
    return counts;
  }, [ideas]);

  const filteredIdeas = useMemo(() => {
    let result = [...ideas];

    // Category / status filter
    if (activeFilter === "top10") {
      result.sort((a, b) => b.rating - a.rating);
      result = result.slice(0, 10);
    } else if (activeFilter === "solved") {
      result = result.filter((i) => i.solved);
    } else if (activeFilter !== "all") {
      result = result.filter((i) => i.category === activeFilter);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.subtitle.toLowerCase().includes(q) ||
          i.creator.toLowerCase().includes(q)
      );
    }

    // Sort (top10 already sorted above)
    if (activeFilter !== "top10") {
      result.sort((a, b) =>
        sortBy === "votes"
          ? b.rating - a.rating
          : b.createdAt - a.createdAt
      );
    }

    return result;
  }, [ideas, activeFilter, search, sortBy]);

  const headingLabel =
    activeFilter === "top10" ? "Top 10 Ideas" :
    activeFilter === "solved" ? "Solved Ideas" :
    activeFilter === "all" ? "All Ideas" :
    `${activeFilter} Ideas`;

  // Keep modal in sync with live Firestore updates
  const liveSelectedIdea = selectedIdea
    ? ideas.find((i) => i.id === selectedIdea.id) ?? null
    : null;

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center p-16">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <LeftSidebar
          categories={categories}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onOpenWishes={() => setWishesOpen(true)}
          ideaCounts={ideaCounts}
          totalCount={ideas.length}
        />
      </div>

      {/* Mobile filter chips */}
      <div className="md:hidden -mx-4 px-4 overflow-x-auto pb-1">
        <div className="flex items-center gap-2 w-max">
          {[
            { key: "all",    label: "All Ideas", icon: <LayoutGrid className="w-3.5 h-3.5" /> },
            { key: "top10",  label: "Top 10",    icon: <Trophy className="w-3.5 h-3.5" /> },
            { key: "solved", label: "Solved",    icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
            ...categories.map((c) => ({ key: c, label: c, icon: <Tag className="w-3.5 h-3.5" /> })),
          ].map((chip) => (
            <button
              key={chip.key}
              onClick={() => setActiveFilter(chip.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === chip.key
                  ? "bg-green-600 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-green-300 hover:text-green-700"
              }`}
            >
              {chip.icon}{chip.label}
            </button>
          ))}
          <button
            onClick={() => setWishesOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-white text-gray-600 border border-gray-200 hover:border-green-300 hover:text-green-700 transition-all"
          >
            <Lightbulb className="w-3.5 h-3.5" />Feature Wishes
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Page header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{headingLabel}</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {filteredIdeas.length} {filteredIdeas.length === 1 ? "idea" : "ideas"}
              {search && " matching your search"}
            </p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Idea</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {/* Search + sort bar */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ideas…"
              className="w-full pl-9 pr-8 py-2 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={() => setSortBy((s) => s === "votes" ? "newest" : "votes")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:border-green-400 hover:text-green-700 transition-all whitespace-nowrap"
            title="Toggle sort order"
          >
            <ArrowDownUp className="w-4 h-4" />
            <span className="hidden sm:inline">{sortBy === "votes" ? "Top Voted" : "Newest"}</span>
          </button>
        </div>

        {/* Cards */}
        <div className="space-y-3 sm:space-y-4">
          {filteredIdeas.length === 0 ? (
            <div className="bg-white rounded-xl border border-green-100 p-12 text-center">
              <p className="text-gray-400 font-medium">
                {search ? `No ideas matching "${search}".` : "No ideas found for this filter."}
              </p>
            </div>
          ) : (
            filteredIdeas.map((idea, index) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onVote={voteIdea}
                onOpen={setSelectedIdea}
                userVote={userVotes[idea.id] ?? 0}
                rank={index + 1}
              />
            ))
          )}
        </div>
      </div>

      {/* Idea detail modal */}
      {liveSelectedIdea && (
        <IdeaDetailModal
          idea={liveSelectedIdea}
          userVote={userVotes[liveSelectedIdea.id] ?? 0}
          onVote={voteIdea}
          onSolve={solveIdea}
          onSetInProgress={setInProgress}
          onDelete={deleteIdea}
          onClose={handleCloseModal}
        />
      )}

      {/* Feature Wishes modal */}
      {wishesOpen && <WishesModal onClose={() => setWishesOpen(false)} />}

      {/* New idea form modal */}
      {isFormOpen && (
        <IdeaForm
          onSubmit={(ideaData) => {
            addIdea(ideaData);
            setIsFormOpen(false);
            toast("Idea submitted!", "success");
          }}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}

// Wrap in Suspense so useSearchParams works with static export
export default function IdeaFindingPage() {
  return (
    <Suspense>
      <IdeaFindingPageInner />
    </Suspense>
  );
}
