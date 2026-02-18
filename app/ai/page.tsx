"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Bot, Sparkles, Wand2 } from "lucide-react";

const tools = [
  { title: "Explain Code", endpoint: "/api/ai/explain", placeholder: "Paste code and get senior-level explanation" },
  { title: "Review PR", endpoint: "/api/ai/review", placeholder: "Paste diff and get review feedback" },
  { title: "Generate README", endpoint: "/api/ai/readme", placeholder: "Describe project and generate polished README" },
  { title: "Commit Message", endpoint: "/api/ai/commit-message", placeholder: "Paste diff summary for semantic commit suggestions" },
];

export default function AIPage() {
  const { status } = useSession();
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("Choose a tool and run your first generation.");
  const [activeTool, setActiveTool] = useState(tools[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  async function runTool() {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(activeTool.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setOutput(data.result || data.error || "No output generated.");
    } catch {
      setOutput("Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center pt-16"><div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" /></div>;
  }

  return (
    <main className="relative min-h-screen bg-[#050507] px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-apple-noise opacity-35" />
      <div className="relative mx-auto max-w-7xl space-y-7">
        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-[2rem] border border-white/10 p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-white/45">Intelligence workspace</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">AI copilot studio</h1>
          <p className="mt-3 max-w-2xl text-white/65">Production-focused tools for explanation, refactoring, docs, and review flows.</p>
        </motion.section>

        <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="space-y-3">
            {tools.map((tool, idx) => (
              <motion.button
                key={tool.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.06 }}
                onClick={() => setActiveTool(tool)}
                className={`glass-panel w-full rounded-2xl border p-4 text-left transition ${
                  activeTool.title === tool.title ? "border-white/30 bg-white/[0.09]" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                }`}
              >
                <p className="font-medium">{tool.title}</p>
                <p className="mt-1 text-xs text-white/55">{tool.placeholder}</p>
              </motion.button>
            ))}
          </div>

          <div className="glass-panel rounded-[1.8rem] border border-white/10 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-medium tracking-tight">{activeTool.title}</h2>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/65">
                <Bot className="h-3.5 w-3.5" /> DevStream AI
              </span>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={activeTool.placeholder}
              rows={8}
              className="w-full rounded-2xl border border-white/10 bg-[#09090e]/80 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/25"
            />

            <div className="mt-4 flex gap-3">
              <button onClick={runTool} disabled={loading} className="apple-btn-primary disabled:opacity-50">
                <Wand2 className="h-4 w-4" />
                {loading ? "Generating..." : "Generate"}
              </button>
              <button onClick={() => setPrompt("")} className="apple-btn-secondary">Clear</button>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-[#07070b]/80 p-4">
              <p className="mb-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-white/45">
                <Sparkles className="h-3.5 w-3.5" /> Output
              </p>
              <pre className="whitespace-pre-wrap text-sm text-white/80">{output}</pre>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
