import React from "react";
import { UserProfile } from "../types";
import { LogOut, CheckCircle2, User, Shield } from "lucide-react";

interface NavbarProps {
  user: UserProfile | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => (
  <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xl font-bold tracking-tight text-slate-900">Todo One <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">PRO</span></span>
          <p className="text-xs text-slate-500 hidden sm:block">Secure Productivity Workspace</p>
        </div>
      </div>
      {user && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-2xl">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
              {user.photoURL ? <img src={user.photoURL} alt="Avatar" className="w-full h-full rounded-full object-cover" /> : user.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-semibold text-slate-800">{user.displayName || "User"}</div>
              <div className="text-[10px] text-emerald-700 font-medium flex items-center gap-1"><Shield className="w-2.5 h-2.5" /> Firebase Auth</div>
            </div>
          </div>
          <button onClick={onLogout} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:text-red-600 transition-colors">
            <LogOut className="w-4 h-4" /><span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      )}
    </div>
  </header>
);
