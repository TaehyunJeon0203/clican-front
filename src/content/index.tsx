import { createRoot, type Root } from 'react-dom/client';
import { parseGoogleResults, extractQuery } from './parsers/google';
import { Stars } from './Stars';
import { scoreToStars } from '@/lib/score';
import type { AnalyzeRequest } from '@/types/api';
import type { RuntimeMessage, RuntimeResponse } from '@/types/messages';

const mountedHosts = new WeakSet<HTMLElement>();
const roots: Root[] = [];

function injectStars(blockEl: HTMLElement, score: number, reason: string) {
  const h3 = blockEl.querySelector<HTMLHeadingElement>('h3');
  if (!h3 || !h3.parentElement) return;

  const host = document.createElement('span');
  host.dataset.clican = 'stars';
  if (mountedHosts.has(host)) return;

  h3.parentElement.insertBefore(host, h3.nextSibling);

  const shadow = host.attachShadow({ mode: 'open' });
  const container = document.createElement('span');
  shadow.appendChild(container);

  const root = createRoot(container);
  root.render(<Stars stars={scoreToStars(score)} reason={reason} />);

  mountedHosts.add(host);
  roots.push(root);
}

async function run() {
  const parsed = parseGoogleResults();
  if (parsed.length === 0) return;

  const request: AnalyzeRequest = {
    query: extractQuery(),
    results: parsed.map((p) => p.dto),
  };

  const message: RuntimeMessage = { type: 'ANALYZE', payload: request };
  const response = (await chrome.runtime.sendMessage(message)) as
    | RuntimeResponse
    | undefined;

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
}

run().catch((err) => console.error('[Clican]', err));
