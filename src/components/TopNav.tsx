"use client";

import Link from "next/link";
import { Leaf, User, Pencil, Check, ShieldCheck, ShieldOff, LogIn, X } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useAdmin } from "@/hooks/useAdmin";
import { useState } from "react";

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function TopNav() {
  const { username, setUsername, isLoaded } = useUser();
  const { isAdmin, login, logout } = useAdmin();

  // Name modal
  const [nameOpen, setNameOpen] = useState(false);
  const [draft, setDraft] = useState("");

  // Admin modal
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [loginError, setLoginError] = useState(false);

  const openNameModal = () => { setDraft(username); setNameOpen(true); };
  const saveName = () => { if (draft.trim()) setUsername(draft); setNameOpen(false); };

  const openAdminModal = () => { setAdminUser(""); setAdminPass(""); setLoginError(false); setAdminOpen(true); };
  const handleAdminLogin = () => {
    if (login(adminUser, adminPass)) {
      setAdminOpen(false);
    } else {
      setLoginError(true);
    }
  };

  return (
    <>
      <header className="bg-[#14532d] sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center group-hover:bg-green-400 transition-colors">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-white font-bold text-lg tracking-tight">ELBE Valley</span>
                <span className="text-green-400 text-xs font-semibold tracking-widest uppercase">WIR-Initiative</span>
              </div>
            </Link>

            {/* Tagline – desktop only */}
            <p className="hidden lg:block text-green-300 text-sm font-medium italic">
              Smart. Resilient. Climate-Neutral.
            </p>

            {/* Right actions */}
            {isLoaded && (
              <div className="flex items-center gap-2">
                {/* Admin button */}
                {isAdmin ? (
                  <button
                    onClick={logout}
                    title="Logout as Admin"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-white" />
                    <span className="text-white text-xs font-bold hidden sm:block">Admin</span>
                    <ShieldOff className="w-3.5 h-3.5 text-amber-200" />
                  </button>
                ) : (
                  <button
                    onClick={openAdminModal}
                    title="Admin Login"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-green-800 hover:bg-green-700 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-green-400" />
                  </button>
                )}

                {/* User chip */}
                <button
                  onClick={openNameModal}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-green-800 hover:bg-green-700 transition-colors group"
                  title="Edit your name"
                >
                  {username ? (
                    <>
                      <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                        {getInitials(username)}
                      </div>
                      <span className="text-white text-sm font-medium hidden sm:block max-w-[10rem] truncate">
                        {username}
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-7 h-7 rounded-full bg-green-600 border-2 border-dashed border-green-400 flex items-center justify-center">
                        <User className="w-4 h-4 text-green-300" />
                      </div>
                      <span className="text-green-300 text-sm hidden sm:block">Set your name</span>
                    </>
                  )}
                  <Pencil className="w-3.5 h-3.5 text-green-400 group-hover:text-green-200 transition-colors" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Edit-name modal */}
      {nameOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-end pt-16 pr-4 sm:pr-8 z-50"
          onClick={(e) => { if (e.target === e.currentTarget) setNameOpen(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-5 w-72 mt-2">
            <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
              Your Display Name
            </h3>
            <input
              autoFocus
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") saveName(); if (e.key === "Escape") setNameOpen(false); }}
              placeholder="e.g. Maria Muster"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
            />
            <p className="text-xs text-gray-400 mt-1.5">
              This name will be attached to your ideas automatically.
            </p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setNameOpen(false)}
                className="flex-1 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveName}
                disabled={!draft.trim()}
                className="flex-1 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin login modal */}
      {adminOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-end pt-16 pr-4 sm:pr-8 z-50"
          onClick={(e) => { if (e.target === e.currentTarget) setAdminOpen(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-5 w-72 mt-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Admin Login</h3>
              </div>
              <button onClick={() => setAdminOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <input
                autoFocus
                type="text"
                value={adminUser}
                onChange={(e) => { setAdminUser(e.target.value); setLoginError(false); }}
                placeholder="Username"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
              <input
                type="password"
                value={adminPass}
                onChange={(e) => { setAdminPass(e.target.value); setLoginError(false); }}
                onKeyDown={(e) => { if (e.key === "Enter") handleAdminLogin(); }}
                placeholder="Password"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
              {loginError && (
                <p className="text-xs text-red-500 font-medium">Invalid username or password.</p>
              )}
            </div>
            <button
              onClick={handleAdminLogin}
              className="mt-4 w-full py-2 text-sm font-semibold text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <LogIn className="w-4 h-4" />
              Login
            </button>
          </div>
        </div>
      )}
    </>
  );
}
