import { Shield } from 'lucide-react'
import { Badge } from '@/components/primitive/Badge'

export interface CardAccLvDisplayItem {
  id: number
  name: string
  isActive: boolean
  description?: string
  acttm?: string
}

interface AccLvGroupCardsProps {
  items: CardAccLvDisplayItem[]
  fontSize?: number
}

/** 2개까지는 전체 표시, 3개부터 목록 영역만 스크롤 */
const ACC_LV_VISIBLE_WITHOUT_SCROLL = 2

export const AccLvGroupCards = ({ items, fontSize = 15 }: AccLvGroupCardsProps) => {
  if (items.length === 0) {
    return (
      <div
        className="rounded-md px-3 py-4 text-center"
        style={{
          border: '0.5px dashed var(--color-border)',
          color: 'var(--color-text-subtle)',
          background: 'var(--color-bg)',
          fontSize: 15,
        }}
      >
        할당된 권한 그룹이 없습니다
      </div>
    )
  }

  const listClass = [
    'flex flex-col gap-2 w-full',
    items.length > ACC_LV_VISIBLE_WITHOUT_SCROLL ? 'app-acc-lv-list-panel app-scrollbar' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={listClass}>
      {items.map((item) => (
        <div
          key={item.id}
          className="flex flex-col gap-1.5 w-full rounded-md px-2.5 py-2"
          style={{
            background: 'var(--color-bg)',
            border: '0.5px solid var(--color-border)',
            boxShadow: '0 1px 0 rgb(0 0 0 / 0.12)',
          }}
        >
          <div className="flex items-start gap-2 min-w-0">
            <span
              className="flex items-center justify-center flex-shrink-0 rounded"
              style={{
                width: 28,
                height: 28,
                background: 'var(--color-btn-hover)',
                color: 'var(--color-accent)',
              }}
            >
              <Shield size={14} strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1">
              <p
                className="font-medium truncate leading-snug"
                style={{ color: 'var(--color-text)', fontSize }}
                title={item.name}
              >
                {item.name}
              </p>
            </div>
          </div>
          {item.description ? (
            <p
              className="text-[13px] line-clamp-2 leading-snug"
              style={{ color: 'var(--color-text-muted)' }}
              title={item.description}
            >
              {item.description}
            </p>
          ) : null}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <Badge variant={item.isActive ? 'on' : 'off'}>
              {item.isActive ? '활성' : '비활성'}
            </Badge>
            {item.acttm ? (
              <span
                className="text-[12px] truncate"
                style={{ color: 'var(--color-text-subtle)' }}
                title={item.acttm}
              >
                {item.acttm}
              </span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  )
}
