import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { BitStructureSource } from '@/pages/CardFmtPage/utils/cardFmtHelpers'

type SegmentKind = 'even' | 'fc' | 'card' | 'odd' | 'other'

interface BitSegment {
  kind: SegmentKind
  length: number
}

const SEGMENT_COLORS: Record<SegmentKind, { bg: string; text: string }> = {
  even: { bg: '#2b2000', text: '#e8a838' },
  fc: { bg: '#172d4a', text: '#4f9cf9' },
  card: { bg: '#0d2b1a', text: '#4caf7d' },
  odd: { bg: '#2b2000', text: '#e8a838' },
  other: { bg: '#222428', text: '#555a63' },
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
  const { t } = useTranslation('cardFmt')
  const segmentLabels = useMemo(
    () => ({
      even: t('bit.evenParity'),
      fc: t('bit.facility'),
      card: t('bit.cardNumber'),
      odd: t('bit.oddParity'),
      other: t('bit.other'),
    }),
    [t],
  )

  const segments = buildBitSegments(fmt)
  const total = Math.max(0, Math.trunc(fmt.totalBits))

  if (total === 0) {
    return (
      <p className="text-[14px]" style={{ color: 'var(--color-text-subtle)' }}>
        {t('bit.zeroBitsHint')}
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
          const colors = SEGMENT_COLORS[seg.kind]
          const label = segmentLabels[seg.kind]
          return (
            <div
              key={`${seg.kind}-${index}`}
              className="flex items-center justify-center min-w-0 overflow-hidden"
              style={{
                flex: seg.length,
                background: colors.bg,
                color: colors.text,
                fontSize: 10,
                fontFamily: 'monospace',
              }}
              title={`${label} (${seg.length}bit)`}
            >
              {seg.length >= 3 ? seg.length : ''}
            </div>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-3 mt-2.5">
        {legendKinds.map((kind) => {
          const colors = SEGMENT_COLORS[kind]
          const label = kind === 'even' ? t('bit.parityShort') : segmentLabels[kind]
          return (
            <span
              key={kind}
              className="inline-flex items-center gap-1 text-[13px]"
              style={{ color: colors.text }}
            >
              <span
                className="rounded-full flex-shrink-0"
                style={{
                  width: 8,
                  height: 8,
                  background: colors.bg,
                  border: `1px solid ${colors.text}`,
                }}
              />
              {label}
            </span>
          )
        })}
        <span
          className="inline-flex items-center gap-1 text-[13px]"
          style={{ color: SEGMENT_COLORS.other.text }}
        >
          <span
            className="rounded-full flex-shrink-0"
            style={{
              width: 8,
              height: 8,
              background: SEGMENT_COLORS.other.bg,
              border: `1px solid ${SEGMENT_COLORS.other.text}`,
            }}
          />
          {segmentLabels.other}
        </span>
      </div>

      <p className="text-[12px] mt-2 font-mono" style={{ color: 'var(--color-text-dim)' }}>
        0 — {total - 1} ({total} bits)
      </p>
    </div>
  )
}
