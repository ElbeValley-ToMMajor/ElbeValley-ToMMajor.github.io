"use client";

import { useState, useMemo } from "react";
import { useData } from "@/hooks/useData";
import { IdeaCard } from "@/components/IdeaCard";
import { LeftSidebar } from "@/components/LeftSidebar";
import { IdeaForm } from "@/components/IdeaForm";
import { Plus, LayoutGrid, Trophy, CheckCircle2, Tag, Lightbulb } from "lucide-react";
import Link from "next/link";

export default function IdeaFindingPage() {
  const { ideas, addIdea, voteIdea, userVotes, isLoaded } = useData();
  const [activeFilter, setActiveFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(ideas.map((idea) => idea.category));
    return Array.from(cats);
  }, [ideas]);

  // Counts for sidebar badges
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

    if (activeFilter === "top10") {
      result.sort((a, b) => b.rating - a.rating);
      result = result.slice(0, 10);
    } else if (activeFilter === "solved") {
      result = result.filter((idea) => idea.solved);
    } else if (activeFilter !== "all") {
      result = result.filter((idea) => idea.category === activeFilter);
    }

    if (activeFilter !== "top10") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [ideas, activeFilter]);

  const headingLabel =
    activeFilter === "top10" ? "Top 10 Ideas" :
    activeFilter === "solved" ? "Solved Ideas" :
    activeFilter === "all" ? "All Ideas" :
    `${activeFilter} Ideas`;

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
              {chip.icon}
              {chip.label}
            </button>
          ))}
          {/* Feature Wishes – navigates to /wishes */}
          <Link
            href="/wishes"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-white text-gray-600 border border-gray-200 hover:border-green-300 hover:text-green-700 transition-all"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            Feature Wishes
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Page header */}
        <div className="flex justify-between items-center mb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{headingLabel}</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {filteredIdeas.length} {filteredIdeas.length === 1 ? "idea" : "ideas"}
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

        {/* Cards */}
        <div className="space-y-3 sm:space-y-4">
          {filteredIdeas.length === 0 ? (
            <div className="bg-white rounded-xl border border-green-100 p-12 text-center">
              <p className="text-gray-400 font-medium">No ideas found for this filter.</p>
            </div>
          ) : (
            filteredIdeas.map((idea, index) => (
              <IdeaCard key={idea.id} idea={idea} onVote={voteIdea} userVote={userVotes[idea.id] ?? 0} rank={index + 1} />
            ))
          )}
        </div>
      </div>

      {/* Form modal */}
      {isFormOpen && (
        <IdeaForm
          onSubmit={(ideaData) => {
            addIdea(ideaData);
            setIsFormOpen(false);
          }}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
