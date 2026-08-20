import React, { useState } from "react";
import { TodoItem } from "../types";
import { Trash2, Edit3, Check, X, Calendar, Flag, Tag } from "lucide-react";

interface TodoItemCardProps {
  todo: TodoItem;
  onToggleComplete: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, updatedData: Partial<TodoItem>) => Promise<void>;
}

export const TodoItemCard: React.FC<TodoItemCardProps> = ({
  todo,
  onToggleComplete,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title || todo.text || "");
  const [editDescription, setEditDescription] = useState(todo.description || "");
  const [editPriority, setEditPriority] = useState<'low' | 'medium' | 'high'>(todo.priority || "medium");
  const [editCategory, setEditCategory] = useState(todo.category || "Work");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) return;
    setIsUpdating(true);
    try {
      await onUpdate(todo.id, {
        title: editTitle.trim(),
        text: editTitle.trim(),
        description: editDescription.trim(),
        priority: editPriority,
        category: editCategory,
      });
      setIsEditing(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const priorityStyles = {
    high: "bg-rose-50 text-rose-700 border-rose-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  const priorityLabels = {
    high: "High Priority",
    medium: "Medium",
    low: "Low",
  };

  const formattedDate = new Date(todo.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className={`group bg-white rounded-2xl border transition-all duration-200 p-4 sm:p-5 mb-3.5 shadow-xs hover:shadow-md ${
        todo.completed
          ? "border-slate-200 bg-slate-50/70 opacity-80"
          : "border-slate-200/80 hover:border-blue-300"
      }`}
    >
      {isEditing ? (
        /* Inline Edit Form */
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="Task title..."
            autoFocus
          />
          <textarea
            rows={2}
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="Add description..."
          />
          <div className="flex flex-wrap gap-3 items-center">
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value as any)}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
            >
              <option value="low">🟢 Low Priority</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="high">🔴 High Priority</option>
            </select>
            <select
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
            >
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Study">Study</option>
              <option value="Urgent">Urgent</option>
              <option value="General">General</option>
            </select>
          </div>
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={() => setIsEditing(false)}
              disabled={isUpdating}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={!editTitle.trim() || isUpdating}
              className="inline-flex items-center gap-1 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isUpdating ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Normal Display View */
        <div className="flex items-start gap-3.5 sm:gap-4">
          {/* Checkbox */}
          <button
            onClick={() => onToggleComplete(todo.id, !todo.completed)}
            className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
              todo.completed
                ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
                : "border-slate-300 hover:border-blue-500 bg-white"
            }`}
            title={todo.completed ? "Mark incomplete" : "Mark completed"}
          >
            {todo.completed && <Check className="w-4 h-4 stroke-[3]" />}
          </button>

          {/* Todo Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3
                className={`text-base sm:text-lg font-bold tracking-tight transition-all ${
                  todo.completed
                    ? "line-through text-slate-400 font-normal"
                    : "text-slate-900"
                }`}
              >
                {todo.title || todo.text || "Untitled Task"}
              </h3>
            </div>

            {todo.description && (
              <p
                className={`text-sm mb-3 leading-relaxed ${
                  todo.completed ? "text-slate-400" : "text-slate-600"
                }`}
              >
                {todo.description}
              </p>
            )}

            {/* Badges and Meta Info */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                  priorityStyles[todo.priority || "medium"]
                }`}
              >
                <Flag className="w-3 h-3" />
                {priorityLabels[todo.priority || "medium"]}
              </span>

              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                <Tag className="w-3 h-3 text-slate-400" />
                {todo.category || "General"}
              </span>

              {todo.dueDate && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                  <Calendar className="w-3 h-3" />
                  Due {todo.dueDate}
                </span>
              )}

              <span className="text-[11px] text-slate-400 font-medium ml-auto">
                Created {formattedDate}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => {
                setEditTitle(todo.title || todo.text || "");
                setEditDescription(todo.description || "");
                setEditPriority(todo.priority || "medium");
                setEditCategory(todo.category || "Work");
                setIsEditing(true);
              }}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
              title="Edit Task"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
