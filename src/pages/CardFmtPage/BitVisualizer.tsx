import type { BitStructureSource } from '@/pages/CardFmtPage/utils/cardFmtHelpers'

type SegmentKind = 'even' | 'fc' | 'card' | 'odd' | 'other'

interface BitSegment {
  kind: SegmentKind
  length: number
}

const SEGMENT_STYLE: Record<SegmentKind, { bg: string; text: string; label: string }> = {
  even: { bg: '#2b2000', text: '#e8a838', label: '짝수 패리티' },
  fc: { bg: '#172d4a', text: '#4f9cf9', label: '시설 코드' },
  card: { bg: '#0d2b1a', text: '#4caf7d', label: '카드 번호' },
  odd: { bg: '#2b2000', text: '#e8a838', label: '홀수 패리티' },
  other: { bg: '#222428', text: '#555a63', label: '기타' },
}

const paintRange = (
  bits: SegmentKind[],
  loc: number,
  count: number,
  kind: SegmentKind,
): void => {
  const start = Math.max(0, Math.trunc(loc))
  const end = Math.min(bits.length, start + Math.max(0, Math.trunc(count)))
  for (let i = start; i < end; i++) {
    bits[i] = kind
  }
}

const buildBitSegments = (fmt: BitStructureSource): BitSegment[] => {
  const total = Math.max(0, Math.trunc(fmt.totalBits))
  if (total === 0) return []

  const kinds: SegmentKind[] = Array(total).fill('other')
  paintRange(kinds, fmt.evenLoc, fmt.evenBits, 'even')
  paintRange(kinds, fmt.fcLoc, fmt.fcBits, 'fc')
  paintRange(kinds, fmt.cardLoc, fmt.cardBits, 'card')
  paintRange(kinds, fmt.oddLoc, fmt.oddBits, 'odd')

  const segments: BitSegment[] = []
  let current = kinds[0]
  let length = 0

  for (const kind of kinds) {
    if (kind === current) {
      length += 1
    } else {
      segments.push({ kind: current, length })
      current = kind
      length = 1
    }
  }
  if (length > 0) segments.push({ kind: current, length })

  return segments
}

const LEGEND_ORDER: SegmentKind[] = ['fc', 'card', 'even', 'other']

interface BitVisualizerProps {
  fmt: BitStructureSource
}

export const BitVisualizer = ({ fmt }: BitVisualizerProps) => {
  const segments = buildBitSegments(fmt)
  const total = Math.max(0, Math.trunc(fmt.totalBits))

  if (total === 0) {
    return (
      <p className="text-[12px]" style={{ color: 'var(--color-text-subtle)' }}>
        총 비트 수가 0이면 시각화할 수 없습니다.
      </p>
    )
  }

  const legendKinds = LEGEND_ORDER.filter((kind) =>
    segments.some((s) => s.kind === kind || (kind === 'even' && s.kind === 'odd')),
  )
  if (segments.some((s) => s.kind === 'odd') && !legendKinds.includes('even')) {
    legendKinds.push('even')
  }

  return (
    <div>
      <div
        className="flex w-full overflow-hidden rounded"
        style={{ height: 28, border: '0.5px solid var(--color-border)' }}
      >
        {segments.map((seg, index) => {
          const style = SEGMENT_STYLE[seg.kind]
          return (
            <div
              key={`${seg.kind}-${index}`}
              className="flex items-center justify-center min-w-0 overflow-hidden"
              style={{
                flex: seg.length,
                background: style.bg,
                color: style.text,
                fontSize: 10,
                fontFamily: 'monospace',
              }}
              title={`${style.label} (${seg.length}bit)`}
            >
              {seg.length >= 3 ? seg.length : ''}
            </div>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-3 mt-2.5">
        {legendKinds.map((kind) => {
          const style = SEGMENT_STYLE[kind]
          const label = kind === 'even' ? '패리티' : style.label
          return (
            <span key={kind} className="inline-flex items-center gap-1 text-[11px]" style={{ color: style.text }}>
              <span
                className="rounded-full flex-shrink-0"
                style={{ width: 8, height: 8, background: style.bg, border: `1px solid ${style.text}` }}
              />
              {label}
            </span>
          )
        })}
        <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: SEGMENT_STYLE.other.text }}>
          <span
            className="rounded-full flex-shrink-0"
            style={{
              width: 8,
              height: 8,
              background: SEGMENT_STYLE.other.bg,
              border: `1px solid ${SEGMENT_STYLE.other.text}`,
            }}
          />
          기타
        </span>
      </div>

      <p className="text-[10px] mt-2 font-mono" style={{ color: 'var(--color-text-dim)' }}>
        0 — {total - 1} ({total} bits)
      </p>
    </div>
  )
}
