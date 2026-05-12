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
        fontSize: 14,
        lineHeight: 1,
        color: STAR_COLORS[stars],
        marginLeft: 8,
        verticalAlign: 'middle',
        userSelect: 'none',
        cursor: 'help',
      }}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>{i < stars ? '★' : '☆'}</span>
      ))}
    </span>
  );
}
