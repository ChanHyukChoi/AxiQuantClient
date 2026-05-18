interface LoginFieldProps {
  label: string
  error?: string
  children: React.ReactNode
}

export const LoginField = ({ label, error, children }: LoginFieldProps) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
      {label}
    </label>
    {children}
    {error ? (
      <span className="text-xs" style={{ color: '#f87171' }}>
        {error}
      </span>
    ) : null}
  </div>
)

export const loginInputStyle: React.CSSProperties = {
  backgroundColor: 'var(--color-bg)',
  color: 'var(--color-text)',
  border: '1px solid var(--color-text-muted)',
}

export const loginInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.borderColor = 'var(--color-accent)'
}

export const loginInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.borderColor = 'var(--color-text-muted)'
}
