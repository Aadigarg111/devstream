import { NextRequest, NextResponse } from "next/server";
import { generateWithGemini } from "@/lib/gemini";

const DEMO_RESPONSES = [
  "```typescript\nimport { useState, useEffect } from 'react';\n\ninterface UseFetchResult<T> {\n  data: T | null;\n  loading: boolean;\n  error: Error | null;\n}\n\nexport function useFetch<T>(url: string): UseFetchResult<T> {\n  const [data, setData] = useState<T | null>(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<Error | null>(null);\n\n  useEffect(() => {\n    const controller = new AbortController();\n    fetch(url, { signal: controller.signal })\n      .then(res => res.json())\n      .then(setData)\n      .catch(setError)\n      .finally(() => setLoading(false));\n    return () => controller.abort();\n  }, [url]);\n\n  return { data, loading, error };\n}\n```\n\nA custom React hook for data fetching with loading and error states.",
  "```python\ndef fibonacci(n: int) -> list[int]:\n    if n <= 0:\n        return []\n    fib = [0, 1]\n    for i in range(2, n):\n        fib.append(fib[-1] + fib[-2])\n    return fib[:n]\n\nprint(fibonacci(10))  # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]\n```\n\nIterative Fibonacci implementation with O(n) time and space complexity.",
];

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  try {
    const response = await generateWithGemini(
      "You are a helpful coding assistant. Generate clean, well-commented code with explanations. Use markdown code blocks with language tags.",
      prompt,
    );

    if (response) {
      return NextResponse.json({ response });
    }
  } catch {
    // fallback to demo
  }

  return NextResponse.json({ response: DEMO_RESPONSES[Math.floor(Math.random() * DEMO_RESPONSES.length)] });
}
