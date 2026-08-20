import React from "react";
import { TodoItem } from "../types";
import { ListTodo, CheckCircle, Clock, AlertTriangle } from "lucide-react";

interface StatsOverviewProps {
  todos: TodoItem[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ todos }) => {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const active = total - completed;
  const highPriority = todos.filter((t) => !t.completed && t.priority === "high").length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Todos</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1">{total}</h3>
          <p className="text-xs text-slate-500 mt-1">Active workspace goals</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <ListTodo className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Tasks</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">{active}</h3>
          <p className="text-xs text-slate-500 mt-1">Pending completion</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Clock className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Completed</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">{completed}</h3>
          <p className="text-xs text-slate-500 mt-1">{completionRate}% productivity rate</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <CheckCircle className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">High Priority</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-rose-600 mt-1">{highPriority}</h3>
          <p className="text-xs text-slate-500 mt-1">Requires urgent attention</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>
      </div>
    </section>
  );
};
