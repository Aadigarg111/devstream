"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/stats", label: "Stats", icon: "📈" },
  { href: "/repos", label: "Repos", icon: "📂" },
  { href: "/activity", label: "Activity", icon: "⚡" },
  { href: "/ai", label: "AI Tools", icon: "🤖" },
  { href: "/search", label: "Search", icon: "🔍" },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const profile = (session as any)?.githubProfile;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-gray-800/50 bg-black/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold tracking-tight">DevStream</Link>

          {status === "authenticated" && (
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(link => (
                <Link key={link.href} href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${pathname === link.href ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800/50"}`}>
                  {link.icon} {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {status === "authenticated" && profile ? (
            <>
              <Link href="/settings" className={`hidden sm:block text-sm px-3 py-1.5 rounded-lg transition-colors ${pathname === "/settings" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white"}`}>
                ⚙️
              </Link>
              <div className="hidden sm:flex items-center gap-2">
                <img src={profile.avatar_url} alt={profile.login} className="w-7 h-7 rounded-full ring-2 ring-gray-800" />
                <span className="text-sm text-gray-300">{profile.login}</span>
              </div>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="text-sm text-gray-500 hover:text-white transition-colors">
                Sign out
              </button>
              {/* Mobile menu button */}
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-gray-400 hover:text-white p-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </>
          ) : (
            <Link href="/login" className="text-sm px-4 py-2 rounded-lg bg-white text-black font-medium hover:bg-gray-200 transition-colors">
              Sign in
            </Link>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && status === "authenticated" && (
        <div className="md:hidden border-t border-gray-800 bg-black/95 backdrop-blur-xl px-4 py-3 space-y-1">
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-sm ${pathname === link.href ? "bg-gray-800 text-white" : "text-gray-400"}`}>
              {link.icon} {link.label}
            </Link>
          ))}
          <Link href="/settings" onClick={() => setMobileOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-sm ${pathname === "/settings" ? "bg-gray-800 text-white" : "text-gray-400"}`}>
            ⚙️ Settings
          </Link>
        </div>
      )}
    </nav>
  );
}
