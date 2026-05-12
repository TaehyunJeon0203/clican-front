import type { SearchResultDto } from '@/types/api';

export interface ParsedResult {
  dto: SearchResultDto;
  container: HTMLElement;
}

const SEEN_ATTR = 'data-clican-seen';

export function parseGoogleResults(): ParsedResult[] {
  const results: ParsedResult[] = [];
  const seen = new Set<string>();
  const blocks = document.querySelectorAll<HTMLElement>(
    'div.g, div[data-hveid][data-ved]',
  );

  let index = 0;
  blocks.forEach((block) => {
    if (block.getAttribute(SEEN_ATTR) === '1') return;

    const h3 = block.querySelector<HTMLHeadingElement>('h3');
    if (!h3) return;

    const anchor = h3.closest('a') as HTMLAnchorElement | null;
    if (!anchor) return;

    const url = anchor.href;
    if (!url || url.startsWith('javascript:') || seen.has(url)) return;

    const title = h3.textContent?.trim() ?? '';
    if (!title) return;

    const snippetEl =
      block.querySelector<HTMLElement>('[data-sncf]') ??
      block.querySelector<HTMLElement>('.VwiC3b') ??
      block.querySelector<HTMLElement>('.lEBKkf') ??
      block.querySelector<HTMLElement>('.MUxGbd');
    const snippet = snippetEl?.textContent?.trim() || title || url;

    seen.add(url);
    block.setAttribute(SEEN_ATTR, '1');
    results.push({
      dto: { index: index++, title, url, snippet },
      container: block,
    });
  });

  return results;
}

export function extractQuery(): string {
  const url = new URL(window.location.href);
  return url.searchParams.get('q') ?? '';
}
