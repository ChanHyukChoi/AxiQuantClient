import { Check } from 'lucide-react'

interface CheckboxProps {
  checked: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  readOnly?: boolean
  id?: string
  className?: string
  size?: number
}

export const Checkbox = ({
  checked,
  onChange,
  disabled = false,
  readOnly = false,
  id,
  className = '',
  size = 14,
}: CheckboxProps) => {
  const boxClass = [
    'app-checkbox-box',
    checked ? 'app-checkbox-box--checked' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const iconSize = Math.max(8, size - 4)

  if (readOnly || onChange == null) {
    return (
      <span
        className={[boxClass, className].filter(Boolean).join(' ')}
        style={{ width: size, height: size }}
        aria-hidden
      >
        {checked ? (
          <Check size={iconSize} style={{ color: 'var(--color-accent)' }} strokeWidth={2.5} />
        ) : null}
      </span>
    )
  }

  return (
    <label
      className={[
        'app-checkbox',
        disabled ? 'app-checkbox--disabled' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="app-checkbox-input"
      />
      <span className={boxClass} style={{ width: size, height: size }}>
        {checked ? (
          <Check size={iconSize} style={{ color: 'var(--color-accent)' }} strokeWidth={2.5} />
        ) : null}
      </span>
    </label>
  )
}
