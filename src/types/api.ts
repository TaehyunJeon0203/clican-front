export interface SearchResultDto {
  index: number;
  title: string;
  url: string;
  snippet: string;
}

export interface AnalyzeRequest {
  keyword: string;
  results: SearchResultDto[];
}

export type BadgeType = 'high' | 'medium' | 'low' | 'wiki' | string;

export interface TrustResultDto {
  index: number;
  badge: BadgeType;
  badgeLabel: string;
  score: number;
  reason: string;
  tags: string[];
}

export interface AnalyzeResponse {
  results: TrustResultDto[];
}
