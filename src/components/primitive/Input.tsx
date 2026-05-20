import { forwardRef, useState } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = '', style, ...props }, ref) => {
    const [focused, setFocused] = useState(false)

    const borderColor = error
      ? 'var(--color-btn-danger-text)'
      : focused
        ? 'var(--color-accent)'
        : 'var(--color-input-border)'

    return (
      <div className="w-full">
        <input
          ref={ref}
          {...props}
          onFocus={(e) => {
            setFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setFocused(false)
            props.onBlur?.(e)
          }}
          style={{
            background: 'var(--color-input-bg)',
            color: 'var(--color-text)',
            borderColor,
            ...style,
          }}
          className={[
            'w-full text-[12px] px-2 py-1 rounded border outline-none transition-colors',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        />
        {error && (
          <p className="mt-0.5 text-[11px]" style={{ color: 'var(--color-btn-danger-text)' }}>
            {error}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
