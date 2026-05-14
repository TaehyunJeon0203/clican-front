import { useState } from 'react';
import { STAR_COLORS, type StarCount } from '@/lib/score';

interface Props {
  stars: StarCount;
  reason?: string;
  tags?: string[];
}

const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Apple SD Gothic Neo", sans-serif';

export function Stars({ stars, reason, tags = [] }: Props) {
  const [open, setOpen] = useState(false);
  const color = STAR_COLORS[stars];
  const hasTooltip = Boolean(reason) || tags.length > 0;

  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-flex',
        verticalAlign: 'middle',
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span
        tabIndex={hasTooltip ? 0 : -1}
        aria-label={`신뢰도 ${stars}/5`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          fontSize: 13,
          lineHeight: 1,
          color,
          background: 'rgba(255, 255, 255, 0.08)',
          border: `1px solid ${color}`,
          borderRadius: 999,
          padding: '2px 6px',
          fontFamily: FONT_STACK,
          userSelect: 'none',
          cursor: hasTooltip ? 'help' : 'default',
          whiteSpace: 'nowrap',
        }}
      >
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i}>{i < stars ? '★' : '☆'}</span>
        ))}
      </span>

      {open && hasTooltip && (
        <span
          role="tooltip"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: 6,
            zIndex: 2147483647,
            width: 320,
            maxWidth: '90vw',
            background: '#111827',
            color: '#f3f4f6',
            border: `1px solid ${color}`,
            borderRadius: 8,
            padding: '10px 12px',
            fontSize: 12,
            lineHeight: 1.5,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
            fontFamily: FONT_STACK,
            whiteSpace: 'normal',
            textAlign: 'left',
            pointerEvents: 'none',
          }}
        >
          {reason && (
            <div style={{ marginBottom: tags.length > 0 ? 8 : 0 }}>
              {reason}
            </div>
          )}
          {tags.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 4,
              }}
            >
              {tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: 11,
                    lineHeight: 1,
                    padding: '3px 7px',
                    borderRadius: 999,
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </span>
      )}
    </span>
  );
}
