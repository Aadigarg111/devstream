"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session, status } = useSession();
  const profile = (session as any)?.githubProfile;

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-gray-800/50 bg-black/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-tight">DevStream</span>
        </Link>

        <div className="flex items-center gap-6">
          {status === "authenticated" && profile ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-3">
                <img
                  src={profile.avatar_url}
                  alt={profile.login}
                  className="w-8 h-8 rounded-full ring-2 ring-gray-800"
                />
                <span className="text-sm text-gray-300">{profile.login}</span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm text-gray-500 hover:text-white transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm px-4 py-2 rounded-lg bg-white text-black font-medium hover:bg-gray-200 transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
