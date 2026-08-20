import React, { useState } from "react";
import { PlusCircle, Tag, Flag, Calendar, AlignLeft } from "lucide-react";

interface AddTodoFormProps {
  onAddTodo: (todoData: {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    category: string;
    dueDate?: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

export const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAddTodo, isLoading }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>("medium");
  const [category, setCategory] = useState("Work");
  const [dueDate, setDueDate] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await onAddTodo({
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      dueDate: dueDate || undefined,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setPriority("medium");
    setCategory("Work");
    setDueDate("");
    setIsExpanded(false);
  };

  const categories = ["Work", "Personal", "Study", "Urgent", "General"];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 mb-8 transition-all">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-blue-600" />
          Create New Task
        </h2>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200 transition-colors"
        >
          {isExpanded ? "Simple Mode" : "+ Add Details (Priority, Category)"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="What do you need to accomplish today?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-medium text-base sm:text-lg"
            required
          />
        </div>

        {isExpanded && (
          <div className="space-y-4 pt-2 animate-fadeIn">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <AlignLeft className="w-3.5 h-3.5" /> Description / Notes
              </label>
              <textarea
                rows={3}
                placeholder="Add extra context, checklists, or deadlines..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Flag className="w-3.5 h-3.5" /> Priority Level
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  disabled={isLoading}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                >
                  <option value="low">🟢 Low Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="high">🔴 High Priority (Urgent)</option>
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Due Date (Optional)
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-1">
          {isExpanded && (
            <button
              type="button"
              onClick={() => {
                setIsExpanded(false);
                setDescription("");
              }}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              Cancel Details
            </button>
          )}
          <button
            type="submit"
            disabled={!title.trim() || isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-sm hover:shadow transition-all active:scale-98"
          >
            <PlusCircle className="w-5 h-5" />
            <span>{isLoading ? "Adding Task..." : "Add Todo Task"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
