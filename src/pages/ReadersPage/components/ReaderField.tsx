export const InfoField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <span className="app-text-sm block mb-0.5" style={{ color: 'var(--color-text-subtle)' }}>
      {label}
    </span>
    {children}
  </div>
)

export const FieldRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center py-1 gap-3">
    <span className="app-text-sm shrink-0" style={{ color: 'var(--color-text-subtle)' }}>
      {label}
    </span>
    <span className="app-text-md text-right break-all" style={{ color: 'var(--color-text)' }}>
      {value}
    </span>
  </div>
)

export const CheckRow = ({
  label,
  checked,
  disabled,
}: {
  label: string
  checked?: boolean
  disabled?: boolean
}) => (
  <label
    className="flex items-center gap-2 py-1 app-text-md"
    style={{
      color: disabled ? 'var(--color-text-dim)' : 'var(--color-text)',
      cursor: disabled ? 'default' : 'pointer',
    }}
  >
    <input type="checkbox" checked={checked ?? false} disabled={disabled} readOnly />
    {label}
  </label>
)
