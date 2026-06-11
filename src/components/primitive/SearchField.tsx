import { Search } from 'lucide-react'

interface SearchFieldProps {
  placeholder?: string
  value?: string
  onChange: (value: string) => void
  className?: string
  /** 부모 너비에 맞춤 — 기본은 고정 너비(--size-search-toolbar-width) */
  fill?: boolean
}

export const SearchField = ({
  placeholder = '검색...',
  value,
  onChange,
  className = '',
  fill = false,
}: SearchFieldProps) => (
  <div
    className={['app-search-field', fill ? 'app-search-field--fill' : '', className]
      .filter(Boolean)
      .join(' ')}
  >
    <Search aria-hidden size={14} />
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
)
