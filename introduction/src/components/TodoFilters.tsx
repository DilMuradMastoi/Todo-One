import React from "react";
import { FilterStatus, SortOption } from "../types";
import { Search, Filter, ArrowUpDown } from "lucide-react";

interface TodoFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: FilterStatus;
  onStatusChange: (status: FilterStatus) => void;
  categoryFilter: string;
  onCategoryChange: (category: string) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  categories: string[];
}

export const TodoFilters: React.FC<TodoFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  sortOption,
  onSortChange,
  categories,
}) => {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-6 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
      {/* Search Bar */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Search tasks by keyword..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
        />
      </div>

      {/* Filter controls group */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-between sm:justify-end">
        {/* Status Pills */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          {(["all", "active", "completed"] as FilterStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => onStatusChange(status)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                statusFilter === status
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Category Select */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">By Priority</option>
          </select>
        </div>
      </div>
    </div>
  );
};
