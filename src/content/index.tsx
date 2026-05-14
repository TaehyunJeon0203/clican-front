import { createRoot, type Root } from 'react-dom/client';
import { parseGoogleResults, extractQuery } from './parsers/google';
import { Stars } from './Stars';
import { scoreToStars } from '@/lib/score';
import type { AnalyzeRequest } from '@/types/api';
import type { RuntimeMessage, RuntimeResponse } from '@/types/messages';

const mountedHosts = new WeakSet<HTMLElement>();
const roots: Root[] = [];

function mountStars(host: HTMLElement, score: number, reason: string) {
  const shadow = host.attachShadow({ mode: 'open' });
  const container = document.createElement('span');
  shadow.appendChild(container);
  const root = createRoot(container);
  root.render(<Stars stars={scoreToStars(score)} reason={reason} />);
  mountedHosts.add(host);
  roots.push(root);
}

function injectStars(blockEl: HTMLElement, score: number, reason: string) {
  if (blockEl.querySelector('[data-clican="stars"]')) return;

  const host = document.createElement('div');
  host.dataset.clican = 'stars';
  host.style.display = 'block';
  host.style.margin = '6px 0';
  blockEl.insertBefore(host, blockEl.firstChild);

  mountStars(host, score, reason);
}

async function run() {
  console.log('[Clican] content script loaded');

  const parsed = parseGoogleResults();
  console.log('[Clican] parsed results:', parsed.length, parsed);

  if (parsed.length === 0) {
    console.warn(
      '[Clican] no results parsed — SERP DOM selector mismatch?',
    );
    return;
  }

  const request: AnalyzeRequest = {
    keyword: extractQuery(),
    results: parsed.map((p) => p.dto),
  };
  console.log('[Clican] sending request:', request);

  const message: RuntimeMessage = { type: 'ANALYZE', payload: request };
  const response = (await chrome.runtime.sendMessage(message)) as
    | RuntimeResponse
    | undefined;

  console.log('[Clican] response:', response);

  if (!response) {
    console.warn('[Clican] no response from background');
    return;
  }
  if (!response.ok) {
    console.warn('[Clican] analyze failed:', response.error);
    return;
  }

  for (const trust of response.data.results) {
    const target = parsed[trust.index];
    if (!target) continue;
    injectStars(target.container, trust.score, trust.reason);
  }
  console.log('[Clican] injected', response.data.results.length, 'badges');
}

run().catch((err) => console.error('[Clican] fatal:', err));
