import type { AnalyzeRequest, AnalyzeResponse } from './api';

export type RuntimeMessage = { type: 'ANALYZE'; payload: AnalyzeRequest };

export type RuntimeResponse =
  | { ok: true; data: AnalyzeResponse }
  | { ok: false; error: string };
