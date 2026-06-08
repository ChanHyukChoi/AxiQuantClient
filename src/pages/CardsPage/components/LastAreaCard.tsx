import { MapPin } from 'lucide-react'

interface LastAreaCardProps {
  area: string
  fontSize?: number
}

export const LastAreaCard = ({ area, fontSize = 15 }: LastAreaCardProps) => {
  const hasArea = area.trim().length > 0 && area !== '—'

  return (
    <div
      className="flex items-start gap-2.5 rounded-md px-2.5 py-2.5"
      style={{
        background: 'var(--color-bg)',
        border: '0.5px solid var(--color-border)',
        boxShadow: '0 1px 0 rgb(0 0 0 / 0.12)',
      }}
    >
      <span
        className="flex items-center justify-center flex-shrink-0 rounded"
        style={{
          width: 32,
          height: 32,
          background: 'var(--color-btn-hover)',
          color: 'var(--color-accent)',
        }}
      >
        <MapPin size={16} strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <p
          className="text-[11px] mb-0.5"
          style={{ color: 'var(--color-text-subtle)', fontSize: 15 }}
        >
          마지막 영역
        </p>
        <p
          className="font-medium leading-snug break-words"
          style={{
            color: hasArea ? 'var(--color-text)' : 'var(--color-text-subtle)',
            fontSize: 15,
          }}
        >
          {hasArea ? area : '기록 없음'}
        </p>
      </div>
    </div>
  )
}
