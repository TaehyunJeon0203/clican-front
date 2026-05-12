import { createRoot, type Root } from 'react-dom/client';
import { parseGoogleResults, extractQuery } from './parsers/google';
import { Stars } from './Stars';
import { scoreToStars } from '@/lib/score';
import type { AnalyzeRequest } from '@/types/api';
import type { RuntimeMessage, RuntimeResponse } from '@/types/messages';

const mountedHosts = new WeakSet<HTMLElement>();
const roots: Root[] = [];

function injectStars(blockEl: HTMLElement, score: number, reason: string) {
  if (blockEl.querySelector('[data-clican="stars"]')) return;

  const host = document.createElement('span');
  host.dataset.clican = 'stars';
  host.style.display = 'inline-flex';
  host.style.alignItems = 'center';
  host.style.marginLeft = '8px';
  host.style.verticalAlign = 'middle';

  const cite = blockEl.querySelector('cite');
  const urlRow = cite?.closest('div');
  const moreBtn = urlRow?.querySelector('[role="button"]') as HTMLElement | null;

  if (urlRow && moreBtn) {
    urlRow.insertBefore(host, moreBtn);
  } else if (urlRow) {
    urlRow.appendChild(host);
  } else {
    blockEl.insertBefore(host, blockEl.firstChild);
  }

  const shadow = host.attachShadow({ mode: 'open' });
  const container = document.createElement('span');
  shadow.appendChild(container);

  const root = createRoot(container);
  root.render(<Stars stars={scoreToStars(score)} reason={reason} />);

  mountedHosts.add(host);
  roots.push(root);
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
    query: extractQuery(),
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
