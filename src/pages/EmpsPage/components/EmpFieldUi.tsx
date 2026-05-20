import { Badge } from '@/components/primitive/Badge'
import type { CardInfo } from '@/types/api'

export const Avatar = ({ name, size }: { name: string; size: 26 | 46 }) => (
  <div
    className="rounded-full flex-shrink-0 flex items-center justify-center font-medium"
    style={{
      width: size,
      height: size,
      background: 'var(--color-btn-accent-bg)',
      color: 'var(--color-accent)',
      fontSize: size === 26 ? 12 : 18,
    }}
  >
    {name.charAt(0)}
  </div>
)

export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <p
    className="text-[12px] font-medium tracking-wide pb-1.5 mb-2"
    style={{
      color: 'var(--color-text-subtle)',
      borderBottom: '0.5px solid var(--color-border)',
    }}
  >
    {children}
  </p>
)

export const FRow = ({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) => (
  <div className="flex justify-between items-center py-1 gap-2">
    <span
      className="text-[12px] flex items-center gap-1.5 flex-shrink-0"
      style={{ color: 'var(--color-text-subtle)' }}
    >
      {icon}
      {label}
    </span>
    {children}
  </div>
)

export const FieldValue = ({
  children,
  mono = false,
  small = false,
}: {
  children: React.ReactNode
  mono?: boolean
  small?: boolean
}) => (
  <span
    className={[
      'text-right',
      mono ? 'font-mono' : '',
      small ? 'text-[12px]' : 'text-[13px]',
    ]
      .filter(Boolean)
      .join(' ')}
    style={{ color: 'var(--color-text)' }}
  >
    {children}
  </span>
)

export const CardItem = ({ card }: { card: CardInfo }) => (
  <div
    className="rounded p-2.5 mb-2"
    style={{ border: '0.5px solid var(--color-border)' }}
  >
    <div className="flex items-center justify-between">
      <Badge variant="card">카드</Badge>
      <Badge variant={card.isActive ? 'on' : 'off'}>
        {card.isActive ? '활성' : '반납'}
      </Badge>
    </div>
    <p className="text-[13px] font-mono mt-1.5" style={{ color: 'var(--color-cell)' }}>
      {card.cardNumber}
    </p>
    <div
      className="flex gap-2 mt-1"
      style={{ fontSize: 12, color: 'var(--color-text-subtle)' }}
    >
      {card.issuedAt ? <span>발급: {card.issuedAt}</span> : null}
      {card.expiredAt ? (
        <span>
          {card.isActive ? '만료:' : '반납:'} {card.expiredAt}
        </span>
      ) : null}
    </div>
  </div>
)
