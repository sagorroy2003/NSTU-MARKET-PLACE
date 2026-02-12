"use client";

import Link from "next/link";

import { useAuth } from "../context/auth-context";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold">
          NSTU Marketplace
        </Link>

        {!user ? (
          <div className="flex items-center gap-3 text-sm">
            <Link href="/login" className="hover:underline">
              Login
            </Link>
            <Link href="/signup" className="hover:underline">
              Signup
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-600">{user.email}</span>
            <Link href="/products/new" className="rounded bg-blue-600 px-3 py-1.5 text-white">
              New Product
            </Link>
            <button className="rounded border px-3 py-1.5" onClick={logout} type="button">
              Logout
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
