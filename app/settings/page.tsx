"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";
import { Palette, Save, UserRound } from "lucide-react";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme, toggle } = useTheme();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [saved, setSaved] = useState(false);

  const profile = (session as any)?.githubProfile;

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (!profile) return;
    const local = localStorage.getItem("devstream-profile");
    if (local) {
      const parsed = JSON.parse(local);
      setDisplayName(parsed.displayName || profile.name || profile.login);
      setBio(parsed.bio || profile.bio || "");
    } else {
      setDisplayName(profile.name || profile.login);
      setBio(profile.bio || "");
    }
  }, [profile]);

  function saveProfile() {
    localStorage.setItem("devstream-profile", JSON.stringify({ displayName, bio }));
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center pt-16"><div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" /></div>;
  }

  return (
    <main className="relative min-h-screen bg-[#050507] px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-apple-noise opacity-35" />
      <div className="relative mx-auto max-w-4xl space-y-6">
        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-[2rem] border border-white/10 p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-white/45">Preferences</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Craft your workspace</h1>
        </motion.section>

        <section className="grid gap-5 md:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} className="glass-panel rounded-3xl border border-white/10 p-6">
            <div className="mb-4 flex items-center gap-2">
              <Palette className="h-5 w-5 text-violet-200" />
              <h2 className="text-xl font-medium">Appearance</h2>
            </div>
            <p className="text-sm text-white/60">Switch between dark and light theme with animated transitions.</p>
            <button onClick={toggle} className="apple-btn-primary mt-5">Theme: {theme === "dark" ? "Dark" : "Light"}</button>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} className="glass-panel rounded-3xl border border-white/10 p-6">
            <div className="mb-4 flex items-center gap-2">
              <UserRound className="h-5 w-5 text-sky-200" />
              <h2 className="text-xl font-medium">Connected account</h2>
            </div>
            {profile && (
              <div className="flex items-center gap-4">
                <img src={profile.avatar_url} alt={profile.login} className="h-12 w-12 rounded-full border border-white/15" />
                <div>
                  <p className="font-medium">{profile.login}</p>
                  <a href={profile.html_url} target="_blank" rel="noreferrer" className="text-sm text-white/65 hover:text-white">
                    {profile.html_url}
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        </section>

        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-3xl border border-white/10 p-6">
          <h2 className="text-xl font-medium">Profile customization</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm text-white/55">Display name</label>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#09090e] px-4 py-2.5 text-sm outline-none focus:border-white/30"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-white/55">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-white/10 bg-[#09090e] px-4 py-2.5 text-sm outline-none focus:border-white/30"
              />
            </div>
            <button onClick={saveProfile} className="apple-btn-primary">
              <Save className="h-4 w-4" /> {saved ? "Saved" : "Save changes"}
            </button>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
