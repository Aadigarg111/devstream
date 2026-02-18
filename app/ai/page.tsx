"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface SavedSnippet {
  id: string;
  code: string;
  language: string;
  timestamp: string;
}

type Tab = "generate" | "explain" | "review" | "commit" | "readme";

const DEMO_RESPONSES: Record<string, string[]> = {
  generate: [
    "```typescript\nimport { useState, useEffect } from 'react';\n\ninterface UseFetchResult<T> {\n  data: T | null;\n  loading: boolean;\n  error: Error | null;\n}\n\nexport function useFetch<T>(url: string): UseFetchResult<T> {\n  const [data, setData] = useState<T | null>(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<Error | null>(null);\n\n  useEffect(() => {\n    const controller = new AbortController();\n    fetch(url, { signal: controller.signal })\n      .then(res => res.json())\n      .then(setData)\n      .catch(setError)\n      .finally(() => setLoading(false));\n    return () => controller.abort();\n  }, [url]);\n\n  return { data, loading, error };\n}\n```\n\nA custom React hook for data fetching with loading states, error handling, and automatic cleanup via AbortController.",
    "```python\nfrom functools import lru_cache\nfrom typing import List\n\ndef two_sum(nums: List[int], target: int) -> List[int]:\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []\n\n# Example\nprint(two_sum([2, 7, 11, 15], 9))  # [0, 1]\n```\n\nClassic two-sum solution using a hash map for O(n) time complexity.",
  ],
  explain: [
    "**Line-by-line breakdown:**\n\n1. `const controller = new AbortController()` — Creates an abort controller to cancel the fetch request when the component unmounts\n\n2. `fetch(url, { signal: controller.signal })` — Makes the HTTP request with the abort signal attached\n\n3. `.then(res => res.json())` — Parses the response body as JSON\n\n4. `.catch(setError)` — Catches any errors (including abort errors) and stores them in state\n\n5. `return () => controller.abort()` — Cleanup function that cancels the request if the component unmounts before it completes\n\n**Key concepts:** This pattern prevents memory leaks and state updates on unmounted components.",
  ],
  review: [
    "**Code Review Summary:**\n\n✅ **Good:**\n- Clean separation of concerns\n- Proper TypeScript types\n- Error handling present\n\n⚠️ **Suggestions:**\n1. Add input validation before processing\n2. Consider memoizing expensive computations with `useMemo`\n3. Add JSDoc comments for public functions\n4. Consider extracting magic numbers into named constants\n\n❌ **Issues:**\n1. Missing error boundary for async operations\n2. No loading state for initial render\n3. Potential memory leak — add cleanup in useEffect\n\n**Overall: 7/10** — Solid foundation, needs error handling improvements.",
  ],
  commit: [
    "Here are some commit message suggestions:\n\n```\nfeat: add user authentication with GitHub OAuth\n```\n```\nfix: resolve memory leak in data fetching hook\n```\n```\nrefactor: extract API calls into custom hooks\n```\n\n**Convention used:** Conventional Commits (type: description)\n\nPick the one that best matches your changes!",
  ],
  readme: [
    "```markdown\n# Project Name\n\n> Brief description of what this project does\n\n## Features\n\n- ✨ Feature one\n- 🚀 Feature two  \n- 🔒 Feature three\n\n## Quick Start\n\n\\`\\`\\`bash\ngit clone https://github.com/user/repo.git\ncd repo\nnpm install\nnpm run dev\n\\`\\`\\`\n\n## Tech Stack\n\n- Next.js 14\n- TypeScript\n- Tailwind CSS\n\n## License\n\nMIT\n```\n\nCustomize the sections above for your specific project!",
  ],
};

