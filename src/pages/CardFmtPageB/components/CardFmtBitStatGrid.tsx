import type { CardfmtInfo } from '@/types/api'

const BIT_STATS: { label: string; key: keyof CardfmtInfo }[] = [
  { label: '총 비트 수', key: 'totalBits' },
  { label: '카드 번호 비트 수', key: 'cardBits' },
  { label: '시설 코드 시작', key: 'fcLoc' },
  { label: '시설 코드 크기', key: 'fcBits' },
  { label: '카드번호 시작', key: 'cardLoc' },
  { label: '짝수 패리티', key: 'evenBits' },
]

export const CardFmtBitStatGrid = ({ cardfmt }: { cardfmt: CardfmtInfo }) => (
  <div className="grid grid-cols-2 gap-2 mb-3">
    {BIT_STATS.map(({ label, key }) => (
      <div
        key={key}
        className="rounded p-2.5"
        style={{
          border: '0.5px solid var(--color-border)',
          background: 'var(--color-btn-hover)',
        }}
      >
        <p className="text-[10px] mb-1" style={{ color: 'var(--color-text-dim)' }}>
          {label}
        </p>
        <p
          className="text-[16px] font-mono font-medium"
          style={{ color: 'var(--color-text)' }}
        >
          {Number(cardfmt[key])}
        </p>
      </div>
    ))}
  </div>
)
