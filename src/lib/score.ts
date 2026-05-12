export type StarCount = 1 | 2 | 3 | 4 | 5;

export const scoreToStars = (score: number): StarCount => {
  if (score >= 80) return 5;
  if (score >= 60) return 4;
  if (score >= 40) return 3;
  if (score >= 20) return 2;
  return 1;
};

export const STAR_COLORS: Record<StarCount, string> = {
  5: '#22c55e',
  4: '#84cc16',
  3: '#eab308',
  2: '#f97316',
  1: '#ef4444',
};
