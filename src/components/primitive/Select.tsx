import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronDown } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps {
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  options: SelectOption[]
  disabled?: boolean
  placeholder?: string
  fontSize?: number
  className?: string
}

export const Select = ({
  value,
  onChange,
  onBlur,
  options,
  disabled = false,
  placeholder = '선택',
  fontSize = 12,
  className = '',
}: SelectProps) => {
  const listboxId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const [menuRect, setMenuRect] = useState<DOMRect | null>(null)

  const selected = options.find((o) => o.value === value)

  const close = useCallback(() => {
    setOpen(false)
    onBlur?.()
  }, [onBlur])

  const updateMenuRect = useCallback(() => {
    if (!triggerRef.current) return
    setMenuRect(triggerRef.current.getBoundingClientRect())
  }, [])

  useEffect(() => {
    if (!open) return
    updateMenuRect()

    const onScrollOrResize = () => updateMenuRect()
    window.addEventListener('resize', onScrollOrResize)
    window.addEventListener('scroll', onScrollOrResize, true)

    return () => {
      window.removeEventListener('resize', onScrollOrResize)
      window.removeEventListener('scroll', onScrollOrResize, true)
    }
  }, [open, updateMenuRect])

  useEffect(() => {
    if (!open) return

    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (rootRef.current?.contains(target)) return
      const menu = document.getElementById(listboxId)
      if (menu?.contains(target)) return
      close()
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, close, listboxId])

  const pick = (next: string) => {
    onChange?.(next)
    close()
  }

  const menu =
    open && menuRect
      ? createPortal(
          <ul
            id={listboxId}
            role="listbox"
            className="app-select-menu app-scrollbar"
            style={{
              position: 'fixed',
              top: menuRect.bottom + 1,
              left: menuRect.left,
              width: menuRect.width,
              zIndex: 9999,
            }}
          >
            {options.map((opt) => {
              const isSelected = opt.value === value
              return (
                <li key={opt.value} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={opt.disabled}
                    className={[
                      'app-select-option',
                      isSelected ? 'app-select-option--selected' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    style={{ fontSize }}
                    onClick={() => pick(opt.value)}
                  >
                    <span className="truncate flex-1 min-w-0 text-left">{opt.label}</span>
                    {isSelected ? (
                      <Check
                        size={12}
                        className="flex-shrink-0"
                        style={{ color: 'var(--color-accent)' }}
                      />
                    ) : null}
                  </button>
                </li>
              )
            })}
          </ul>,
          document.body,
        )
      : null

  return (
    <div ref={rootRef} className={['relative w-full', className].filter(Boolean).join(' ')}>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={[
          'app-field-control w-full flex items-center justify-between gap-2',
          focused || open ? 'app-field-control--focused' : '',
          disabled ? 'app-field-control--disabled' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        style={{ fontSize }}
        onClick={() => {
          if (disabled) return
          if (open) close()
          else {
            updateMenuRect()
            setOpen(true)
          }
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        <span
          className="truncate flex-1 min-w-0 text-left"
          style={{ color: selected ? 'var(--color-text)' : 'var(--color-text-dim)' }}
        >
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          size={14}
          className={['app-field-control-chevron flex-shrink-0', open ? 'app-field-control-chevron--open' : '']
            .filter(Boolean)
            .join(' ')}
          style={{ color: 'var(--color-icon)' }}
        />
      </button>
      {menu}
    </div>
  )
}
