"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import AnimatedLogo from "@/components/AnimatedLogo";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/stats", label: "Stats" },
  { href: "/repos", label: "Repos" },
  { href: "/activity", label: "Activity" },
  { href: "/ai", label: "AI" },
  { href: "/search", label: "Search" },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const profile = (session as any)?.githubProfile;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#09090b]/70 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-5">
          <Link href="/" className="rounded-full p-1 transition hover:bg-white/5">
            <AnimatedLogo />
          </Link>

          {status === "authenticated" && (
            <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 md:flex">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-3 py-1.5 text-sm transition ${
                    pathname === link.href
                      ? "bg-white/15 text-white"
                      : "text-white/55 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {status === "authenticated" && profile ? (
            <>
              <Link
                href="/settings"
                className={`hidden rounded-full border px-3 py-1.5 text-sm transition sm:block ${
                  pathname === "/settings"
                    ? "border-white/20 bg-white/15 text-white"
                    : "border-white/10 text-white/65 hover:bg-white/10 hover:text-white"
                }`}
              >
                Settings
              </Link>
              <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 sm:flex">
                <img
                  src={profile.avatar_url}
                  alt={profile.login}
                  className="h-7 w-7 rounded-full border border-white/15"
                />
                <span className="pr-1 text-sm text-white/80">{profile.login}</span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="hidden rounded-full border border-white/10 px-3 py-1.5 text-sm text-white/65 transition hover:bg-white/10 hover:text-white sm:block"
              >
                Sign out
              </button>
              <button
                onClick={() => setMobileOpen((prev) => !prev)}
                className="rounded-full border border-white/10 p-2 text-white/70 transition hover:bg-white/10 hover:text-white md:hidden"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </>
          ) : (
            <Link href="/login" className="apple-btn-primary !py-1.5 !text-sm">
              Sign in
            </Link>
          )}
        </div>
      </div>

      {mobileOpen && status === "authenticated" && (
        <div className="border-t border-white/10 bg-black/85 px-4 py-3 backdrop-blur-2xl md:hidden">
          <div className="space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-xl px-3 py-2.5 text-sm transition ${
                  pathname === link.href
                    ? "bg-white/15 text-white"
                    : "text-white/65 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/settings"
              onClick={() => setMobileOpen(false)}
              className={`block rounded-xl px-3 py-2.5 text-sm transition ${
                pathname === "/settings"
                  ? "bg-white/15 text-white"
                  : "text-white/65 hover:bg-white/10 hover:text-white"
              }`}
            >
              Settings
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="mt-2 w-full rounded-xl border border-white/10 px-3 py-2.5 text-left text-sm text-white/65 transition hover:bg-white/10 hover:text-white"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
