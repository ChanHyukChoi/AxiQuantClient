import { Search } from 'lucide-react'

interface SearchFieldProps {
  placeholder?: string
  value?: string
  onChange: (value: string) => void
  className?: string
}

export const SearchField = ({
  placeholder = '검색',
  value,
  onChange,
  className = '',
}: SearchFieldProps) => (
  <div className={['app-search-field', className].filter(Boolean).join(' ')}>
    <Search className="app-search-icon" aria-hidden />
    <input
      type="text"
      className="app-search-input"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
)
