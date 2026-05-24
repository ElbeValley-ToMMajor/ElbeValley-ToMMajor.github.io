"use client";

import { LayoutGrid, Trophy, CheckCircle2, Tag, Lightbulb } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface LeftSidebarProps {
  categories: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  ideaCounts: Record<string, number>;
  totalCount: number;
}

export function LeftSidebar({
  categories,
  activeFilter,
  onFilterChange,
  ideaCounts,
  totalCount,
}: LeftSidebarProps) {
  const pathname = usePathname();

  const baseBtn =
    "w-full group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all";
  const activeBtn = "bg-green-600 text-white shadow-sm";
  const inactiveBtn = "text-gray-600 hover:bg-green-50 hover:text-green-800";

  return (
    <div className="w-56 flex-shrink-0">
      <nav className="space-y-6">
        {/* Discover */}
        <div>
          <h3 className="px-3 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
            Discover
          </h3>
          <div className="space-y-1">
            <button
              onClick={() => onFilterChange("top10")}
              className={`${baseBtn} ${activeFilter === "top10" && pathname === "/" ? activeBtn : inactiveBtn}`}
            >
              <span className="flex items-center gap-2.5">
                <Trophy className={`w-4 h-4 ${activeFilter === "top10" && pathname === "/" ? "text-yellow-300" : "text-gray-400 group-hover:text-green-600"}`} />
                Top 10 Votes
              </span>
            </button>

            <button
              onClick={() => onFilterChange("solved")}
              className={`${baseBtn} ${activeFilter === "solved" && pathname === "/" ? activeBtn : inactiveBtn}`}
            >
              <span className="flex items-center gap-2.5">
                <CheckCircle2 className={`w-4 h-4 ${activeFilter === "solved" && pathname === "/" ? "text-green-300" : "text-gray-400 group-hover:text-green-600"}`} />
                Solved Ideas
              </span>
              <span className={`text-xs rounded-full px-1.5 py-0.5 font-semibold ${activeFilter === "solved" && pathname === "/" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-500"}`}>
                {ideaCounts["solved"] ?? 0}
              </span>
            </button>

            {/* Feature Wishes — nav link */}
            <Link
              href="/wishes"
              className={`${baseBtn} ${pathname === "/wishes" ? activeBtn : inactiveBtn}`}
            >
              <span className="flex items-center gap-2.5">
                <Lightbulb className={`w-4 h-4 ${pathname === "/wishes" ? "text-yellow-300" : "text-gray-400 group-hover:text-green-600"}`} />
                Feature Wishes
              </span>
            </Link>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="px-3 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
            Categories
          </h3>
          <div className="space-y-1">
            <button
              onClick={() => onFilterChange("all")}
              className={`${baseBtn} ${activeFilter === "all" && pathname === "/" ? activeBtn : inactiveBtn}`}
            >
              <span className="flex items-center gap-2.5">
                <LayoutGrid className={`w-4 h-4 ${activeFilter === "all" && pathname === "/" ? "text-white" : "text-gray-400 group-hover:text-green-600"}`} />
                All Ideas
              </span>
              <span className={`text-xs rounded-full px-1.5 py-0.5 font-semibold ${activeFilter === "all" && pathname === "/" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-500"}`}>
                {totalCount}
              </span>
            </button>

            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onFilterChange(category)}
                className={`${baseBtn} ${activeFilter === category && pathname === "/" ? activeBtn : inactiveBtn}`}
              >
                <span className="flex items-center gap-2.5">
                  <Tag className={`w-4 h-4 ${activeFilter === category && pathname === "/" ? "text-white" : "text-gray-400 group-hover:text-green-600"}`} />
                  <span className="truncate">{category}</span>
                </span>
                <span className={`text-xs rounded-full px-1.5 py-0.5 font-semibold ${activeFilter === category && pathname === "/" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-500"}`}>
                  {ideaCounts[category] ?? 0}
                </span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