export default function AIPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("generate");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedSnippets, setSavedSnippets] = useState<SavedSnippet[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (status === "unauthenticated") router.push("/login"); }, [status, router]);

  useEffect(() => {
    const s = localStorage.getItem("devstream-snippets");
    if (s) setSavedSnippets(JSON.parse(s));
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`/api/ai/${tab === "generate" ? "generate" : tab === "explain" ? "explain" : tab === "review" ? "review" : tab === "commit" ? "commit-message" : "readme"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMsg.content, tab }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.response, timestamp: new Date() }]);
    } catch {
      // Fallback to demo
      const demos = DEMO_RESPONSES[tab] || DEMO_RESPONSES.generate;
      const demo = demos[Math.floor(Math.random() * demos.length)];
      setMessages(prev => [...prev, { role: "assistant", content: demo, timestamp: new Date() }]);
    }
    setLoading(false);
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  }

  function saveSnippet(code: string) {
    const snippet: SavedSnippet = { id: Date.now().toString(), code, language: "typescript", timestamp: new Date().toISOString() };
    const updated = [...savedSnippets, snippet];
    setSavedSnippets(updated);
    localStorage.setItem("devstream-snippets", JSON.stringify(updated));
  }

  function deleteSnippet(id: string) {
    const updated = savedSnippets.filter(s => s.id !== id);
    setSavedSnippets(updated);
    localStorage.setItem("devstream-snippets", JSON.stringify(updated));
  }

  function renderContent(content: string) {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith("```")) {
        const lines = part.split("\n");
        const lang = lines[0].replace("```", "").trim();
        const code = lines.slice(1, -1).join("\n");
        return (
          <div key={i} className="my-3 rounded-lg overflow-hidden border border-gray-700">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-xs text-gray-400">
              <span>{lang || "code"}</span>
              <div className="flex gap-2">
                <button onClick={() => copyCode(code)} className="hover:text-white transition-colors">
                  {copied === code ? "✅ Copied" : "📋 Copy"}
                </button>
                <button onClick={() => saveSnippet(code)} className="hover:text-white transition-colors">💾 Save</button>
              </div>
            </div>
            <pre className="p-4 bg-gray-900 overflow-x-auto text-sm"><code>{code}</code></pre>
          </div>
        );
      }
      return <span key={i} className="whitespace-pre-wrap">{part}</span>;
    });
  }

  const tabConfig: { key: Tab; label: string; icon: string; placeholder: string }[] = [
    { key: "generate", label: "Generate", icon: "✨", placeholder: "Describe what code you need..." },
    { key: "explain", label: "Explain", icon: "📖", placeholder: "Paste code to explain..." },
    { key: "review", label: "Review", icon: "🔍", placeholder: "Paste code to review..." },
    { key: "commit", label: "Commit Msg", icon: "📝", placeholder: "Paste your diff or describe changes..." },
    { key: "readme", label: "README", icon: "📄", placeholder: "Enter repo name or describe your project..." },
  ];

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center pt-16"><div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen pt-20 pb-4 px-6 flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">🤖 AI Tools</h1>
          <button onClick={() => setShowSaved(!showSaved)}
            className="text-sm px-3 py-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors">
            💾 Saved ({savedSnippets.length})
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-900 rounded-lg p-1 overflow-x-auto">
          {tabConfig.map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setMessages([]); }}
              className={`px-3 py-2 rounded-md text-sm whitespace-nowrap transition-colors ${tab === t.key ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white"}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Saved Snippets Drawer */}
        {showSaved && (
          <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/50 space-y-3 max-h-60 overflow-y-auto">
            <h3 className="text-sm font-semibold text-gray-400">Saved Snippets</h3>
            {savedSnippets.length === 0 && <p className="text-xs text-gray-600">No saved snippets yet</p>}
            {savedSnippets.map(s => (
              <div key={s.id} className="flex items-start gap-2">
                <pre className="flex-1 text-xs bg-gray-800 p-2 rounded overflow-x-auto max-h-20"><code>{s.code.slice(0, 200)}{s.code.length > 200 ? "..." : ""}</code></pre>
                <div className="flex flex-col gap-1">
                  <button onClick={() => copyCode(s.code)} className="text-xs text-gray-500 hover:text-white">📋</button>
                  <button onClick={() => deleteSnippet(s.id)} className="text-xs text-gray-500 hover:text-red-400">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Chat */}
        <div className="flex-1 overflow-y-auto space-y-4 min-h-[300px] max-h-[60vh]">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full text-gray-600">
              <div className="text-center space-y-2">
                <div className="text-4xl">{tabConfig.find(t => t.key === tab)?.icon}</div>
                <p className="text-sm">Start a conversation with the AI {tabConfig.find(t => t.key === tab)?.label.toLowerCase()}</p>
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${msg.role === "user" ? "bg-blue-600 text-white rounded-br-md" : "bg-gray-800 text-gray-200 rounded-bl-md"}`}>
                {msg.role === "assistant" ? renderContent(msg.content) : msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 p-4 rounded-2xl rounded-bl-md">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="flex gap-3 pt-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder={tabConfig.find(t => t.key === tab)?.placeholder}
            className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-500"
          />
          <button onClick={handleSend} disabled={loading || !input.trim()}
            className="px-6 py-3 bg-white text-black rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
