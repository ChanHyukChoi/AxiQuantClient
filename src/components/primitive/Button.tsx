import { Loader2 } from 'lucide-react'
import { useState } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'accent' | 'danger'
  size?: 'sm' | 'md'
  fontSize?: number
  leftIcon?: React.ReactNode
  loading?: boolean
}

const variantBase: Record<NonNullable<ButtonProps['variant']>, React.CSSProperties> = {
  default: {
    background: 'transparent',
    color: 'var(--color-text)',
    borderColor: 'var(--color-btn-default-border)',
  },
  accent: {
    background: 'var(--color-btn-accent-bg)',
    color: 'var(--color-btn-accent-text)',
    borderColor: 'var(--color-btn-accent-border)',
  },
  danger: {
    background: 'transparent',
    color: 'var(--color-btn-danger-text)',
    borderColor: 'var(--color-btn-danger-border)',
  },
}

const variantHover: Record<NonNullable<ButtonProps['variant']>, React.CSSProperties> = {
  default: {
    background: 'var(--color-btn-hover)',
    color: 'var(--color-text)',
    borderColor: 'var(--color-btn-default-border)',
  },
  accent: {
    background: 'var(--color-btn-accent-hover)',
    color: 'var(--color-btn-accent-text)',
    borderColor: 'var(--color-btn-accent-border)',
  },
  danger: {
    background: 'var(--color-btn-hover)',
    color: 'var(--color-btn-danger-text)',
    borderColor: 'var(--color-btn-danger-border)',
  },
}

const sizeClass: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-2.5 py-1',
  md: 'px-3 py-1.5',
}

export const Button = ({
  variant = 'default',
  size = 'md',
  fontSize = 15,
  leftIcon,
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) => {
  const [hovered, setHovered] = useState(false)

  const isDisabled = disabled || loading
  const baseStyle = hovered && !isDisabled ? variantHover[variant] : variantBase[variant]

  return (
    <button
      {...props}
      disabled={isDisabled}
      onMouseEnter={(e) => {
        setHovered(true)
        props.onMouseEnter?.(e)
      }}
      onMouseLeave={(e) => {
        setHovered(false)
        props.onMouseLeave?.(e)
      }}
      style={{ ...baseStyle, ...props.style, fontSize }}
      className={[
        'inline-flex items-center gap-1.5 rounded border cursor-pointer transition-colors',
        sizeClass[size],
        isDisabled ? 'opacity-50 cursor-not-allowed' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {loading && <Loader2 className="w-3 h-3 animate-spin" />}
      {!loading && leftIcon && <span className="flex items-center">{leftIcon}</span>}
      {children}
    </button>
  )
}
