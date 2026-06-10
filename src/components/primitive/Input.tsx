import { forwardRef, useState } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = '', style, ...props }, ref) => {
    const [focused, setFocused] = useState(false)

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
            ...(error ? { borderColor: 'var(--color-btn-danger-text)' } : {}),
            ...style,
          }}
          className={[
            'app-field-control',
            focused && !error ? 'app-field-control--focused' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        />
        {error ? <p className="app-field-error">{error}</p> : null}
      </div>
    )
  },
)

Input.displayName = 'Input'
