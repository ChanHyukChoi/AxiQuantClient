import { Search } from 'lucide-react'

interface SearchFieldProps {
  placeholder?: string
  value?: string
  onChange: (value: string) => void
}

export const SearchField = ({ value, onChange }: SearchFieldProps) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 8px',
      borderRadius: 4,
      background: 'var(--color-search-bg)',
      border: '0.5px solid var(--color-search-border)',
    }}
  >
    <Search aria-hidden size={13} color="var(--color-search-icon)" />
    <input
      type="text"
      style={{
        background: 'transparent',
        color: 'var(--color-text)',
        fontSize: 15,
        outline: 'none',
        minWidth: 0,
        flex: 1,
      }}
      placeholder="검색..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
)
