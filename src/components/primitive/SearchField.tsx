import { Search } from 'lucide-react'

interface SearchFieldProps {
  placeholder?: string
  value?: string
  onChange: (value: string) => void
  className?: string
  /** Input·Select(app-field-control)와 동일 26px — 툴바 정렬용 */
  compact?: boolean
}

export const SearchField = ({
  placeholder = '검색...',
  value,
  onChange,
  className = '',
  compact = false,
}: SearchFieldProps) => (
  <div
    className={[
      'app-search-field',
      compact ? 'app-search-field--compact' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
  >
    <Search aria-hidden size={compact ? 14 : 15} />
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
)
