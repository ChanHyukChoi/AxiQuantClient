import { Check } from 'lucide-react'
import { Badge } from '@/components/primitive/Badge'

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

export const selectLikeStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--color-btn-hover)',
  color: 'var(--color-text)',
  borderColor: 'var(--color-btn-default-border)',
}

export const typeBadgeVariant = (
  type: string,
): NonNullable<React.ComponentProps<typeof Badge>['variant']> => {
  if (type === '방문') return 'visit'
  if (type === '발급') return 'issue'
  return 'card'
}

export const CheckboxLook = ({ checked }: { checked: boolean }) => (
  <div
    className="w-[14px] h-[14px] rounded border flex items-center justify-center flex-shrink-0"
    style={{
      background: checked ? '#172d4a' : 'var(--color-btn-hover)',
      borderColor: checked ? '#1e4570' : '#2e3139',
    }}
  >
    {checked ? <Check size={10} style={{ color: 'var(--color-accent)' }} /> : null}
  </div>
)
