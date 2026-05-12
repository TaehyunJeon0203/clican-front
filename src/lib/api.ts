import type { AnalyzeRequest, AnalyzeResponse } from '@/types/api';

const API_BASE = 'https://clican.onrender.com';

export async function analyze(req: AnalyzeRequest): Promise<AnalyzeResponse> {
  const res = await fetch(`${API_BASE}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    throw new Error(`Analyze failed: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as AnalyzeResponse;
}
