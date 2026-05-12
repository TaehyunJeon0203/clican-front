import { STAR_COLORS, type StarCount } from '@/lib/score';

interface Props {
  stars: StarCount;
  reason?: string;
}

export function Stars({ stars, reason }: Props) {
  return (
    <span
      title={reason}
      aria-label={`신뢰도 ${stars}/5`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        fontSize: 13,
        lineHeight: 1,
        color: STAR_COLORS[stars],
        background: 'rgba(255, 255, 255, 0.08)',
        border: `1px solid ${STAR_COLORS[stars]}`,
        borderRadius: 999,
        padding: '2px 6px',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        userSelect: 'none',
        cursor: 'help',
        whiteSpace: 'nowrap',
      }}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>{i < stars ? '★' : '☆'}</span>
      ))}
    </span>
  );
}
