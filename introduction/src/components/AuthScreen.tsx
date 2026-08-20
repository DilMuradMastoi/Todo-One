import React, { useState } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";
import { CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, UserPlus } from "lucide-react";

export const AuthScreen: React.FC = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (mode === "register" && !name.trim()) {
      setError("Please enter your name.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "register") {
        const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(credential.user, { displayName: name.trim() });
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
    } catch (err: any) {
      const messages: Record<string, string> = {
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/user-not-found": "No account exists with this email.",
        "auth/wrong-password": "Incorrect email or password.",
        "auth/invalid-credential": "Incorrect email or password.",
        "auth/email-already-in-use": "An account already exists with this email.",
        "auth/weak-password": "Password must be at least 6 characters.",
        "auth/popup-closed-by-user": "Google sign-in was cancelled.",
      };
      setError(messages[err?.code] || err?.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (err: any) {
      if (err?.code !== "auth/popup-closed-by-user") {
        setError(err?.message || "Google sign-in failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-7">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="mt-4 text-2xl font-black text-slate-900">Todo One Pro</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to keep your tasks safely synced.</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8">
          <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
            <button type="button" onClick={() => { setMode("login"); setError(""); }} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold ${mode === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>Login</button>
            <button type="button" onClick={() => { setMode("register"); setError(""); }} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold ${mode === "register" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>Create account</button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Name</label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input value={name} onChange={e => setName(e.target.value)} className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="Your name" />
                </div>
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input type={showPassword ? "text" : "password"} required minLength={6} value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="At least 6 characters" />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-2.5 p-1 text-slate-400">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-700">{error}</div>}

            <button disabled={loading} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold">
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="h-px bg-slate-200 flex-1" /><span className="text-xs text-slate-400">OR</span><div className="h-px bg-slate-200 flex-1" />
          </div>

          <button type="button" onClick={googleLogin} disabled={loading} className="w-full py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold flex items-center justify-center gap-2">
            <span className="text-base font-black">G</span> Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};
