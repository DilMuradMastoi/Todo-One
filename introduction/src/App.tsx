import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { TodoItem, UserProfile, FilterStatus, SortOption } from "./types";
import { Navbar } from "./components/Navbar";
import { AuthScreen } from "./components/AuthScreen";
import { StatsOverview } from "./components/StatsOverview";
import { AddTodoForm } from "./components/AddTodoForm";
import { TodoFilters } from "./components/TodoFilters";
import { TodoItemCard } from "./components/TodoItemCard";
import { Sparkles, Zap, Cloud, AlertCircle, RefreshCw } from "lucide-react";

const mapUser = (firebaseUser: User): UserProfile => ({
  uid: firebaseUser.uid,
  displayName: firebaseUser.displayName || "Firebase User",
  email: firebaseUser.email || "",
  photoURL: firebaseUser.photoURL,
  isGuest: false,
});

export default function App() {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOption, setSortOption] = useState<SortOption>("newest");

  useEffect(() => {
    return onAuthStateChanged(auth, user => {
      setFirebaseUser(user);
      setAuthReady(true);
      if (!user) {
        setTodos([]);
        setIsLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!firebaseUser) return;

    setIsLoading(true);
    setError(null);

    const todosRef = collection(db, "users", firebaseUser.uid, "todos");
    const q = query(todosRef, orderBy("createdAt", "desc"));

    return onSnapshot(q, snapshot => {
      const next: TodoItem[] = snapshot.docs.map(item => {
        const data = item.data() as any;
        const createdAt = data.createdAt?.toDate?.()?.toISOString?.() || data.createdAt || new Date().toISOString();
        return {
          id: item.id,
          uid: firebaseUser.uid,
          title: data.title || data.text || "Untitled Task",
          text: data.text || data.title || "",
          description: data.description || "",
          completed: Boolean(data.completed),
          priority: data.priority || "medium",
          category: data.category || "General",
          createdAt,
          dueDate: data.dueDate || undefined,
        };
      });
      setTodos(next);
      setIsLoading(false);
    }, err => {
      console.error(err);
      setError("Unable to load your Firestore tasks. Check your Firestore rules and Firebase configuration.");
      setIsLoading(false);
    });
  }, [firebaseUser]);

  const handleAddTodo = async (todoData: {
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    category: string;
    dueDate?: string;
  }) => {
    if (!firebaseUser) return;
    setError(null);
    await addDoc(collection(db, "users", firebaseUser.uid, "todos"), {
      ...todoData,
      text: todoData.title,
      completed: false,
      createdAt: serverTimestamp(),
      ownerId: firebaseUser.uid,
    });
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    if (!firebaseUser) return;
    await updateDoc(doc(db, "users", firebaseUser.uid, "todos", id), { completed });
  };

  const handleUpdateTodo = async (id: string, updatedData: Partial<TodoItem>) => {
    if (!firebaseUser) return;
    const { id: _id, uid: _uid, createdAt: _createdAt, ...safeData } = updatedData;
    await updateDoc(doc(db, "users", firebaseUser.uid, "todos", id), safeData);
  };

  const handleDeleteTodo = async (id: string) => {
    if (!firebaseUser) return;
    await deleteDoc(doc(db, "users", firebaseUser.uid, "todos", id));
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const filteredTodos = useMemo(() => todos.filter(todo => {
    const q = searchQuery.toLowerCase();
    if (!todo.title.toLowerCase().includes(q) && !(todo.description || "").toLowerCase().includes(q)) return false;
    if (statusFilter === "active" && todo.completed) return false;
    if (statusFilter === "completed" && !todo.completed) return false;
    if (categoryFilter !== "all" && todo.category !== categoryFilter) return false;
    return true;
  }).sort((a, b) => {
    if (sortOption === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortOption === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    const weights = { high: 3, medium: 2, low: 1 };
    return weights[b.priority || "medium"] - weights[a.priority || "medium"];
  }), [todos, searchQuery, statusFilter, categoryFilter, sortOption]);

  const allCategories = useMemo(() => Array.from(new Set(todos.map(t => t.category).filter(Boolean))), [todos]);
  const user = firebaseUser ? mapUser(firebaseUser) : null;

  if (!authReady) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><RefreshCw className="w-8 h-8 text-blue-600 animate-spin" /></div>;
  }

  if (!firebaseUser) return <AuthScreen />;

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-800 flex flex-col font-sans">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="mb-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold mb-3 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Your Secure Productivity Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Plan Smarter. Work Faster.</h1>
            <p className="text-sm sm:text-base text-blue-100 mt-2 leading-relaxed">Your tasks are saved to your private Firebase Firestore account and synced in real time.</p>
          </div>
        </div>

        <StatsOverview todos={todos} />
        <AddTodoForm onAddTodo={handleAddTodo} isLoading={isLoading} />

        <div id="todo-dashboard" className="scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Workspace Tasks
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">{filteredTodos.length}</span>
            </h2>
          </div>

          {error && <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-700">{error}</div>}

          <TodoFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            sortOption={sortOption}
            onSortChange={setSortOption}
            categories={allCategories}
          />

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mb-3" />
              <p className="text-sm font-medium text-slate-500">Loading your Firestore tasks...</p>
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 sm:p-14 text-center my-4">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"><AlertCircle className="w-7 h-7" /></div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">No tasks found</h3>
              <p className="text-sm text-slate-500">Create your first task above. It will be saved automatically to Firestore.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTodos.map(todo => (
                <TodoItemCard key={todo.id} todo={todo} onToggleComplete={handleToggleComplete} onDelete={handleDeleteTodo} onUpdate={handleUpdateTodo} />
              ))}
            </div>
          )}
        </div>

        <section className="mt-12 pt-8 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3.5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs"><div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><Zap className="w-5 h-5" /></div><div><h4 className="text-sm font-bold text-slate-900">Lightning Fast</h4><p className="text-xs text-slate-500 mt-1">Fast React interface with instant task updates.</p></div></div>
            <div className="flex items-start gap-3.5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs"><div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><Cloud className="w-5 h-5" /></div><div><h4 className="text-sm font-bold text-slate-900">Cloud Sync</h4><p className="text-xs text-slate-500 mt-1">Firestore keeps your tasks available across devices.</p></div></div>
            <div className="flex items-start gap-3.5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs"><div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0"><AlertCircle className="w-5 h-5" /></div><div><h4 className="text-sm font-bold text-slate-900">Private Data</h4><p className="text-xs text-slate-500 mt-1">Security rules can restrict every user to their own tasks.</p></div></div>
          </div>
        </section>
      </main>
    </div>
  );
}
