"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme, toggle } = useTheme();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [saved, setSaved] = useState(false);

  const profile = (session as any)?.githubProfile;

  useEffect(() => { if (status === "unauthenticated") router.push("/login"); }, [status, router]);

  useEffect(() => {
    if (profile) {
      const s = localStorage.getItem("devstream-profile");
      if (s) {
        const p = JSON.parse(s);
        setDisplayName(p.displayName || profile.name || profile.login);
        setBio(p.bio || profile.bio || "");
      } else {
        setDisplayName(profile.name || profile.login);
        setBio(profile.bio || "");
      }
    }
  }, [profile]);

  function saveProfile() {
    localStorage.setItem("devstream-profile", JSON.stringify({ displayName, bio }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center pt-16"><div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">⚙️ Settings</h1>

        {/* Theme */}
        <div className="p-6 rounded-2xl border border-gray-800 bg-gray-900/30 space-y-4">
          <h2 className="text-lg font-semibold">🌗 Appearance</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Theme</p>
              <p className="text-xs text-gray-500">Switch between dark and light mode</p>
            </div>
            <button onClick={toggle}
              className="relative w-14 h-7 rounded-full bg-gray-700 transition-colors duration-300"
              style={{ backgroundColor: theme === "light" ? "#3b82f6" : "#374151" }}>
              <div className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white transition-transform duration-300 flex items-center justify-center text-sm"
                style={{ transform: theme === "light" ? "translateX(28px)" : "translateX(0)" }}>
                {theme === "dark" ? "🌙" : "☀️"}
              </div>
            </button>
          </div>
        </div>

        {/* Profile */}
        <div className="p-6 rounded-2xl border border-gray-800 bg-gray-900/30 space-y-4">
          <h2 className="text-lg font-semibold">👤 Profile Customization</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 block mb-1">Display Name</label>
              <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-500" />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-1">Bio</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-500 resize-none" />
            </div>
            <button onClick={saveProfile}
              className="px-6 py-2.5 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
              {saved ? "✅ Saved!" : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Account Info */}
        {profile && (
          <div className="p-6 rounded-2xl border border-gray-800 bg-gray-900/30 space-y-3">
            <h2 className="text-lg font-semibold">🔗 Connected Account</h2>
            <div className="flex items-center gap-4">
              <img src={profile.avatar_url} alt="" className="w-12 h-12 rounded-full" />
              <div>
                <p className="font-medium">{profile.login}</p>
                <a href={profile.html_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline">{profile.html_url}</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
