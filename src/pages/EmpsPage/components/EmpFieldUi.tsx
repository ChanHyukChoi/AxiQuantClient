/** 드로어 폼 — 라벨(좌) / 값·입력(우) 정렬용 고정 너비 */
export const FIELD_CONTROL_WIDTH = 180

export const fieldControlStyle: React.CSSProperties = {
  width: FIELD_CONTROL_WIDTH,
  maxWidth: '100%',
}

export const SectionTitle = ({
  children,
  fontSize,
}: {
  children: React.ReactNode
  fontSize?: number
}) => (
  <p
    className={[
      'font-medium tracking-wide pb-1.5 mb-2',
      fontSize == null ? 'app-text-sm' : '',
    ]
      .filter(Boolean)
      .join(' ')}
    style={{
      color: 'var(--color-text-subtle)',
      borderBottom: '0.5px solid var(--color-border)',
      ...(fontSize != null ? { fontSize } : {}),
    }}
  >
    {children}
  </p>
)

export const FRow = ({
  icon,
  label,
  children,
  fontSize,
  align = 'center',
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
  fontSize?: number
  align?: 'center' | 'top'
}) => (
  <div
    className={[
      'flex py-1 gap-3 min-w-0',
      align === 'top' ? 'items-start' : 'items-center',
    ].join(' ')}
  >
    <span
      className={[
        'flex items-center gap-1.5 flex-shrink-0',
        fontSize == null ? 'app-text-sm' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        color: 'var(--color-text-subtle)',
        ...(fontSize != null ? { fontSize } : {}),
      }}
    >
      {icon}
      {label}
    </span>
    <div
      className={[
        'flex flex-1 justify-end min-w-0',
        align === 'top' ? 'items-start' : 'items-center',
      ].join(' ')}
    >
      <div className="min-w-0 text-left" style={fieldControlStyle}>
        {children}
      </div>
    </div>
  </div>
)

export const FieldValue = ({
  children,
  mono = false,
  small = false,
  fontSize,
}: {
  children: React.ReactNode
  mono?: boolean
  small?: boolean
  fontSize?: number
}) => (
  <span
    className={[
      'text-right',
      mono ? 'font-mono' : '',
      fontSize == null && !small ? 'text-[15px]' : '',
      fontSize == null && small ? 'text-[14px]' : '',
    ]
      .filter(Boolean)
      .join(' ')}
    style={{
      color: 'var(--color-text)',
      ...(fontSize != null ? { fontSize } : {}),
    }}
  >
    {children}
  </span>
)
